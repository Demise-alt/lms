"""
Base model for all SQLAlchemy ORM models.
Provides common fields: id, created_at, updated_at, and soft delete support.
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, String, Boolean, func
from ..core.database import Base


class BaseModel(Base):
    """Base model providing common columns for all entities."""

    __abstract__ = True

    id = Column(
        String(36),  # UUID as string
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4()),
        comment="Unique identifier (UUID v4)"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        comment="Timestamp when record was created"
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        comment="Timestamp when record was last updated"
    )

    is_deleted = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Soft delete flag"
    )

    deleted_at = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Timestamp when record was soft deleted"
    )

    def soft_delete(self):
        """Mark this record as deleted (soft delete)."""
        self.is_deleted = True
        self.deleted_at = datetime.utcnow()

    def restore(self):
        """Restore a soft-deleted record."""
        self.is_deleted = False
        self.deleted_at = None