"""
Database configuration using SQLAlchemy 2.x.
Manages the session lifecycle and engine creation.
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool, NullPool
from .config import settings

# SQLAlchemy engine configuration
engine_kwargs = {
    "pool_size": 20,
    "max_overflow": 30,
    "pool_timeout": 30,
}

def get_engine():
    """Get or create the database engine."""
    if settings.ENVIRONMENT == "test":
        # For testing, use in-memory SQLite
        return create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    else:
        # For production/development, use PostgreSQL/SQLite
        return create_engine(
            settings.DATABASE_URL,
            **engine_kwargs,
        )

# Create engine at module load time (except during alembic migrations)
import sys
if "alembic" not in sys.modules:
    engine = get_engine()
else:
    engine = None

# ORM base class
Base = declarative_base()

# Session factory
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

# Dependency to get DB session
def get_db():
    """Dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create all tables
def create_all_tables():
    """Create all database tables from models."""
    Base.metadata.create_all(bind=get_engine())

# Drop all tables (use with caution!)
def drop_all_tables():
    """Drop all database tables."""
    Base.metadata.drop_all(bind=get_engine())