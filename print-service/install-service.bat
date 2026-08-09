@echo off
TITLE Xerox Kiosk Silent Print Service Installer

:: Check for Administrator Privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ========================================================
    echo Requesting Administrator Privileges...
    echo ========================================================
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ========================================================
echo Installing Xerox Kiosk Silent Print Daemon as Windows Service
echo ========================================================

:: Get absolute path of node.exe
for /f "tokens=*" %%g in ('where node') do (set NODEPATH=%%g)

if "%NODEPATH%"=="" (
    echo ❌ ERROR: Node.js was not found on system PATH.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b
)

:: Remove old service entry if exists
sc delete "XeroxPrintDaemon" >nul 2>&1

:: Create Windows Service with full node.exe path
sc create "XeroxPrintDaemon" binPath= "\"%NODEPATH%\" \"%~dp0src\index.js\"" start= auto
sc description "XeroxPrintDaemon" "Silent Print Service for Windows 11 Kiosk System"
sc start "XeroxPrintDaemon"

echo.
echo ✅ Service installed and started successfully!
pause
