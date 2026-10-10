
import os
from database import db, client

print("Python file:", os.path.abspath(__file__))
print("Database:", db.name)
print("MongoDB host:", client.address)
print("Collection:", db.transactions.full_name)
print("Transaction count:", db.transactions.count_documents({}))
print("Transaction IDs:", db.transactions.distinct("transaction_id"))