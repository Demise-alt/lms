"""
User, Role, and Permission models for authentication and RBAC.
"""

from sqlalchemy import Column, String, Boolean, DateTime, Table, ForeignKey, UniqueConstraint, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .base import BaseModel
from ..core.database import Base


# Association tables for many-to-many relationships
# Define them FIRST before the models so they are in Base.metadata

# Role-Permission association
role_permission = Table(
    "role_permission",
    Base.metadata,
    Column("role_id", String(36), ForeignKey("roles.id"), primary_key=True),
    Column("permission_id", String(36), ForeignKey("permissions.id"), primary_key=True),
)

# User-Role association
user_role = Table(
    "user_role",
    Base.metadata,
    Column("user_id", String(36), ForeignKey("users.id"), primary_key=True),
    Column("role_id", String(36), ForeignKey("roles.id"), primary_key=True),
)


class Permission(BaseModel):
    """Model representing a system permission."""
    __tablename__ = "permissions"

    name = Column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
        comment="Permission identifier (e.g., 'trainings.read', 'users.create')"
    )
    description = Column(
        String(255),
        nullable=True,
        comment="Human-readable description of the permission"
    )
    resource = Column(
        String(50),
        nullable=True,
        comment="Resource this permission applies to (e.g., 'trainings', 'employees')"
    )
    action = Column(
        String(20),
        nullable=True,
        comment="Action this permission allows (e.g., 'create', 'read', 'update', 'delete')"
    )

    # Relationships
    roles = relationship(
        "Role",
        secondary=role_permission,
        back_populates="permissions",
        lazy="select",
    )

    __table_args__ = (
        UniqueConstraint("name", "resource", "action", name="uq_permission_nra"),
    )

    def __repr__(self):
        return f"<Permission {self.name}>"


class Role(BaseModel):
    """Model representing a user role with associated permissions."""
    __tablename__ = "roles"

    name = Column(
        String(50),
        nullable=False,
        unique=True,
        index=True,
        comment="Role name (e.g., 'super_admin', 'employee')"
    )
    description = Column(
        String(255),
        nullable=True,
        comment="Human-readable description of the role"
    )
    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether this role is active"
    )

    # Relationships - use the association tables defined above
    permissions = relationship(
        "Permission",
        secondary=role_permission,
        back_populates="roles",
        lazy="select",
    )
    users = relationship(
        "User",
        secondary=user_role,
        back_populates="roles",
        lazy="select",
    )

    __table_args__ = (
        UniqueConstraint("name", "is_active", name="uq_role_name_active"),
    )

    def __repr__(self):
        return f"<Role {self.name}>"


class User(BaseModel):
    """Model representing a system user."""
    __tablename__ = "users"

    email = Column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
        comment="User's email address (used for login)"
    )
    full_name = Column(
        String(100),
        nullable=False,
        comment="User's full name"
    )
    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Whether the user account is active"
    )
    is_superuser = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Whether this user has super admin privileges"
    )
    hashed_password = Column(
        String(255),
        nullable=False,
        comment="Hashed password using Argon2"
    )
    last_login = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Timestamp of last login"
    )
    login_count = Column(
        Integer,
        default=0,
        nullable=False,
        comment="Number of successful logins"
    )

    # Relationships - use the association table defined above
    roles = relationship(
        "Role",
        secondary=user_role,
        back_populates="users",
        lazy="select",
    )

    __table_args__ = (
        UniqueConstraint("email", "is_active", name="uq_user_email_active"),
    )

    def __repr__(self):
        return f"<User {self.email}>"

    def has_permission(self, permission_name: str, resource: str = None, action: str = None) -> bool:
        """
        Check if this user has a specific permission.

        Args:
            permission_name: The permission name to check
            resource: Optional resource to filter by
            action: Optional action to filter by

        Returns:
            True if the user has the permission, False otherwise
        """
        # Superusers have all permissions
        if self.is_superuser:
            return True

        # Check user's roles and their permissions
        for role in self.roles:
            for permission in role.permissions:
                if permission.name == permission_name:
                    if resource and permission.resource != resource:
                        continue
                    if action and permission.action != action:
                        continue
                    return True
        return False