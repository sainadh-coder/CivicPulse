<<<<<<< HEAD
# CivicPulse AI

CivicPulse AI is an AI-powered civic issue reporting and resolution platform for the Vibe2Ship Hackathon 2026 Community Hero track. Citizens upload photos of local problems, Gemini classifies and prioritizes them, Firebase stores live issue data, and city teams get maps, dashboards, citizen XP, and official complaint letters.

Tagline: **From Complaint to Completion**

## Features

- AI Photo Analyzer using Gemini 1.5 Flash multimodal image analysis.
- AI Complaint Letter Generator addressed to The Municipal Commissioner.
- Live City Health Score calculated from open, resolved, and high-severity Firestore issues.
- Google Maps markers plus heatmap density layer for hyperlocal issue clusters.
- Citizen Hero Leaderboard with XP and Rookie, Warrior, Hero, Legend badges.
- Real-time Firebase issue feed with mock fallback when Firebase is empty or not configured.
- Dark glass morphism UI with Tailwind CSS, React Router, Recharts, and responsive layouts.

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS, React Router v6, Recharts, Framer Motion, Google Maps JavaScript API, Firebase client SDK.
- Backend: Python Flask, Firebase Admin SDK, Gemini 1.5 Flash API.
- Database/Auth/Storage: Firebase Firestore, Firebase Authentication, Firebase Storage.
- Deployment: Dockerized Flask backend for Google Cloud Run.

## Project Structure

```text
civicpulse-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── firebase.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── app.py
│   ├── gemini_service.py
│   ├── firebase_service.py
│   ├── requirements.txt
│   └── Dockerfile
├── .env.example
└── README.md
```

## Setup

1. Copy environment variables:

```bash
copy .env.example .env
```

2. Fill in Gemini, Firebase, and Google Maps keys in `.env`.

3. Start the backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

4. Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

5. Open `http://127.0.0.1:5174`.

For local Firebase Admin access, set `GOOGLE_APPLICATION_CREDENTIALS` to a Firebase service account JSON path. On Cloud Run, use the service account attached to the service.

## API Documentation

### `POST /api/analyze-image`

Input:

```json
{ "image": "data:image/jpeg;base64,..." }
```

Returns:

```json
{ "type": "pothole", "severity": 8, "description": "...", "estimated_days": 3 }
```

### `POST /api/generate-letter`

Input:

```json
{
  "issue_type": "pothole",
  "location": "School Road",
  "severity": 9,
  "description": "Large pothole near crossing",
  "reporter_name": "Citizen Name"
}
```

Returns:

```json
{ "letter_text": "To\nThe Municipal Commissioner..." }
```

### `POST /api/issues`

Creates a Firestore issue and awards reporter XP.

### `GET /api/issues`

Returns all issues.

### `PATCH /api/issues/:id/upvote`

Increments issue upvotes.

### `PATCH /api/issues/:id/status`

Input:

```json
{ "status": "in_progress" }
```

### `GET /api/city-health`

Returns score and breakdown.

### `GET /api/leaderboard`

Returns top 10 users sorted by XP.

## Google Cloud Run Deployment

```bash
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/civicpulse-ai-api
gcloud run deploy civicpulse-ai-api \
  --image gcr.io/YOUR_PROJECT_ID/civicpulse-ai-api \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY,FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
```

After deployment, set `VITE_BACKEND_URL` in the frontend environment to the Cloud Run URL and deploy the frontend to your preferred static host.

## Screenshots

- Home with live health score and map.
- AI report workflow.
- City operations dashboard.
- Issue detail with official letter modal.
- Citizen Hero leaderboard.

## License

MIT
=======
# CivicPulse-
A smart civic platform that empowers citizens to report, track, and resolve community issues like potholes, streetlights &amp; waste using AI and real-time collaboration.
>>>>>>> 88384d5716e5f3ead53fd0af3283f89926b664dc
