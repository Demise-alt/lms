"""
Learning Material model for training content.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .base import BaseModel


class LearningMaterial(BaseModel):
    """Model representing learning material (PDF, video, doc, link)."""
    __tablename__ = "learning_materials"

    title = Column(
        String(200),
        nullable=False,
        comment="Material title"
    )
    description = Column(
        Text,
        nullable=True,
        comment="Material description"
    )
    material_type = Column(
        String(50),
        nullable=False,
        comment="Type: PDF, PPT, DOC, Video, Image, Link"
    )
    file_path = Column(
        String(500),
        nullable=True,
        comment="Storage file path or external URL"
    )
    file_size = Column(
        Integer,
        nullable=True,
        comment="File size in bytes"
    )
    version = Column(
        Integer,
        default=1,
        nullable=False,
        comment="Material version"
    )
    module_id = Column(
        String(36),
        ForeignKey("modules.id"),
        nullable=False,
        comment="Foreign key to module"
    )
    uploaded_by_id = Column(
        String(36),
        ForeignKey("users.id"),
        nullable=True,
        comment="User ID who uploaded the material"
    )

    # Relationships
    module = relationship(
        "app.models.training.Module",
        back_populates="learning_materials",
        lazy="select",
    )
    uploaded_by = relationship(
        "app.models.user.User",
        backref="materials_uploaded",
        lazy="select",
    )

    __table_args__ = (
        Index("ix_learning_materials_module_id", "module_id"),
        Index("ix_learning_materials_type", "material_type"),
    )

    TYPE_CHOICES = ["PDF", "PPT", "DOC", "Video", "Image", "Link"]

    def __repr__(self):
        return f"<LearningMaterial {self.title} ({self.material_type})>"