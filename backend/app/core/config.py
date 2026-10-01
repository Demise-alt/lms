"""
Application settings and environment configuration.
Uses pydantic-settings for type-safe environment variable loading.
"""

from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from typing import List
import json


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Enterprise Learning & Training Management System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = Field(default="sqlite:///./eltms.db")

    # JWT Authentication
    JWT_SECRET: str = Field(
        default="your-jwt-secret-key-change-this-in-production"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Password hashing
    BCRYPT_ROUNDS: int = 12

    # CORS
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:3000", "http://localhost"])

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # File storage
    STORAGE_PATH: str = "./storage"

    # Security
    SECRET_KEY: str = Field(
        default="your-secret-key-change-this-in-production"
    )

    # Analytics
    ANALYTICS_CACHE_TTL: int = 300

    class Config:
        env_file = None  # Disable .env file loading to avoid parsing issues
        env_file_encoding = "utf-8"

# Singleton instance
settings = Settings()

def get_settings():
    """Get the application settings."""
    return settings