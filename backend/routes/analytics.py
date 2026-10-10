
from fastapi import APIRouter
from database import transactions_collection

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/summary")
def get_analytics_summary():
    total_transactions = transactions_collection.count_documents({})

    amount_pipeline = [
        {
            "$group": {
                "_id": None,
                "total_amount": {"$sum": "$amount"},
            }
        }
    ]

    amount_result = list(
        transactions_collection.aggregate(amount_pipeline)
    )

    total_amount = (
        amount_result[0]["total_amount"]
        if amount_result
        else 0
    )

    risk_counts = {
        "Low": transactions_collection.count_documents(
            {"risk_level": "Low"}
        ),
        "Medium": transactions_collection.count_documents(
            {"risk_level": "Medium"}
        ),
        "High": transactions_collection.count_documents(
            {"risk_level": "High"}
        ),
        "Critical": transactions_collection.count_documents(
            {"risk_level": "Critical"}
        ),
    }

    channel_pipeline = [
        {
            "$group": {
                "_id": "$channel",
                "count": {"$sum": 1},
                "total_amount": {"$sum": "$amount"},
            }
        },
        {
            "$sort": {"count": -1}
        }
    ]

    channel_result = list(
        transactions_collection.aggregate(channel_pipeline)
    )

    channel_distribution = [
        {
            "channel": item["_id"] or "Unknown",
            "count": item["count"],
            "total_amount": item["total_amount"],
        }
        for item in channel_result
    ]

    return {
        "total_transactions": total_transactions,
        "total_amount": total_amount,
        "risk_distribution": risk_counts,
        "channel_distribution": channel_distribution,
    }
