# MedVision AI

A full-stack medical report analysis application powered by **Google Gemini Vision** (via n8n) and a **FastAPI** backend.

## Architecture

```
[React Frontend (Vercel)]
        │
        ▼
[FastAPI Backend (Render)]
        │
        ▼
[n8n Workflow (Render)]
        │
        ▼
[Google Gemini Vision API]
```

- **Frontend**: React + Vite, deployed on **Vercel**
- **Backend**: FastAPI (Python), deployed on **Render** via `Procfile`
- **AI Pipeline**: n8n workflow hosted on **Render** (`https://n8n-tj96.onrender.com`) — handles OCR and structured data extraction using **Google Gemini Vision**
- **Database**: SQLite (local dev) — persists users and report history

## Local Development

### Prerequisites
- Python 3.8+
- Node.js & npm

### 1. Backend Setup (FastAPI)
```bash
cd server
pip install -r requirements.txt
```

Set environment variables (create a `.env` or export in shell):
```bash
export FRONTEND_URL=http://localhost:5173
export N8N_WEBHOOK_URL=https://n8n-tj96.onrender.com/webhook/ocr-process
```

Run the backend:
```bash
uvicorn server.main:app --reload --port 8000
```
*API available at `http://localhost:8000`.*

### 2. Frontend Setup (React)
```bash
cd client
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

## Deployment

### Backend → Render
The `Procfile` at the repo root defines the start command:
```
web: uvicorn server.main:app --host 0.0.0.0 --port $PORT
```
Set the following environment variables in your Render service dashboard:
| Variable | Value |
|---|---|
| `FRONTEND_URL` | Your Vercel frontend URL |
| `N8N_WEBHOOK_URL` | `https://n8n-tj96.onrender.com/webhook/ocr-process` |
| `SECRET_KEY` | A strong random secret |

### Frontend → Vercel
Connect the repo to Vercel. Set `VITE_API_URL` to your Render backend URL.

## Usage
1. Sign up / Log in.
2. Upload a medical report image or PDF on the Dashboard.
3. The backend forwards the file to the n8n webhook.
4. n8n uses **Gemini Vision** to extract and analyse the report.
5. Results (risks, diet plan, exercise plan) are displayed and saved to history.
