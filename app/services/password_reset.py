import secrets
from datetime import datetime, timedelta, timezone


# In-memory store: { token: { "email": str, "expires_at": datetime } }
_reset_tokens: dict[str, dict] = {}

TOKEN_EXPIRY_MINUTES = 30


def generate_reset_token(email: str) -> str:
    token = secrets.token_urlsafe(32)
    _reset_tokens[token] = {
        "email": email,
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRY_MINUTES),
    }
    return token


def validate_reset_token(token: str) -> str | None:
    entry = _reset_tokens.get(token)
    if not entry:
        return None
    if datetime.now(timezone.utc) > entry["expires_at"]:
        del _reset_tokens[token]
        return None
    return entry["email"]


def consume_reset_token(token: str) -> None:
    _reset_tokens.pop(token, None)
