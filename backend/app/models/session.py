"""
Training Session and Attendance models.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .base import BaseModel


class TrainingSession(BaseModel):
    """Model representing a live training session."""
    __tablename__ = "training_sessions"

    title = Column(
        String(200),
        nullable=False,
        comment="Session title"
    )
    training_program_id = Column(
        String(36),
        ForeignKey("training_programs.id"),
        nullable=False,
        comment="Foreign key to training program"
    )
    module_id = Column(
        String(36),
        ForeignKey("modules.id"),
        nullable=True,
        comment="Optional module ID"
    )
    trainer_id = Column(
        String(36),
        ForeignKey("users.id"),
        nullable=True,
        comment="Session trainer (user ID)"
    )
    start_time = Column(
        DateTime(timezone=True),
        nullable=False,
        comment="Session start time"
    )
    end_time = Column(
        DateTime(timezone=True),
        nullable=False,
        comment="Session end time"
    )
    location = Column(
        String(255),
        nullable=True,
        comment="Physical location or meeting room"
    )
    meeting_url = Column(
        String(500),
        nullable=True,
        comment="Online meeting URL (e.g., Zoom, Teams)"
    )
    capacity = Column(
        Integer,
        nullable=True,
        comment="Maximum session capacity"
    )
    status = Column(
        String(20),
        nullable=False,
        default="Scheduled",
        comment="Session status: Scheduled, In Progress, Completed, Cancelled"
    )

    # Relationships
    training_program = relationship(
        "TrainingProgram",
        backref="sessions",
        lazy="select",
    )
    module = relationship(
        "app.models.training.Module",
        backref="sessions",
        lazy="select",
    )
    trainer = relationship(
        "app.models.user.User",
        backref="sessions_trained",
        lazy="select",
    )
    attendance_records = relationship(
        "Attendance",
        back_populates="session",
        cascade="all, delete-orphan",
        lazy="select",
    )

    __table_args__ = (
        Index("ix_training_sessions_training_program_id", "training_program_id"),
        Index("ix_training_sessions_start_time", "start_time"),
        Index("ix_training_sessions_status", "status"),
    )

    STATUS_CHOICES = ["Scheduled", "In Progress", "Completed", "Cancelled"]

    def __repr__(self):
        return f"<TrainingSession {self.title}>"


class Attendance(BaseModel):
    """Model representing an employee's attendance in a session."""
    __tablename__ = "attendance"

    session_id = Column(
        String(36),
        ForeignKey("training_sessions.id"),
        nullable=False,
        comment="Training session ID"
    )
    employee_id = Column(
        String(36),
        ForeignKey("employees.id"),
        nullable=False,
        comment="Employee ID"
    )
    status = Column(
        String(20),
        nullable=False,
        default="Present",
        comment="Attendance status: Present, Absent, Late, Excused"
    )
    check_in_time = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Actual check-in time"
    )
    check_out_time = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Actual check-out time"
    )
    notes = Column(
        String(500),
        nullable=True,
        comment="Attendance notes (e.g., reason for absence)"
    )

    # Relationships
    session = relationship(
        "TrainingSession",
        back_populates="attendance_records",
        lazy="select",
    )
    employee = relationship(
        "Employee",
        backref="attendance_records",
        lazy="select",
    )

    __table_args__ = (
        UniqueConstraint("session_id", "employee_id", name="uq_attendance_session_emp"),
        Index("ix_attendance_session_id", "session_id"),
        Index("ix_attendance_employee_id", "employee_id"),
        Index("ix_attendance_status", "status"),
    )

    STATUS_CHOICES = ["Present", "Absent", "Late", "Excused"]

    def __repr__(self):
        return f"<Attendance {self.employee_id} @ {self.session_id}: {self.status}>"