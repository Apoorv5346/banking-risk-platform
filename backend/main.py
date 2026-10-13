
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.transactions import router as transactions_router
from routes.analytics import router as analytics_router

app = FastAPI(
    title="Banking Transaction Risk & Customer Analytics Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "healthy"}


app.include_router(transactions_router)
app.include_router(analytics_router)
