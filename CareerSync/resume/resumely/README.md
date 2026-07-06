# Resumely

Rebuilt from the exported `.txt` source into a runnable local project.

## Structure

- `frontend/` - Vite + React + Tailwind app for the resume builder UI.
- `backend/` - FastAPI API storing shared resumes in `backend/data/resumes.json`.
- `docs/design-guidelines.json` - original exported design brief.

## Run locally

Frontend:

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

Backend:

```powershell
cd backend
copy .env.example .env
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Open `http://127.0.0.1:5173`.