# SceneIQ Frontend - Sprint 1

AI-powered visual assistance platform helping visually impaired users understand their surroundings through image analysis, scene descriptions, and audio output.

## Project Overview

This is a **Sprint 1 prototype** built with **mock data only** - no backend integration yet. All API calls are simulated with delays to mimic real network requests.

## Tech Stack

- **React.js** 18.2.0 (functional components with hooks)
- **React Router** 6.22.0 (client-side routing)
- **Tailwind CSS** 3.4.1 (utility-first styling)
- **Web Speech API** (text-to-speech functionality)

## Features Implemented

### Pages
1. **Landing Page** (`/`) - Hero section with feature cards
2. **Register Page** (`/register`) - User registration with validation
3. **Login Page** (`/login`) - User authentication
4. **Dashboard Page** (`/dashboard`) - Statistics and analysis history
5. **Upload & Analysis Page** (`/upload`) - Image upload, analysis, and Q&A
6. **Profile Page** (`/profile`) - User settings and accessibility preferences

### Accessibility Features (WCAG 2.1 AA Compliant)
- ✅ All interactive elements are keyboard navigable
- ✅ Visible focus indicators on all focusable elements
- ✅ Proper ARIA labels and roles throughout
- ✅ Skip-to-content link for screen readers
- ✅ Color contrast meets 4.5:1 minimum ratio
- ✅ Form labels associated with inputs
- ✅ Status messages with `role="alert"` or `role="status"`
- ✅ Speech rate and voice customization
- ✅ High contrast mode toggle
- ✅ Font size adjustment

### Key Components
- **Navbar** - Responsive navigation with auth state
- **Footer** - Information and quick links
- **ProtectedRoute** - Route guard for authenticated pages
- **AuthContext** - State management (in-memory, no localStorage)

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Access the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```

├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── UploadPage.jsx
│   │   └── ProfilePage.jsx
│   ├── services/
│   │   └── api.js          # Mock API calls
│   ├── context/
│   │   └── AuthContext.jsx # Auth state management
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── tailwind.config.js
├── package.json
└── README.md
```

## Mock API Services

All backend calls are simulated in `src/services/api.js`:

- `mockLogin(email, password)` - Simulates login (1.2s delay)
- `mockRegister(name, email, password)` - Simulates registration (1.2s delay)
- `mockGetProfile()` - Returns mock user profile (0.5s delay)
- `mockGetHistory()` - Returns mock analysis history (0.8s delay)
- `mockAnalyzeImage(imageFile)` - Returns mock analysis results (2.5s delay)
- `mockAskQuestion(question)` - Returns mock answer (1s delay)
- `mockUpdatePreferences(preferences)` - Simulates saving preferences (0.6s delay)

## Testing the App

### Registration & Login
1. Navigate to `/register`
2. Fill in the form with any valid data (password must be 8+ characters)
3. Submit to be auto-logged in and redirected to dashboard

### Image Analysis
1. Go to `/upload`
2. Upload an image (JPEG, PNG, or WebP) or use webcam
3. Click "Analyze Image"
4. View scene description and detected objects
5. Ask questions about the image
6. Use the 🔊 buttons to hear audio descriptions

### Accessibility Testing
1. Navigate using only Tab and Shift+Tab
2. Activate elements with Enter or Space
3. Check focus indicators are visible
4. Test speech synthesis on Dashboard and Upload pages
5. Adjust preferences in Profile page

## Important Notes

### State Management
- All auth state is stored **in React context only** (not localStorage)
- User session is lost on page refresh (intentional for Sprint 1)
- Sprint 2 will integrate real backend with token persistence

### Mock Data
- Login accepts any email/password combination
- Analysis results are hardcoded
- History shows 3 sample analyses
- Statistics are fixed numbers

### Browser Compatibility
- Requires modern browser with Web Speech API support
- Webcam feature requires HTTPS in production (works on localhost)
- Best tested in Chrome, Firefox, Safari, and Edge

## Keyboard Navigation Guide

- **Tab** - Move forward through interactive elements
- **Shift + Tab** - Move backward
- **Enter/Space** - Activate buttons and links
- **Arrow Keys** - Navigate radio groups and sliders
- **Esc** - Close modals

## Accessibility Features Testing

### Screen Reader Testing
- All images have descriptive alt text
- Form inputs have proper labels
- Status messages announce properly
- Focus management on route changes

### Color Contrast
- Primary blue: #2563eb (accessible on white)
- Text colors meet WCAG AA standards
- High contrast mode available in Profile

### Speech Synthesis
- Adjustable speech rate (0.5x - 2.0x)
- Voice selection from available system voices
- Play/Stop controls with proper ARIA states

## Next Steps (Sprint 2)

- [ ] Connect to FastAPI backend
- [ ] Replace mock API calls with real fetch() requests
- [ ] Implement JWT token management
- [ ] Add real image upload and AI analysis
- [ ] Integrate actual object detection model
- [ ] Add session persistence (optional)

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` directory.

## License

MIT License - See LICENSE file for details

## Support

For questions or issues, contact: support@sceneiq.com
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
