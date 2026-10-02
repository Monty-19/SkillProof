# 🚀 SKILLPROOF — Proof-of-Skill Platform

> "LinkedIn tells recruiters what candidates claim they can do. SkillProof shows what they can actually demonstrate."

SkillProof is a **Proof-of-Skill infrastructure platform**. Traditional hiring platforms depend heavily on self-declared resumes, video course completion certificates, and keyword claims. SkillProof replaces unverified assertions with structured, AI-assisted demonstrated evidence built from practical real-world engineering challenges.

---

## 🛠️ Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │             React 19 + TypeScript + Vite 8              │
   │           Tailwind CSS v4 + Lucide Icons + Router       │
   └────────────────────────────┬────────────────────────────┘
                                │ REST API / JSON
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │              Python 3.11+ / FastAPI                     │
   │  Pydantic Schemas & Settings • JWT Authentication (Jose)│
   │             Bcrypt Secure Password Hashing              │
   └──────────────┬───────────────────────────┬──────────────┘
                  │                           │
                  ▼                           ▼
   ┌───────────────────────────┐ ┌───────────────────────────┐
   │  SQLAlchemy ORM + SQLite  │ │   AI Evaluation Service   │
   │  PostgreSQL Compatible    │ │ Google Gemini 3.8 Flash   │
   │  Alembic Migration Ready  │ │ (with Mock Provider guard)│
   └───────────────────────────┘ └───────────────────────────┘
```

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons, React Router v7.
- **Backend:** Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.0, Jose JWT, Bcrypt password hashing.
- **AI Evaluation Engine:** Server-side AI evaluation layer calling Google Gemini models (`gemini-3.8-flash`) with automated JSON schema validation and `MockEvaluationProvider` fallback.
- **Database:** Relational schema supporting Users, Skills, Challenges, Submissions, Evaluations, SkillEvidence, Projects, Badges, and Notifications.

---

## 🔐 Environment Configuration

Create a `.env` file in `/backend` (or configure via environment variables):

```env
PORT=8001
HOST=0.0.0.0
DATABASE_URL=sqlite:///./skillproof.db
JWT_SECRET=your-secure-jwt-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Evaluation
GEMINI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-3.8-flash
EVALUATION_PROVIDER=ai
```

*Note: The platform automatically detects `GEMINI_API_KEY` from the system environment. Keys are strictly server-side and never exposed to the client.*

---

## 🚀 Running the Application

### 1. Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run database seed
PYTHONPATH=. python3 -m app.database.seed

# Start FastAPI server
PYTHONPATH=. python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

Interactive API documentation (Swagger UI) is available at: `http://localhost:8001/docs`

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

The frontend Vite server automatically proxies `/api` and `/docs` to `http://127.0.0.1:8001`.

---

## 👥 Demo Personas (Pre-seeded)

Use the **"⚡ Demo Personas"** quick-switcher in the top navigation bar or log in manually:

| Persona | Email | Password | Role & Purpose |
|---|---|---|---|
| **Student** | `demo.student@skillproof.dev` | `password123` | Aarav Mehta — Demonstrates skills, submits challenges, views proof passport |
| **Recruiter** | `demo.recruiter@skillproof.dev` | `password123` | Elena Rostova (Apex Ventures) — Searches demonstrated skills and evaluates proof |
| **Admin** | `demo.admin@skillproof.dev` | `password123` | SkillProof Admin — Manages challenges, audits submissions, monitors telemetry |

---

## 🎯 The Core Demonstration Flow

1. **Landing Page:** Open `/` to view the value proposition: practical challenges & AI-assisted evaluation vs resumes.
2. **Student Login:** Click **Demo Personas ➔ Student** (or sign in with `demo.student@skillproof.dev`).
3. **Student Dashboard:** View the **My SkillProof** evidence cards (HTML/CSS 91/100, JavaScript 86/100, SQL 88/100, Python 79/100) and overall score.
4. **Browse Challenges:** Open **Challenges** and select **"Build an Interactive Expense Tracker"** (JavaScript, 60m).
5. **View Challenge Details:** Inspect the real-world startup scenario, acceptance requirements, and weighted evaluation criteria.
6. **Workspace & Submission:** Click **Start Challenge / Submit Work**, enter GitHub URL, Live Demo URL, and architecture explanation (or use the "Quick-Fill Sample Data" button).
7. **AI-Assisted Evaluation:** Submit the challenge. The backend AI evaluation pipeline scores the submission across Functionality (25), UI/UX (25), Responsiveness (20), Code Quality (20), and Accessibility (10).
8. **View Evaluation Breakdown:** Inspect the AI summary, verified strengths, potential issues, and actionable recommendations.
9. **Proof-of-Skill Passport:** Open the public passport (`/passport/aarav_m`) to view the newly minted skill proof with public GitHub and live demo links.
10. **Recruiter Search:** Switch to **Recruiter** persona, open **Find Candidates**, filter by **JavaScript** with **Minimum Score: 80**.
11. **Inspect Candidate Evidence:** Click **VIEW PROOF** on the candidate to inspect the code evidence, scores, and evaluation logs.
