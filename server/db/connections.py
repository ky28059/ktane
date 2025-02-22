from dotenv import load_dotenv
import logging
import os
from pymongo import MongoClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "localhost:27017")
logging.debug(f"MongoURL is {MONGO_URL}")

MONGO_CLIENT = MongoClient(MONGO_URL)

def get_collections():
    db = MONGO_CLIENT["ktane"]
    return {
        "lobbies": db["lobbies"]
    }


