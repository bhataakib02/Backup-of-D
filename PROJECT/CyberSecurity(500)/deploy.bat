@echo off
REM NEXUS CYBER INTELLIGENCE - Windows Deployment Script
REM Enterprise-Grade Cybersecurity Platform

echo 🚀 NEXUS CYBER INTELLIGENCE - Deployment Starting...
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python 3.9+ first.
    exit /b 1
)

echo [SUCCESS] System requirements check passed!

REM Setup Backend
echo [INFO] Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo [INFO] Installing Python dependencies...
pip install -r requirements.txt

cd ..

REM Setup Frontend
echo [INFO] Setting up frontend...
cd frontend

REM Install Node.js dependencies
echo [INFO] Installing Node.js dependencies...
npm install --legacy-peer-deps

cd ..

echo [SUCCESS] Setup completed!

REM Create environment files if they don't exist
if not exist "backend\.env" (
    echo [INFO] Creating backend .env file...
    (
        echo # NEXUS CYBER INTELLIGENCE Configuration
        echo APP_NAME=NEXUS_CYBER_INTELLIGENCE
        echo APP_VERSION=2.0.0
        echo FLASK_ENV=development
        echo SECRET_KEY=nexus-cyber-intelligence-secret-key-2024
        echo JWT_SECRET_KEY=nexus-jwt-secret-key-2024
        echo.
        echo # Database Configuration
        echo DATABASE_URL=sqlite:///nexus_ci.db
        echo.
        echo # Security Configuration
        echo CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
        echo RATE_LIMIT_PER_MINUTE=100
        echo SESSION_TIMEOUT_MINUTES=30
    ) > backend\.env
)

if not exist "frontend\.env" (
    echo [INFO] Creating frontend .env file...
    (
        echo # NEXUS CYBER INTELLIGENCE Frontend Configuration
        echo REACT_APP_API_URL=http://localhost:5000
        echo REACT_APP_WS_URL=ws://localhost:5000
        echo REACT_APP_VERSION=2.0.0
        echo REACT_APP_NAME=NEXUS_CYBER_INTELLIGENCE
        echo GENERATE_SOURCEMAP=false
    ) > frontend\.env
)

echo.
echo 🎉 NEXUS CYBER INTELLIGENCE Setup Complete!
echo ==================================================
echo To start the platform:
echo 1. Backend: cd backend ^&^& venv\Scripts\activate ^&^& python app.py
echo 2. Frontend: cd frontend ^&^& npm start
echo.
echo Access Points:
echo 📊 Dashboard: http://localhost:3000
echo 🔧 API Docs: http://localhost:5000/api/docs
echo ❤️ Health Check: http://localhost:5000/api/health
echo ==================================================

pause
