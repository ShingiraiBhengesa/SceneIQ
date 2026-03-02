# 🚀 SceneIQ Backend — Complete Setup Guide (Cloud Database)

This guide walks you through getting the SceneIQ backend running with **Supabase** (cloud PostgreSQL) and **Upstash** (cloud Redis). Every step has a ✅ verification check.

---

## 📋 What You'll Set Up

| Service | What It Does | Cost |
|---------|-------------|------|
| **Supabase** | Cloud PostgreSQL database (stores users & analysis history) | Free tier |
| **Upstash** | Cloud Redis (used for token blacklisting on logout) | Free tier |
| **Python venv** | Isolated Python environment for your project | Free |
| **Alembic** | Creates your database tables automatically | Free |
| **Uvicorn** | Web server that runs your FastAPI app | Free |

---

## Step 1: Create a Supabase Database (5 minutes)

### 1a. Create an Account

1. Open your browser and go to **https://supabase.com**
2. Click **"Start your project"** (the big green button)
3. Sign up with your **GitHub account** (easiest) or email
4. You'll land on the Supabase Dashboard

### 1b. Create a New Project

1. Click **"New Project"**
2. Fill in:
   - **Name:** `SceneIQ` (or whatever you want)
   - **Database Password:** Choose a strong password — **WRITE THIS DOWN**, you'll need it!
   - **Region:** Pick the one closest to you (e.g., `East US` or `West EU`)
3. Click **"Create new project"**
4. ⏳ Wait 1-2 minutes for the project to finish setting up (you'll see a loading spinner)

### 1c. Get Your Database Connection String

1. In your Supabase project, click **"Settings"** (gear icon) in the left sidebar
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"**
4. Click the **"URI"** tab
5. You'll see something like:

```
postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

6. **Replace `[YOUR-PASSWORD]`** with the database password you chose in step 1b
7. **Copy this entire connection string** — you'll paste it in Step 3

### ✅ Verify Step 1

Your connection string should look like this (with your own values):

```
postgresql://postgres.abcdefghijk:MySecretPass123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Make sure:
- It starts with `postgresql://`
- The password is filled in (not `[YOUR-PASSWORD]`)
- It ends with `/postgres`

---

## Step 2: Create an Upstash Redis Database (3 minutes)

### 2a. Create an Account

1. Open your browser and go to **https://upstash.com**
2. Click **"Sign Up"**
3. Sign up with your **GitHub account** (easiest) or email

### 2b. Create a Redis Database

1. You'll land on the Upstash Console. Click **"Create Database"**
2. Fill in:
   - **Name:** `sceneiq-redis`
   - **Type:** Select **"Regional"**
   - **Region:** Pick the one closest to your Supabase region (e.g., `US-East-1`)
3. Click **"Create"**

### 2c. Get Your Redis Connection String

1. After creating, you'll be on the database details page
2. Scroll down and find the section that says **"Connect to your database"**
3. Look for the **`rediss://`** URL. It looks like:

```
rediss://default:AbC123xYz@us1-example-12345.upstash.io:6379
```

4. **Copy this URL** — you'll paste it in Step 3

### ✅ Verify Step 2

Your Redis URL should:
- Start with `rediss://` (note the double `s` — that means it uses TLS/encryption)
- Contain `@` and end with `:6379`

---

## Step 3: Set Up Your `.env` File

Now we connect your app to these cloud services.

1. Open the file `.env` in your project (it's in the root folder of SceneIQ)
2. Replace the placeholder values with your real connection strings:

```env
# ─── Database (Supabase PostgreSQL) ────────────────────────
DATABASE_URL=postgresql://postgres.abcdefghijk:MySecretPass123@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# ─── Authentication ────────────────────────────────────────
JWT_SECRET=sceneiq-dev-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# ─── Redis (Upstash) ──────────────────────────────────────
REDIS_URL=rediss://default:AbC123xYz@us1-example-12345.upstash.io:6379
```

> ⚠️ **Important:** Replace the `DATABASE_URL` and `REDIS_URL` with YOUR actual values from Steps 1 and 2. The ones above are examples.

### ✅ Verify Step 3

```bash
cat .env
```

Make sure:
- `DATABASE_URL` has your Supabase connection string (not `localhost`)
- `REDIS_URL` has your Upstash URL (starts with `rediss://`, not `redis://`)
- No extra spaces around the `=` signs

---

## Step 4: Set Up Python Virtual Environment

Open your **Terminal** and navigate to the project:

```bash
cd ~/Desktop/PSD/SceneIQ
```

Create a virtual environment:

```bash
python3 -m venv .venv
```

Activate it:

```bash
source .venv/bin/activate
```

You should see **`(.venv)`** appear at the beginning of your terminal prompt, like:

```
(.venv) Mac:SceneIQ shingiebhengesa$
```

### ✅ Verify Step 4

```bash
which python
```

Should show: `/Users/shingiebhengesa/Desktop/PSD/SceneIQ/.venv/bin/python`

---

## Step 5: Install Python Dependencies

With your virtual environment activated (you should see `(.venv)` in your prompt):

```bash
pip install -r requirements.txt
```

This downloads and installs all the packages the app needs. It may take 1-2 minutes.

### ✅ Verify Step 5

Run these three commands:

```bash
python -c "import fastapi; print(f'FastAPI {fastapi.__version__} ✅')"
python -c "import sqlalchemy; print(f'SQLAlchemy {sqlalchemy.__version__} ✅')"
python -c "import redis; print(f'Redis {redis.__version__} ✅')"
```

All three should print a version number with ✅.

---

## Step 6: Run Database Migrations (Create Your Tables)

This is the step that creates the `users` and `analysis_history` tables in your Supabase database:

```bash
alembic upgrade head
```

You should see output like:

```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 20260216_01, create users and analysis_history tables
```

### ✅ Verify Step 6 (Two ways)

**Way 1 — From your terminal:**

```bash
python -c "
from app.database import SessionLocal
from sqlalchemy import text
with SessionLocal() as db:
    result = db.execute(text(\"SELECT table_name FROM information_schema.tables WHERE table_schema='public'\"))
    tables = [row[0] for row in result]
    print('Tables in your database:', tables)
    assert 'users' in tables, '❌ users table missing!'
    assert 'analysis_history' in tables, '❌ analysis_history table missing!'
    print('✅ All tables created successfully!')
"
```

**Way 2 — From Supabase Dashboard:**

1. Go to your Supabase project
2. Click **"Table Editor"** in the left sidebar
3. You should see **`users`** and **`analysis_history`** tables listed

---

## Step 7: Start the API Server

```bash
uvicorn app.main:app --reload --port 8000
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to stop)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Application startup complete.
```

> 💡 **Keep this terminal running!** Open a **new terminal tab** (Cmd + T) for the next steps.

### ✅ Verify Step 7

In a **new terminal tab**, run:

```bash
curl http://localhost:8000/api/health
```

You should see:

```json
{"status":"healthy","database":"connected","version":"1.0.0"}
```

🎉 **If you see `"database":"connected"` — your app is talking to Supabase!**

You can also open your browser and go to **http://localhost:8000/docs** to see the interactive Swagger UI.

---

## Step 8: Test All the API Endpoints

Open a **new terminal tab** (keep the server running in the other tab).

### 8a. Register a New User

```bash
curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}' | python -m json.tool
```

**Expected:** A JSON response with `access_token` and `user` info.

📋 **Copy the `access_token` value** — you need it for the next steps! It looks like: `eyJhbGciOi...`

To make it easy, save it to a variable:

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test2@example.com", "password": "password123"}' | python -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

echo "Your token: $TOKEN"
```

### 8b. Login

```bash
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' | python -m json.tool
```

**Expected:** A new `access_token` and your user info.

Save this token too:

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' | python -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
```

### 8c. Get Your Profile

```bash
curl -s http://localhost:8000/api/users/profile \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool
```

**Expected:** Your user profile (name, email, speech_rate, high_contrast, etc.)

### 8d. Update Your Profile

```bash
curl -s -X PUT http://localhost:8000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Updated Name", "speech_rate": 1.5, "high_contrast": true}' | python -m json.tool
```

**Expected:** Updated profile with new values.

### 8e. Logout (Token Blacklisting)

```bash
curl -s -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool
```

**Expected:** `{"message": "Logged out successfully"}`

Now try using the **same token** again:

```bash
curl -s http://localhost:8000/api/users/profile \
  -H "Authorization: Bearer $TOKEN" | python -m json.tool
```

**Expected:** `{"detail": "Token has been revoked"}` — the token is blacklisted in Upstash Redis! 🔒

### 8f. Verify Data in Supabase Dashboard

1. Go to your Supabase project → **Table Editor**
2. Click on the **`users`** table
3. You should see the user(s) you just created!

---

## 🛑 How to Stop

### Stop the API server
Press `Ctrl + C` in the terminal where uvicorn is running.

### Deactivate virtual environment
```bash
deactivate
```

> PostgreSQL and Redis are in the cloud — no need to stop them!

---

## 🔁 How to Start Again Next Time

```bash
# 1. Go to your project
cd ~/Desktop/PSD/SceneIQ

# 2. Activate virtual environment
source .venv/bin/activate

# 3. Start the server
uvicorn app.main:app --reload --port 8000
```

That's it! The cloud databases are always running.

---

## 📁 Project Structure

```
SceneIQ/
├── .env                    ← Your secret config (Supabase + Upstash URLs) — NEVER commit this!
├── .env.example            ← Template showing what .env should look like
├── requirements.txt        ← Python packages needed
├── alembic.ini             ← Alembic (migration tool) config
├── alembic/
│   ├── env.py              ← Tells Alembic how to connect to your DB
│   └── versions/           ← Migration scripts (create/modify tables)
├── app/
│   ├── main.py             ← App entry point, sets up FastAPI
│   ├── config.py           ← Reads settings from .env
│   ├── database.py         ← Database + Redis connection setup (SSL-ready)
│   ├── models/             ← SQLAlchemy models (Python ↔ Database tables)
│   │   ├── user.py         ← User table definition
│   │   └── analysis_history.py ← Analysis history table definition
│   ├── schemas/            ← Pydantic schemas (request/response validation)
│   │   └── user.py         ← User-related request/response shapes
│   ├── routers/            ← API route handlers
│   │   ├── auth.py         ← /api/auth/* (register, login, logout)
│   │   └── users.py        ← /api/users/* (profile)
│   ├── services/           ← Business logic
│   │   ├── auth_service.py ← Password hashing, JWT tokens
│   │   └── token_blacklist.py ← Upstash Redis token blacklisting
│   └── middleware/
│       └── auth_middleware.py ← JWT validation + blacklist checking
└── docker-compose.yml      ← (Alternative) Run with Docker containers
```

---

## ❓ Common Issues

| Problem | Solution |
|---------|----------|
| `connection refused` or `timeout` | Check your `DATABASE_URL` in `.env` — is it your Supabase URL? |
| `password authentication failed` | Make sure you replaced `[YOUR-PASSWORD]` in the Supabase URL |
| `SSL SYSCALL error` | Your Supabase project might be paused — go to dashboard and unpause it |
| `WRONGPASS` or Redis connection error | Check your `REDIS_URL` in `.env` — is it your Upstash URL? |
| `ModuleNotFoundError` | Activate your venv: `source .venv/bin/activate` |
| `alembic: command not found` | Activate venv first, or run: `python -m alembic upgrade head` |
| Port 8000 already in use | Kill it: `lsof -ti:8000 \| xargs kill` |
| Supabase project is "paused" | Free projects pause after 1 week of inactivity. Go to dashboard → Resume |
