# AI Career Copilot 🚀
### Production-Grade Career Intelligence & Match Assessment Platform

![AI Career Copilot](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React%2019%20%7C%20FastAPI%20%7C%20SQLite%20%7C%20OpenRouter-blue)
![License](https://img.shields.io/badge/License-MIT-purple)

**AI Career Copilot** is a high-performance career platform that bridges the gap between candidates and dream job specifications using modern generative AI and transparent deterministic match ranking algorithms.

Instead of a basic "resume score", AI Career Copilot delivers an end-to-end intelligence workspace:
1. **Multi-Weight Match Engine**: Evaluates candidate fit across 5 weighted dimensions (40% Tech Stack, 25% Project Alignment, 20% Experience Level, 10% Education, 5% Soft Skills) with precise evidence quotes and gap explanations.
2. **Interactive AI Resume Hub**: Drag-and-drop resume ingestion (PDF text extraction), AI-powered bullet point rewrite with metric amplification, and real-time ATS optimization.
3. **Adaptive Mock Interview Simulator**: Configurable behavioral, technical, and system design interviews evaluated with structured rubrics and actionable score feedback.
4. **Context-Aware Career Advisor**: Conversational career mentor powered by OpenRouter / Gemini with context preservation.
5. **Dynamic Skill Roadmaps**: Milestone-based career progression tracking.

---

## 🏗 Architecture & Tech Stack

```text
┌─────────────────────────────────────────────────────────┐
│              Frontend (React 19 + TypeScript)           │
│    Vite • Tailwind CSS • Lucide Icons • Responsive UI   │
└───────────────────────────┬─────────────────────────────┘
                            │ REST / JSON (JWT Auth)
┌───────────────────────────▼─────────────────────────────┐
│                 Backend (FastAPI + Python)              │
│    SQLAlchemy 2.0 • Pydantic v2 • SQLite / PostgreSQL   │
└───────────────────────────┬─────────────────────────────┘
                            │ LLM Completions
┌───────────────────────────▼─────────────────────────────┐
│           AI Inference (OpenRouter / Gemini API)        │
│    Structured JSON Extraction & Real-time Evaluation    │
└─────────────────────────────────────────────────────────┘
```

### Frontend
- **Framework**: React 19 + TypeScript with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Reactive state + LocalStorage persistent auth

### Backend
- **Framework**: FastAPI (Asynchronous Python)
- **Database**: SQLite (local / self-contained) & Supabase PostgreSQL compatible via SQLAlchemy 2.0
- **Security**: JWT tokens (HMAC-SHA256) & Bcrypt password hashing
- **Parsing**: PyMuPDF (`fitz`) for PDF text & metadata extraction
- **AI Engine**: OpenRouter API (`liquid/lfm-2.5-2.6b:free` or `gemini-1.5-flash`)

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env from template
cp .env.example .env
# Add your OPEN_ROUTER_API_KEY in .env

# Run development server
python3 run.py
```
Backend will be available at `http://localhost:8000` (Swagger docs: `http://localhost:8000/api/v1/docs`).

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`.

---

## 🌐 Free-Tier Cloud Deployment Guide

### A. Backend Deployment (Render Free Web Service)
1. Fork or push this repository to GitHub.
2. Go to [Render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Configure service settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `SECRET_KEY`: `your-random-production-secret-key`
   - `OPENROUTER_API_KEY`: `your-openrouter-key`
   - `OPENROUTER_MODEL`: `liquid/lfm-2.5-2.6b:free`
6. Click **Deploy**. Note your backend URL (e.g., `https://ai-career-copilot-backend.onrender.com`).

### B. Frontend Deployment (Vercel Free Tier)
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Configure project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://ai-career-copilot-backend.onrender.com/api/v1`
5. Click **Deploy**.

---

## 👥 Author
- **Ruthi** — [GitHub Profile](https://github.com/ruthika1995)
