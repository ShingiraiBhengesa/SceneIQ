from redis import Redis
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings


# Connection settings tuned for cloud Postgres (e.g., Supabase)
# to avoid long hangs when the DB/network is slow.
connect_args: dict = {}
if settings.database_url.startswith("postgresql"):
    # Fail fast instead of hanging indefinitely on DB connect.
    connect_args["connect_timeout"] = 5

if "supabase" in settings.database_url or "sslmode" in settings.database_url:
    connect_args["sslmode"] = "require"

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_timeout=10,
    connect_args=connect_args,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_redis_client() -> Redis:
    # Upstash uses rediss:// (TLS). The ssl_cert_reqs=None avoids certificate issues.
    if settings.redis_url.startswith("rediss://"):
        return Redis.from_url(settings.redis_url, decode_responses=True, ssl_cert_reqs=None)
    return Redis.from_url(settings.redis_url, decode_responses=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
