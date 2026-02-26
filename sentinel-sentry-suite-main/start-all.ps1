# Starts FastAPI (uvicorn) and the React Vite dev server in separate PowerShell windows
param()

$backendPath = Join-Path $PSScriptRoot 'final project\backend'
$frontendPath = Join-Path $PSScriptRoot 'final project\frontend'

Write-Host "Starting backend (uvicorn)..."
Start-Process -NoNewWindow -FilePath pwsh -ArgumentList "-NoExit","-Command","cd '$backendPath'; if (Test-Path .venv) { . .\venv\Scripts\Activate.ps1 }; uvicorn main:app --reload --port 8000" -WorkingDirectory $backendPath

Write-Host "Starting frontend (vite)..."
Start-Process -NoNewWindow -FilePath pwsh -ArgumentList "-NoExit","-Command","cd '$frontendPath'; npm install; npm run dev" -WorkingDirectory $frontendPath

Write-Host "Both processes started. Open frontend at http://localhost:5173 and API at http://localhost:8000"
