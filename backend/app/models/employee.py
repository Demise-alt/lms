"""
Employee and Department models.
"""

from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .base import BaseModel


class Department(BaseModel):
    """Model representing a company department."""
    __tablename__ = "departments"

    name = Column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
        comment="Department name (e.g., 'Sales', 'IT', 'HR')"
    )
    description = Column(
        String(255),
        nullable=True,
        comment="Department description"
    )
    code = Column(
        String(20),
        nullable=True,
        unique=True,
        index=True,
        comment="Department code (e.g., 'SALES', 'IT')"
    )
    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether the department is active"
    )

    # Relationships
    employees = relationship(
        "Employee",
        back_populates="department",
        lazy="select",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        UniqueConstraint("code", "is_active", name="uq_dept_code_active"),
    )

    def __repr__(self):
        return f"<Department {self.name}>"


class Employee(BaseModel):
    """Model representing an employee."""
    __tablename__ = "employees"

    employee_id = Column(
        String(20),
        nullable=False,
        unique=True,
        index=True,
        comment="Unique employee identifier (e.g., EMP-001)"
    )
    first_name = Column(
        String(50),
        nullable=False,
        comment="Employee's first name"
    )
    last_name = Column(
        String(50),
        nullable=False,
        comment="Employee's last name"
    )
    email = Column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
        comment="Employee's email address"
    )
    department_id = Column(
        String(36),
        ForeignKey("departments.id"),
        nullable=True,
        comment="Foreign key to department"
    )
    manager_id = Column(
        String(36),
        ForeignKey("employees.id"),
        nullable=True,
        comment="Foreign key to manager employee (self-referential)"
    )
    designation = Column(
        String(100),
        nullable=True,
        comment="Employee's job title/designation"
    )
    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether the employee is active"
    )
    hire_date = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Employee's joining date"
    )

    # Relationships
    department = relationship(
        "Department",
        back_populates="employees",
        lazy="select",
    )
    manager = relationship(
        "Employee",
        remote_side=lambda: Employee.id,
        foreign_keys=[manager_id],
        backref="direct_reports",
        lazy="select",
    )

    # Indexes
    __table_args__ = (
        Index("ix_employees_department_id", "department_id"),
        Index("ix_employees_manager_id", "manager_id"),
    )

    def __repr__(self):
        return f"<Employee {self.employee_id}: {self.first_name} {self.last_name}>"