# NeuroSentinel — Final Project

This repository combines a React frontend and a FastAPI backend for a unified security analysis platform (phishing, malware, network security).

Quick start (development):

1. Backend: create and activate a Python virtual environment, then install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r "final project/backend/requirements.txt"
```

2. Frontend: install node dependencies and run Vite dev server:

```powershell
cd "final project/frontend"
npm install
npm run dev
```

3. Start both (concurrently): see `start-all.ps1` in repository root.

API: FastAPI runs on `http://localhost:8000` by default and exposes endpoints under `/api`.

Project structure highlights:
- `final project/backend/` — FastAPI app, routes, utilities
- `final project/frontend/` — React + TypeScript frontend (Vite)

If something doesn't work, open an issue or run the servers individually to collect logs.
