from fastapi import FastAPI, WebSocket, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import secrets
from db.connections import *    # Is this bad?
from utils import *
import asyncio
import time
from pprint import pprint


DB_COLLECTIONS = get_collections()

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://host.docker.internal:3000",
    "*"
    # TODO: prod endpoint
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/lobby")
async def get_lobby(request: Request):
    # Get the raw JSON body
    raw_body = await request.body()
    
    # Parse the JSON data
    try:
        json_data = json.loads(raw_body)
    except json.JSONDecodeError:
        # Return a 400 Bad Request if the JSON is invalid
        raise HTTPException(status_code=400, detail="Invalid JSON data")

    if "difficulty" not in json_data:
        raise HTTPException(status_code=400, detail="Invalid JSON data")

    # Gen until we have a non-existing lobby, should not hang lol

    while True:
        lobby_id = secrets.token_hex(10)
        if DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id}):
            # Duplicate lmaoo
            continue

        # Log the lobby_id

        try:
            # Initialize with empty data
            DB_COLLECTIONS["lobbies"].insert_one({"lobby_id": lobby_id, "manual_in": False, "coder_in": False, "locked": False, "difficulty": json_data["difficulty"]})
            return JSONResponse(content={"lobby_id": lobby_id})
        except Exception as e:
            logging.error(str(e))
            continue


@app.websocket("/ws/{lobby_id}")
async def websocket_endpoint(websocket: WebSocket, lobby_id: str):
    print("HEY BRO IM INNNNNN")
    await websocket.accept()

    first = False
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
            print("I LOCKED THE LOBBY")
            DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"locked": True}})
            break
    
    my_role = 0

    # If someone already assumes a role, you take the other one
    if lobby_info["manual_in"] == True:
        my_role = 1

        # Update the database

        DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"coder_in": True}})
        DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"exp": int((time.time() + 300) * 1000)}})

    elif lobby_info["coder_in"] == True:
        DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"manual_in": True}})
        DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"exp": int((time.time() + 300) * 1000)}})

    else:
        first = True
        config = generate_bind(lobby_info["difficulty"]) # Assuming Jack is the GOAT no error
        DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"config": config}})
        my_role = int(time.time()) % 2
        if my_role == 0:
            DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"manual_in": True}})
        else:
            DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"coder_in": True}})

    # Release the manual lock

    DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"locked": False}})

    print("BRO I RELEASED THE LOCKED ALREADYYYYYYYY")

    # ---- That is end of locking code

    # Have a checker loop to wait for the players
    

    # First send who i am

    await websocket.send_json({"type": "role", "data": "manual" if my_role == 0 else "coder"})

    # Then wait for the other guy
    if first:
        while True:
            print("Waiting for bro to connect")
            await asyncio.sleep(0.5)  # Use asyncio.sleep instead of time.sleep
            lobby_info = DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id})
            if lobby_info["manual_in"] and lobby_info["coder_in"]:
                break

    else:
        while True:
            print("Make sure config is there")
            await asyncio.sleep(0.5)  # Use asyncio.sleep instead of time.sleep
            lobby_info = DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id})
            if "config" in lobby_info:
                break

    # Then I start sending

    lobby_info = DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id})
    config = lobby_info["config"]

    pprint(lobby_info)

    # TODO: ensure kevin handles this

    code_data = grab_test_data(lobby_info["difficulty"])

    await websocket.send_json({
        "type": "start",
        "end_time": lobby_info["exp"],
        "config": config,
        "code_data": code_data
    })

    DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"config": config}})

    # Both players would have to see this while loop to receive start signal

    while True:
        try:
            # Check the status of the database

            lobby_info = DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id})

            if "purgable" in lobby_info:
                print("\n\n FINISHED SO I GET THE RESULT LAST\n\n")
                # This is the case for the second guy

                result = lobby_info["result"]
                await websocket.send_json({"type": "result", "data": result})
                await websocket.close(code=1000)
                # Purge the lobby after submission (Because I'm the second guy)

                DB_COLLECTIONS["lobbies"].delete_many({"lobby_id": lobby_id})
                return
            
            data = await asyncio.wait_for(websocket.receive_json(), timeout=1.0)

            if data["state"] == "submitted":
                code_data["code"] = data["code"]
                result = submit_testcase(code_data)
                logging.info(f"Testcase submitted: {result}")

                # Write to the database

                DB_COLLECTIONS["lobbies"].update_one({"lobby_id": lobby_id}, {"$set": {"purgable": True, "result": result}})

                await websocket.send_json({"type": "result", "data": result})
                await websocket.close(code=1000)
                break
            else:
                lobby_info = DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id})
                if not lobby_info:
                    await websocket.close(code=1000)

        except asyncio.TimeoutError:
            continue
        except Exception as e:
            print(str(e))
            await websocket.send_json({"error": str(e), "cooked": True})
            await websocket.close(code=1000)
            return
