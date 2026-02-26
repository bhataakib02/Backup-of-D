@echo off
echo 🎨 SPCMS Professional Image Generator
echo =====================================
echo.

REM Create output directory
if not exist "presentation_images" mkdir presentation_images

echo 🔄 Generating professional presentation images...
echo.

REM Generate System Architecture
echo 📊 Creating System Architecture...
mmdc -i diagrams/system_architecture_simple.mmd -o presentation_images/01_system_architecture.png -w 1920 -H 1080 -b white
if %errorlevel% equ 0 (
    echo ✅ System Architecture created successfully
) else (
    echo ❌ Failed to create System Architecture
)

REM Generate Data Flow
echo 📊 Creating Data Flow Pipeline...
mmdc -i diagrams/data_flow_simple.mmd -o presentation_images/02_data_flow.png -w 1920 -H 1080 -b white
if %errorlevel% equ 0 (
    echo ✅ Data Flow created successfully
) else (
    echo ❌ Failed to create Data Flow
)

REM Generate IoT Network
echo 📊 Creating IoT Network...
mmdc -i diagrams/iot_network_simple.mmd -o presentation_images/03_iot_network.png -w 1920 -H 1080 -b white
if %errorlevel% equ 0 (
    echo ✅ IoT Network created successfully
) else (
    echo ❌ Failed to create IoT Network
)

REM Generate Implementation Timeline
echo 📊 Creating Implementation Timeline...
mmdc -i diagrams/implementation_timeline.mmd -o presentation_images/04_implementation_timeline.png -w 1920 -H 1080 -b white
if %errorlevel% equ 0 (
    echo ✅ Implementation Timeline created successfully
) else (
    echo ❌ Failed to create Implementation Timeline
)

REM Generate Mobile App Architecture
echo 📊 Creating Mobile App Architecture...
mmdc -i diagrams/mobile_app_architecture.mmd -o presentation_images/05_mobile_app_architecture.png -w 1920 -H 1080 -b white
if %errorlevel% equ 0 (
    echo ✅ Mobile App Architecture created successfully
) else (
    echo ❌ Failed to create Mobile App Architecture
)

echo.
echo 🎯 Image Generation Complete!
echo =====================================
echo 📁 All images saved in: presentation_images/
echo 📊 Resolution: 1920x1080 (Full HD)
echo 🎨 Background: White (presentation ready)
echo.

REM List generated files
echo 📋 Generated Files:
dir presentation_images\*.png /b

echo.
echo 💡 Usage Tips:
echo - Import these images into PowerPoint
echo - Add animations and transitions
echo - Use for SIH 2025 presentation
echo - High resolution ready for projection
echo.

REM Open the output folder
start "" "presentation_images"

pause
