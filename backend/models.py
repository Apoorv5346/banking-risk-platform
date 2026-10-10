from pydantic import BaseModel, Field
from datetime import datetime


class TransactionCreate(BaseModel):
    transaction_id: str = Field(..., min_length=3)
    customer_id: str = Field(..., min_length=3)
    amount: float = Field(..., gt=0)
    transaction_type: str
    channel: str
    merchant_category: str
    location: str
    is_international: bool = False
    timestamp: datetime