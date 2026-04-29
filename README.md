# SceneIQ

An AI-powered visual accessibility assistant that helps users understand their surroundings through image analysis, scene descriptions, and audio output.

## Live Demo

- **Frontend:** https://sceneiq-frontend.onrender.com
- **Backend API:** https://sceneiq-backend.onrender.com
- **API Docs:** https://sceneiq-backend.onrender.com/docs

---

## Overview

SceneIQ is a full-stack web application designed for visual accessibility. Users upload an image and the system returns:

- A natural-language scene description (image captioning)
- A list of detected objects with confidence scores
- Answers to follow-up questions about the image
- Audio playback of all results via Web Speech API

---

## Tech Stack

### Frontend
- **React 18** — functional components with hooks
- **React Router 6** — client-side routing with protected routes
- **Tailwind CSS 3** — dark theme design system
- **Web Speech API** — text-to-speech for all analysis results

### Backend
- **FastAPI** — REST API with automatic OpenAPI docs
- **SQLAlchemy 2 + Alembic** — ORM and database migrations
- **PostgreSQL** — primary database (Supabase)
- **Upstash Redis** (TLS) — JWT token blacklist on logout
- **python-jose** — JWT signing/verification
- **bcrypt** — password hashing (direct, no passlib)

### AI / ML
- **Groq API** (`meta-llama/llama-4-scout-17b-16e-instruct`) — vision model powering captioning, object detection, and visual Q&A
- All inference is remote — no local model weights, minimal memory footprint

### Infrastructure
- **Database:** Supabase (PostgreSQL via connection pooler, port 6543)
- **Cache / Token Blacklist:** Upstash Redis (TLS)
- **Deployment:** Render Blueprint (Docker backend + static frontend)

---

## Features

| Feature | Status |
|---|---|
| User registration & login | Live |
| JWT auth with Redis token blacklist | Live |
| Profile view & update | Live |
| Image upload & analysis (caption + objects) | Live |
| Visual question answering | Live |
| Analysis history (last 50) | Live |
| Text-to-speech playback | Live |
| WCAG 2.1 AA keyboard navigation | Live |
| Privacy Policy page | Live |
| Terms of Service page | Live |
| Accessibility Statement page | Live |

---

## Project Structure

```
SceneIQ/
├── app/                        # FastAPI backend
│   ├── main.py                 # App entry, CORS, router registration
│   ├── config.py               # Settings (env vars)
│   ├── database.py             # SQLAlchemy engine & session
│   ├── middleware/
│   │   └── auth_middleware.py  # JWT extraction & user ID resolution
│   ├── models/
│   │   ├── user.py
│   │   └── analysis_history.py
│   ├── routers/
│   │   ├── auth.py             # /api/auth — register, login, logout
│   │   ├── users.py            # /api/users — profile get/update
│   │   └── images.py           # /api/images — analyze, ask, history
│   ├── schemas/
│   │   ├── user.py
│   │   └── image.py
│   └── services/
│       ├── auth_service.py     # JWT creation & password hashing
│       ├── ml_service.py       # Groq vision API wrapper
│       └── token_blacklist.py  # Redis token blacklist
├── alembic/                    # DB migrations
├── src/                        # React frontend
│   ├── components/
│   │   ├── Logo.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx     # Auth state (localStorage persistence)
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── PrivacyPolicyPage.jsx
│   │   ├── TermsOfServicePage.jsx
│   │   └── AccessibilityStatementPage.jsx
│   └── services/
│       └── api.js              # All fetch calls to the backend
├── Dockerfile
├── render.yaml                 # Render Blueprint config
├── requirements.txt
└── package.json
```

---

## API Endpoints

### Authentication — `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Create account |
| POST | `/login` | — | Returns JWT access token |
| POST | `/logout` | Bearer | Blacklists token in Redis |

### Users — `/api/users`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/profile` | Bearer | Get current user profile |
| PUT | `/profile` | Bearer | Update name / preferences |

### Image Analysis — `/api/images`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/analyze` | Bearer | Upload image → caption + detected objects |
| POST | `/ask` | Bearer | Answer question about a stored analysis |
| POST | `/analyze-and-ask` | Bearer | Analyze + answer in one request |
| GET | `/history` | Bearer | Last 50 analyses for current user |
| GET | `/metrics` | — | Model performance benchmarks |

### Health
| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | DB connectivity check |

---

## Local Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL (or a Supabase project)
- Upstash Redis instance
- Groq API key — free at [console.groq.com](https://console.groq.com)

### Backend

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, REDIS_URL, GROQ_API_KEY

# Run migrations
alembic upgrade head

# Start API server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API available at `http://localhost:8000`  
Swagger docs at `http://localhost:8000/docs`

### Frontend

```bash
npm install
npm start
```

Frontend available at `http://localhost:3000`

---

## Environment Variables

### Backend

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_ALGORITHM` | JWT signing algorithm (default: `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes (default: `60`) |
| `REDIS_URL` | Upstash Redis URL (`rediss://...`) |
| `GROQ_API_KEY` | Groq API key for vision inference |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |

### Frontend

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend base URL (set at build time) |

---

## Deployment (Render)

This project uses a Render Blueprint (`render.yaml`) to deploy both services.

1. Fork this repo
2. Connect it to Render → **New Blueprint**
3. Set the following environment variables for `sceneiq-backend` in the Render dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `REDIS_URL`
   - `GROQ_API_KEY`
4. Render builds and deploys both services automatically on every push to `main`

> **Supabase note:** Free-tier projects pause after ~1 week of inactivity. Resume the project from the Supabase dashboard before redeploying if you see a database connection error.

---

## Database Schema

Managed by Alembic (current head: `20260216_01`).

**`users`**
- `id` (UUID, PK)
- `email` (unique, indexed)
- `name`
- `password_hash`
- `created_at`

**`analysis_history`**
- `id` (UUID, PK)
- `user_id` (FK → users, indexed)
- `image_filename`
- `caption`
- `objects_detected` (JSON)
- `created_at`

---

## Accessibility

- WCAG 2.1 AA compliant
- Full keyboard navigation
- ARIA labels and live regions on dynamic content
- Text-to-speech playback with adjustable rate and voice selection

---

## License

MIT
