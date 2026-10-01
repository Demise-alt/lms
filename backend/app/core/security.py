"""
Security utilities for authentication.
Handles JWT token creation/validation and password hashing.
"""

import time
from jose import JWTError, jwt
from passlib.context import CryptContext
from .config import settings

# Password hashing context using Argon2
# passlib's CryptContext with argon2 is the recommended approach
pwd_context = CryptContext(
    schemes=["argon2"],
    default="argon2",
    deprecated="auto",
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password using Argon2."""
    return pwd_context.hash(password)

def decode_token(token: str) -> dict:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None

def create_access_token(
    subject: str | int,
    expires_delta: int | None = None,
    additional_claims: dict | None = None
) -> str:
    """Create a JWT access token."""
    import datetime
    
    if expires_delta:
        expire = datetime.datetime.utcnow() + datetime.timedelta(
            minutes=expires_delta
        )
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {
        "exp": expire,
        "iat": datetime.datetime.utcnow(),
        "sub": str(subject),
    }
    
    if additional_claims:
        to_encode.update(additional_claims)
    
    encoded = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded