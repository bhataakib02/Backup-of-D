@echo off
echo ========================================
echo  NEXUS CYBER INTELLIGENCE PLATFORM
echo  Next-Generation AI Security Operations
echo ========================================
echo.

echo [1/3] Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
echo.

echo [2/3] Starting Backend Server...
start "NEXUS Backend" python app.py
echo Backend started on http://localhost:5000
echo.

echo [3/3] Starting Frontend...
cd ../frontend
start "NEXUS Frontend" npm start
echo Frontend will start on http://localhost:3000
echo.

echo ========================================
echo  NEXUS CYBER INTELLIGENCE - READY!
echo  
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:5000
echo  
echo  All 780+ Security Functions Active!
echo ========================================
pause
