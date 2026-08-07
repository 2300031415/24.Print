@echo off
TITLE Xerox Kiosk Silent Print Service Installer
echo ========================================================
echo Installing Xerox Kiosk Silent Print Daemon as Windows Service
echo ========================================================

REM Using NSSM (Non-Sucking Service Manager) or Node-Windows
sc create "XeroxPrintDaemon" binPath= "node %~dp0src\index.js" start= auto
sc description "XeroxPrintDaemon" "Silent Print Service for Windows 11 Kiosk System"
sc start "XeroxPrintDaemon"

echo.
echo Service installed and started successfully!
pause
