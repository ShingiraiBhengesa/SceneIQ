# SceneIQ Backend (Sprint 1)

FastAPI backend for authentication, user profile CRUD, and foundational database schema.

## Stack
- FastAPI + SQLAlchemy + Alembic
- PostgreSQL (primary DB)
- Redis (connection configured for future session caching)
- JWT auth (`python-jose`) + password hashing (`passlib[bcrypt]`)
- Docker + Docker Compose

## Quick Start

From the project root directory:

```bash
docker compose up --build
```

This starts:
- API at `http://localhost:8000`
- Swagger docs at `http://localhost:8000/docs`
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

On startup, the API container runs:
1. `alembic upgrade head`
2. `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`

## Environment Variables

- `DATABASE_URL` (e.g. `postgresql://postgres:postgres@db:5432/visionassist`)
- `JWT_SECRET`
- `JWT_ALGORITHM` (default `HS256`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` (default `60`)
- `REDIS_URL`

## Implemented Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout` (JWT required)
- `GET /api/users/profile` (JWT required)
- `PUT /api/users/profile` (JWT required)
- `GET /api/health`

## Migration

Initial migration creates:
- `users`
- `analysis_history`

including indexes:
- `idx_users_email`
- `idx_history_user_id`

## Swagger Flow Test

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. Click **Authorize** in Swagger and paste `Bearer <access_token>`
4. `GET /api/users/profile`
5. `PUT /api/users/profile`
