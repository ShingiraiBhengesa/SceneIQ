"""Token blacklist service using Redis to invalidate JWT tokens on logout."""

from redis import Redis

from app.config import settings
from app.database import get_redis_client


def blacklist_token(token: str, expire_seconds: int | None = None) -> None:
    """Add a token to the blacklist so it can no longer be used."""
    if expire_seconds is None:
        expire_seconds = settings.access_token_expire_minutes * 60

    redis_client: Redis = get_redis_client()
    redis_client.setex(f"blacklist:{token}", expire_seconds, "1")


def is_token_blacklisted(token: str) -> bool:
    """Check if a token has been blacklisted (i.e., user logged out)."""
    redis_client: Redis = get_redis_client()
    return redis_client.exists(f"blacklist:{token}") > 0
