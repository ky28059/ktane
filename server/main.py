from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse, JSONResponse
import json
import requests
import secrets
from db.connections import *    # Is this bad?

DB_COLLECTIONS = get_collections()

app = FastAPI()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Real-Time App</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <textarea id="messages" cols="30" rows="10" readonly></textarea><br>
        <input type="text" id="messageText" autocomplete="off"/><button onclick="sendMessage()">Send</button>
        <script>
            const ws = new WebSocket("ws://localhost:8000/ws/" + (Math.random() + 1).toString(36).substring(2));
            ws.onmessage = function(event) {
                const messages = document.getElementById('messages');
                messages.value += event.data + '\\n';
            };
            function sendMessage() {
                const input = document.getElementById("messageText");
                ws.send(input.value);
                input.value = '';
            }
        </script>
    </body>
</html>
"""

# Debugging route

@app.get("/debug")
async def debug():
    return HTMLResponse(html)


# Just no security and let user generate a lobby id freely ig

@app.get("/get-lobby")
async def get_lobby():
    # Gen until we have a non-exisiting lobby, should not hang lol

    while True:
        lobby_id = secrets.token_hex(10)
        if DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id}):
            continue

        # Log the lobby_id

        try:
            # Initialize with empty data
            DB_COLLECTIONS["lobbies"].insert_one({"lobby_id": lobby_id, "data": {}})
            return JSONResponse(content={"lobby_id": lobby_id})
        except Exception as e:
            logging.error(str(e))
            continue
    

@app.websocket("/ws/{lobby_id}")
async def websocket_endpoint(websocket: WebSocket, lobby_id: str):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}, Lobby id was {lobby_id}")