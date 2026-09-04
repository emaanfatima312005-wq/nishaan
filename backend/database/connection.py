import os

from dotenv import load_dotenv
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Allow the app to boot without a database (for example
# while configuring a deployment) — the API and frontend
# are still served, and database-dependent endpoints
# return a clear error instead of crashing at import time.
engine = (
    create_engine(DATABASE_URL)
    if DATABASE_URL
    else None
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    if engine is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "DATABASE_URL is not configured."
            ),
        )

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()