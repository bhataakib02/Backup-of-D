@echo off
echo 🎨 SPCMS Diagram to Image Converter
echo =====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    echo 🌐 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Check if mermaid-cli is installed
mmdc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Mermaid CLI...
    npm install -g @mermaid-js/mermaid-cli
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Mermaid CLI
        echo 💡 Try running as Administrator
        pause
        exit /b 1
    )
)

echo ✅ Mermaid CLI ready
echo.

REM Create output directory
if not exist "presentation_images" mkdir presentation_images

echo 🔄 Generating diagram images...
echo.

REM Run the Python script
python generate_presentation_images.py

echo.
echo 🎯 Image generation complete!
echo 📁 Check the 'presentation_images' folder
echo.

REM Open the output folder
start "" "presentation_images"

pause
