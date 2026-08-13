@echo off
title EasyXerox Local Kiosk Launcher
echo ========================================================
echo          STARTING EASYXEROX LOCAL KIOSK SYSTEM
echo ========================================================
cd /d "%~dp0"

echo [1/3] Starting Backend API Server (Port 5000)...
start "EasyXerox Backend" /min node backend/src/server.js

echo [2/3] Starting Print & USB Daemon Service...
start "EasyXerox Print Daemon" /min node print-service/src/index.js

echo [3/3] Starting Frontend Kiosk Web Server (Port 8501)...
start "EasyXerox Frontend" /min npm --prefix frontend run dev

timeout /t 5 /nobreak >nul

echo Launching Fullscreen Kiosk Screen...
start msedge --kiosk http://localhost:8501/kiosk/KIOSK-001 --edge-kiosk-type=fullscreen --no-first-run

echo ========================================================
echo EasyXerox Local Kiosk System is active!
echo Kiosk Display: http://localhost:8501/kiosk/KIOSK-001
echo Portal Login:  http://localhost:8501/login
echo ========================================================
