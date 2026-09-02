@echo off
title EasyXerox Local Kiosk Launcher
echo ========================================================
echo          STARTING EASYXEROX LOCAL KIOSK SYSTEM
echo ========================================================
cd /d "%~dp0"

echo [1/4] Starting Backend API Server (Port 5000)...
start "EasyXerox Backend" /min node backend/src/server.js

echo [2/4] Starting Print & USB Daemon Service...
start "EasyXerox Print Daemon" /min node print-service/src/index.js

echo [3/4] Starting Frontend Kiosk Web Server (Port 8501)...
start "EasyXerox Frontend" /min npm --prefix frontend run dev

echo [4/4] Starting Standalone Super Admin Control Portal (Port 8502)...
start "EasyXerox Admin" /min npm --prefix admin run dev

timeout /t 5 /nobreak >nul

echo Launching Fullscreen Kiosk Screen...
start msedge --kiosk http://localhost:8501/kiosk/KIOSK-001 --edge-kiosk-type=fullscreen --no-first-run

echo ========================================================
echo EasyXerox Local Kiosk System is active!
echo Website & Kiosk Display: http://localhost:8501/
echo Client Partner Login:    http://localhost:8501/client/login
echo Super Admin Portal:      http://localhost:8502/
echo ========================================================
