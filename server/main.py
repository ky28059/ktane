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

        # Step 4: Broadcast to the lobby when both players are connected
        if len(lobby["sessions"]) == 2:
            if "game_state" in lobby:
                await websocket.send_json(lobby["game_state"])
            else:
                lobby["game_state"] = {
                    "difficulty": lobby["difficulty"],  # Default difficulty, adjust as needed
                    "bind": generate_bind(0),  # Default difficulty
                    "code_data": grab_test_data(0),  # Default difficulty
                    "end_time": int(time.time() + 300) * 1000
                }
                for ws in lobby["sessions"].values():
                    # THIS IS WHERE THE PROBLEM IS
                    print(ws)
                    print(ws.state)
                    print(ws.client_state)
                    await ws.send_json(lobby["game_state"])

        # Step 5: Main game loop
        while True:
            if (websocket != lobby["sessions"][session_id]):
                await websocket.close(code=1000, reason="Just died in the loop")
                return
            if len(lobby["sessions"]) != 2:
                await asyncio.sleep(1)
                continue
            try:
                data = await asyncio.wait_for(websocket.receive_json(), timeout=1.0)
                if data.get("state") == "submitted":
                    code_data = lobby["game_state"]["code_data"]
                    code_data["code"] = data.get("code")

                    # Broadcast to render loading screen first for kevin
                    for id, ws in lobby["sessions"].items():
                        try:
                            await ws.send_json({"type": "finished"})
                        except Exception as e:
                            del lobby["sessions"][id]
                            print(e)


                    result = submit_testcase(code_data)

                    # The actual result is sent
                    for id, ws in lobby["sessions"].items():
                        try:
                            await ws.send_json({"type": "result", "data": result})
                        except Exception as e:
                            del lobby["sessions"][id]
                            print(e)
                    break
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                print("FUCKEEDDDDD")
                print(f"Error: {e}")
                break
    except Exception as e:
        print("-" * 100)
        print(f"Unexpected error: {e}")
        print("-" * 100)
        return

    # Step 6: Clean up on disconnect
    for ws in lobby["sessions"].values():
        await ws.send_json({"type": "ended"})
        await ws.close(code=1000, reason="done for good")
    # Purge the lobby
    del INMEM_LOBBY[lobby_id]