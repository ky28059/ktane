import asyncio
import websockets
import requests
import json

# Fetch the lobby ID from the server
r = requests.post("http://localhost:8000/lobby", json={"difficulty": 0})
lobby_id = r.json()["lobby_id"]
print(f"[DEBUG]: lobby_id received is: {lobby_id}")

# WebSocket URL
WS_URL = "ws://localhost:8000/ws/" + lobby_id  # Adjust to your server URL

# Helper function for logging
def log(client, message):
    print(f"[{client}] {message}")

# Function to connect, listen, and send a "died" message
async def connect_and_listen(client_name):
    try:
        async with websockets.connect(WS_URL) as ws:
            # Receive role assignment
            msg1 = await ws.recv()
            log(client_name, msg1)

            # Receive start signal
            msg2 = await ws.recv()
            log(client_name, msg2)

            # Receive config
            msg3 = await ws.recv()
            log(client_name, msg3)

            # Send a "died" message to test termination
            await asyncio.sleep(5)
            died_message = json.dumps({"state": "submitted", "code": "import os"})
            await ws.send(died_message)
            log(client_name, f"Sent 'submitted' message: {died_message}")

            # Wait for the server to close the connection
            try:
                msg4 = await ws.recv()
                log(client_name, msg4)
            except websockets.exceptions.ConnectionClosed:
                log(client_name, "Connection closed by server after 'died' message.")
    except Exception as e:
        log(client_name, f"Error: {e}")

# Function to simulate a failed connection
async def connect_and_fail():
    try:
        async with websockets.connect(WS_URL + "test_lobby") as ws:
            msg = await ws.recv()
            log("Client 3", f"Unexpected message: {msg}")
    except websockets.exceptions.ConnectionClosed as e:
        log("Client 3", f"Connection failed as expected: {e.reason}")

# Main function to run the test
async def main():
    task1 = asyncio.create_task(connect_and_listen("Client 1"))
    await asyncio.sleep(0.5)
    
    task2 = asyncio.create_task(connect_and_listen("Client 2"))
    await asyncio.sleep(0.5)
    
    await connect_and_fail()
    
    await task1
    await task2

if __name__ == "__main__":
    asyncio.run(main())