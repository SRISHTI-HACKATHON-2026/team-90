from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.api.routes import router
from app.db.database import engine, Base
from app.db.database import get_db

from sqlalchemy import text

app = FastAPI(title="Eco-Ledger")

# 👇 CREATE TABLES (VERY IMPORTANT)
Base.metadata.create_all(bind=engine)

# 👇 SAFELY ADD NEW COLUMNS TO EXISTING TABLES
with engine.connect() as conn:
    for col, col_type in [("sender", "VARCHAR"), ("type", "VARCHAR"), ("message", "VARCHAR")]:
        try:
            conn.execute(text(f"ALTER TABLE logs ADD COLUMN {col} {col_type}"))
            conn.commit()
        except Exception:
            conn.rollback()  # Column already exists, skip

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {"message": "Eco-Ledger API is running"}