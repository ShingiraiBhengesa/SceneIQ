import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass
class Settings:
    app_name: str = "VisionAssist API"
    app_version: str = "1.0.0"
    database_url: str = os.getenv(
        "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/visionassist"
    )
    jwt_secret: str = os.getenv("JWT_SECRET", "change-this-in-production")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    cors_origins: list[str] = None

    def __post_init__(self) -> None:
        if self.cors_origins is None:
            self.cors_origins = ["http://localhost:3000"]


settings = Settings()
