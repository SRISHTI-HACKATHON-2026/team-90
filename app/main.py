from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.db.database import engine, Base

from sqlalchemy import text

app = FastAPI(title="Eco-Ledger")


# ✅ SAFE DB INIT (runs after app starts)
@app.on_event("startup")
def startup_event():
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)

        # Add missing columns safely
        with engine.connect() as conn:
            for col, col_type in [
                ("sender", "VARCHAR"),
                ("type", "VARCHAR"),
                ("message", "VARCHAR"),
            ]:
                try:
                    conn.execute(text(f"ALTER TABLE logs ADD COLUMN {col} {col_type}"))
                    conn.commit()
                except Exception:
                    conn.rollback()  # already exists → ignore

        print("✅ Database initialized")

    except Exception as e:
        print("⚠️ DB init failed (continuing):", e)


# ✅ CORS (correct)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routes
app.include_router(router)


@app.get("/")
def root():
    return {"message": "Eco-Ledger API is running"}