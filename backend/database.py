import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI missing. Configure it in backend/.env"
    )

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=5000
)

database = client[os.getenv("MONGODB_DATABASE", "banking_risk")]
transactions_collection = database["transactions"]

client.admin.command("ping")