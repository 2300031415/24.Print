# Windows Silent Print Daemon Setup

## Overview
The Windows Print Daemon is a lightweight background service running directly on the Windows 11 Kiosk hardware. It pairs with the Central Server via Socket.IO, continuously reports paper and toner health status via PowerShell `Get-Printer`, and performs silent background printing without popping up Windows print dialogs.

## Installation Steps
1. Install Node.js v20+ on the Windows 11 Kiosk.
2. Install default printer drivers (USB or Network Printer) and set as Default Printer in Windows Settings.
3. Configure `print-service/.env`:
   ```env
   BACKEND_URL=http://your-server-ip:5000
   MACHINE_CODE=KIOSK-001
   ```
4. Run as Administrator:
   ```cmd
   install-service.bat
   ```
5. Verification:
   Check Windows Services (`services.msc`) for `XeroxPrintDaemon` running as Automatic start.
