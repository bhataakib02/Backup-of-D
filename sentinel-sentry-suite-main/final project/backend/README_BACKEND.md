NeuroSentinel Backend

Run locally (recommended):

```powershell
cd "final project/backend"
python -m venv .venv
. .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API endpoints (examples):
- POST /api/network/analyze
- POST /api/malware/scan
- POST /api/phishing/analyze (if implemented)

