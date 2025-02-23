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
from typing import Dict, List, Optional
import traceback
from websockets.protocol import State  # Import State to check if it's open



DB_COLLECTIONS = get_collections()

GLOBAL_LOCK = asyncio.Lock()

INMEM_LOBBY = {}

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


# Debugging route

@app.get("/debug")
async def debug():
    return HTMLResponse("hi")


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
        if lobby_id in INMEM_LOBBY:
            # Duplicate lmaoo
            continue

        # Log the lobby_id

        try:
            # Initialize with empty data

            INMEM_LOBBY[lobby_id] = {"difficulty": json_data["difficulty"], "sessions": dict()}
            return JSONResponse(content={"lobby_id": lobby_id})
        except Exception as e:
            logging.error(str(e))
            continue
    

@app.websocket("/ws/{lobby_id}")
async def websocket_endpoint(websocket: WebSocket, lobby_id: str):
    await websocket.accept()
    if lobby_id not in INMEM_LOBBY:
        await websocket.close(code=1008, reason="What the lobby?")
        return
    try:
        # Step 1: Wait for the client to send their session_id
        session_data = await asyncio.wait_for(websocket.receive_json(), timeout=2.0)
        session_id = session_data.get("session_id")
        if not session_id:
            await websocket.close(code=1008, reason="No session_id provided")
            return
    except asyncio.TimeoutError:
        await websocket.close(code=1008, reason="No session_id provided")
        return
    lobby = INMEM_LOBBY[lobby_id]
    if session_id in lobby["sessions"]:
        old_websocket = lobby["sessions"][session_id]
        print(old_websocket)
        await old_websocket.close(code=1000, reason="Bro got replaced")
        lobby["sessions"][session_id] = websocket
        print(lobby["sessions"][session_id])
    elif len(lobby["sessions"]) >= 2:
        await websocket.close(code=1008, reason="You are not welcomed")
        return
    else:
        lobby["sessions"][session_id] = websocket
        print(lobby["sessions"][session_id])

    try:
        # Step 3: Send role and other initialization data
        role = "manual" if len(lobby["sessions"]) == 1 else "coder"
        await websocket.send_json({"type": "role", "data": role})

    # Then wait for the other guy
    if first:
        while True:
            print("Waiting for bro to connect")
            await asyncio.sleep(0.5)  # Use asyncio.sleep instead of time.sleep
            lobby_info = DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id})
            pprint(lobby_info)
            if lobby_info["manual_in"] and lobby_info["coder_in"]:
                break

    else:
        while True:
            print("Make sure config is there")
            await asyncio.sleep(0.5)  # Use asyncio.sleep instead of time.sleep
            lobby_info = DB_COLLECTIONS["lobbies"].find_one({"lobby_id": lobby_id})
            pprint(lobby_info)
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


                    result = submit_testcase(code_data)

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


# TODO: delete this baseline endpoint after everything works

@app.websocket("/ws/test/{lobby_id}")
async def websocket_endpoint(websocket: WebSocket, lobby_id: str):
    await websocket.accept()
    await websocket.send_json({"message": f"Connected to {lobby_id}"})
    while True:
        data = await websocket.receive_text()
        await websocket.send_json({"message": f"You said: {data}"})