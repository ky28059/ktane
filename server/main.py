from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse, JSONResponse
import json
import secrets
from db.connections import *    # Is this bad?
from utils import *
import asyncio


DB_COLLECTIONS = get_collections()

app = FastAPI()

@app.get("/dumpall")
async def dump_all():
    """Dump all collections in the database."""
    result = {}
    for name, collection in DB_COLLECTIONS.items():
        result[name] = [serialize_document(doc) for doc in collection.find({})]
    return result

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
            # Duplicate lmaoo
            continue

        # Log the lobby_id

        try:
            # Initialize with empty data
            DB_COLLECTIONS["lobbies"].insert_one({"lobby_id": lobby_id, "config": {}})
            return JSONResponse(content={"lobby_id": lobby_id})
        except Exception as e:
            logging.error(str(e))
            continue
    

@app.websocket("/ws/{lobby_id}")
async def websocket_endpoint(websocket: WebSocket, lobby_id: str):
    if not DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id}):
        await websocket.close(code=1008, reason="Invalid lobby_id?!")
        return

    await websocket.accept()
    
    # Kevin said just send it once

    config = generate_bind()
    await websocket.send_json(config)

    DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"config": config}})

    code_data = grab_test_data()
    await websocket.send_json(code_data)

    while True:
        data = await websocket.receive_text()
        parsed_data = json.loads(data)

        if parsed_data["state"] == "died":
            await websocket.send_json({"killed": True})
            await websocket.close(code=1000)
            DB_COLLECTIONS["lobbies"].delete_many({"lobby_id": lobby_id})
            break

        elif parsed_data["state"] == "submitted":
            result = submit_testcase(parsed_data["code"])
            logging.info(f"Testcase submitted: {result}")
            await websocket.send_json(result)
            await websocket.close(code=1000)

            # Purge the lobby after submission
            DB_COLLECTIONS["lobbies"].delete_many({"lobby_id": lobby_id})
            break