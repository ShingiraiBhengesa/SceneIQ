# SceneIQ

AI-powered visual accessibility assistant that helps users understand their surroundings through real-time image analysis, scene descriptions, and audio output.

---

## Overview

SceneIQ is a full-stack web application designed for visual accessibility. Users upload an image or use their webcam, and the system returns:

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
- **PostgreSQL 16** — primary database
- **Upstash Redis** (TLS) — JWT token blacklist on logout
- **python-jose** — JWT signing/verification
- **bcrypt** — password hashing (direct, no passlib)

### ML Models
- **YOLOv8n** — object detection (COCO val2017: mAP50 37.3%)
- **BLIP-base** — image captioning (COCO BLEU-4: 39.4%)
- **BLIP-VQA-base** — visual question answering (VQAv2: 78.5%)

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
| Webcam capture | Live |
| Text-to-speech playback | Live |
| WCAG 2.1 AA keyboard navigation | Live |

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
│   │   ├── auth.py
│   │   ├── user.py
│   │   └── image.py
│   └── services/
│       ├── auth_service.py     # JWT creation & verification
│       └── ml_service.py       # YOLOv8 + BLIP model inference
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
│   │   └── ProfilePage.jsx
│   └── services/
│       └── api.js              # All fetch calls to the backend
├── docker-compose.yml
├── Dockerfile
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
- PostgreSQL 16
- Redis (or use Docker Compose)

### Backend

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, REDIS_URL

# Run migrations
alembic upgrade head

# Start API server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API available at `http://localhost:8000`
Swagger docs at `http://localhost:8000/docs`

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm start
```

Frontend available at `http://localhost:3000`

---

## Docker Compose (Recommended)

Starts the API, PostgreSQL, and Redis together:

```bash
docker compose up --build
```

Runs migrations automatically on startup, then serves the API at `http://localhost:8000`.

**Note:** The Docker Compose setup uses a local Redis instance. For production, set `REDIS_URL` to your Upstash TLS connection string (`rediss://...`).

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_SECRET` | Secret key for signing JWTs | — |
| `JWT_ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime in minutes | `60` |
| `REDIS_URL` | Redis connection string | — |

---

## Database Schema

Managed by Alembic (current head: `20260216_01`).

**`users`**
- `id` (UUID, PK)
- `email` (unique, indexed)
- `name`
- `hashed_password`
- `created_at`

**`analysis_history`**
- `id` (UUID, PK)
- `user_id` (FK → users, indexed)
- `image_filename`
- `caption`
- `objects_detected` (JSON)
- `created_at`

---

## Model Performance

| Model | Task | Benchmark | Score |
|---|---|---|---|
| YOLOv8n | Object detection | COCO val2017 mAP50 | 37.3% |
| BLIP-base | Image captioning | COCO BLEU-4 | 39.4% |
| BLIP-VQA-base | Visual QA | VQAv2 accuracy | 78.5% |

---

## Accessibility

- WCAG 2.1 AA compliant
- Full keyboard navigation (Tab, Shift+Tab, Enter/Space, Arrow Keys)
- Skip-to-content link for screen readers
- ARIA labels and `role="alert"` / `role="status"` on dynamic content
- Adjustable speech rate (0.5x–2.0x) and voice selection
- High contrast mode toggle
- Font size adjustment

---

## License

MIT — see [LICENSE](LICENSE) for details.
