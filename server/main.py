from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
import json
import secrets
from db.connections import *    # Is this bad?
from utils import *
import asyncio
import time



DB_COLLECTIONS = get_collections()

app = FastAPI()

# Insane amount of debugging routes just to be
@app.get("/dumpall")
async def dump_all():
    """Dump all collections in the database."""
    result = {}
    for name, collection in DB_COLLECTIONS.items():
        result[name] = [serialize_document(doc) for doc in collection.find({})]
    return result


@app.post("/emptydb")
async def empty_db():
    """Delete all documents from all collections in the database."""
    try:
        for name, collection in DB_COLLECTIONS.items():
            collection.delete_many({})  # Deletes all documents in the collection
        return {"message": "All collections emptied successfully"}
    except Exception as e:
        logging.error(f"Error emptying database: {e}")
        raise HTTPException(status_code=500, detail="Failed to empty the database")

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
    # Gen until we have a non-existing lobby, should not hang lol

    while True:
        lobby_id = secrets.token_hex(10)
        if DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id}):
            # Duplicate lmaoo
            continue

        # Log the lobby_id

        try:
            # Initialize with empty data
            DB_COLLECTIONS["lobbies"].insert_one({"lobby_id": lobby_id, "config": {}, "manual_in": False, "coder_in": False, "locked": False})
            return JSONResponse(content={"lobby_id": lobby_id})
        except Exception as e:
            logging.error(str(e))
            continue
    

@app.websocket("/ws/{lobby_id}")
async def websocket_endpoint(websocket: WebSocket, lobby_id: str):
    # Scuffed while loop for locking the db
    lobby_info = None
    while True:
        lobby_info = DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id})
        if not lobby_info:
            await websocket.close(code=1008, reason="Invalid lobby_id?!")
            return
        
        # Handle case 2 players in already

        if lobby_info["manual_in"] == True and lobby_info["coder_in"] == True:
            await websocket.close(code=1008, reason="Lobby is full, bye bye!")
            return
        if lobby_info["locked"] == True:
            continue
        else:
            DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"locked": True}})
            break
    
    await websocket.accept()

    my_role = 0

    # If someone already assumes a role, you take the other one
    if lobby_info["manual_in"] == True:
        my_role = 1

        # Update the database

        DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"coder_in": True}})

    elif lobby_info["coder_in"] == True:
        DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"manual_in": True}})
    else:
        my_role = int(time.time()) % 2
        if my_role == 0:
            DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"manual_in": True}})
        else:
            DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"coder_in": True}})

    # Release the manual lock

    DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"locked": False}})

    # ---- That is end of locking code
    
    # Kevin said just send it once

    config = generate_bind()
    await websocket.send_json({"type": "config", "data": config})

    DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"config": config}})

    code_data = grab_test_data()
    await websocket.send_json({"type": "code_data", "data": code_data})

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