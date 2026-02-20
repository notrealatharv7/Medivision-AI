from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    # Fallback logic: check if we are on Render (or just use /tmp if . is not writable)
    # Simple check: try to write to current dir
    try:
        with open("test_write_perm", "w") as f:
            f.write("test")
        os.remove("test_write_perm")
        SQLALCHEMY_DATABASE_URL = "sqlite:///./medvision.db"
    except OSError:
        # If not writable, use /tmp
        print("Root directory not writable, using /tmp for SQLite")
        SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/medvision.db"

connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
