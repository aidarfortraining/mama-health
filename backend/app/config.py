from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Use SQLite for local development if PostgreSQL is not available
    DATABASE_URL: str = "sqlite+aiosqlite:///./brain_training.db"

    class Config:
        env_file = ".env"

settings = Settings()
