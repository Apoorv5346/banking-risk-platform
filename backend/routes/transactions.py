
from fastapi import APIRouter, HTTPException, status

from database import transactions_collection
from models import TransactionCreate
from risk_engine import calculate_risk


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


# CREATE TRANSACTION
@router.post("", status_code=status.HTTP_201_CREATED)
def create_transaction(transaction: TransactionCreate):

    # Check duplicate transaction ID
    existing_transaction = transactions_collection.find_one(
        {"transaction_id": transaction.transaction_id}
    )

    if existing_transaction:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Transaction ID already exists"
        )

    # Convert Pydantic model to dictionary
    transaction_data = transaction.model_dump()

    # Calculate risk
    risk_result = calculate_risk(transaction_data)

    # Add risk information
    transaction_data.update(risk_result)

    # Save transaction in MongoDB
    result = transactions_collection.insert_one(transaction_data)

    return {
        "message": "Transaction created successfully",
        "transaction_id": transaction.transaction_id,
        "risk_score": risk_result["risk_score"],
        "risk_level": risk_result["risk_level"],
        "reasons": risk_result["reasons"],
        "database_id": str(result.inserted_id)
    }


# GET ALL TRANSACTIONS WITH SEARCH, FILTERS AND PAGINATION
@router.get("")
def get_transactions(
    page: int = 1,
    limit: int = 10,
    risk_level: str | None = None,
    channel: str | None = None,
    customer_id: str | None = None,
    transaction_id: str | None = None
):

    # Validate page
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page must be greater than 0"
        )

    # Validate limit
    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be between 1 and 100"
        )

    # Build MongoDB filter
    query = {}

    if transaction_id and transaction_id.strip():
        query["transaction_id"] = transaction_id.strip()

    if risk_level:
        query["risk_level"] = risk_level

    if channel:
        query["channel"] = channel

    if customer_id:
        query["customer_id"] = customer_id

    # Calculate total matching transactions
    total = transactions_collection.count_documents(query)

    # Calculate pagination
    skip = (page - 1) * limit

    # Fetch transactions
    transactions = list(
        transactions_collection
        .find(query, {"_id": 0})
        .sort("timestamp", -1)
        .skip(skip)
        .limit(limit)
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "filters": {
            "transaction_id": transaction_id,
            "risk_level": risk_level,
            "channel": channel,
            "customer_id": customer_id
        },
        "data": transactions
    }


# GET SINGLE TRANSACTION BY ID
@router.get("/{transaction_id}")
def get_transaction(transaction_id: str):

    transaction = transactions_collection.find_one(
        {"transaction_id": transaction_id},
        {"_id": 0}
    )

    if transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

    return transaction
