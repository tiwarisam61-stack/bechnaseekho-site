# Resume Builder startup guide

This project is now set up so the Resume Builder can run from the main CareerSync workspace.

## One-command setup

From the main project root:

```powershell
cd resume/resumely
npm install
cd frontend
npm install
cd ../backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Run locally

Open two terminals.

### Terminal 1 - frontend
```powershell
cd resume/resumely/frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

### Terminal 2 - backend
```powershell
cd resume/resumely/backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Then open:
- http://127.0.0.1:5173/
