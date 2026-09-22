# 🖥️ EasyXerox Dedicated Kiosk OS Appliance Setup & Guide

This directory contains the custom **Minimal Linux Kiosk Appliance Kit** with **Hardware MAC Auto-Pairing**.

---

## 📁 File Structure & Paths in this Project:

| Purpose / Description | File Path in Project |
| :--- | :--- |
| **Hardware Hardware Auto-Pairing Boot Script** | [`kiosk-appliance/kiosk-autostart.sh`](file:///d:/24.Print/kiosk-appliance/kiosk-autostart.sh) |
| **Minimal Linux Appliance ISO Build Script** | [`kiosk-appliance/build-kiosk-iso.sh`](file:///d:/24.Print/kiosk-appliance/build-kiosk-iso.sh) |
| **Silent Printing & USB Monitor Daemon** | [`print-service/src/index.js`](file:///d:/24.Print/print-service/src/index.js) |
| **Printer Hardware Status Monitor** | [`print-service/src/printerMonitor.js`](file:///d:/24.Print/print-service/src/printerMonitor.js) |
| **USB Drive Detection Module** | [`print-service/src/usbMonitor.js`](file:///d:/24.Print/print-service/src/usbMonitor.js) |
| **Backend Hardware Auto-Pairing Route** | [`backend/src/routes/machineRoutes.js`](file:///d:/24.Print/backend/src/routes/machineRoutes.js) |
| **Backend Hardware Identification Controller** | [`backend/src/controllers/machineController.js`](file:///d:/24.Print/backend/src/controllers/machineController.js) |

---

## 🚀 How Hardware MAC Auto-Pairing Works:

1. **Boot**: The Minimal Linux OS boots in **5 seconds**.
2. **Identify**: `kiosk-autostart.sh` reads the network MAC address (e.g., `b4:2e:99:a1:c4:8f`) and calls `GET /api/machines/identify?mac=b4:2e:99:a1:c4:8f`.
3. **Paired**: If registered, it immediately launches full-screen Chromium Kiosk mode to `https://easyxerox.com/kiosk/MACHINE_CODE`.
4. **Unregistered**: If brand new, it shows standby mode until Super Admin assigns the board code from `https://easyxerox.com/admin/machines`.

---

## 💿 Flashing Kiosk Boards:

1. Build/Export the Master Kiosk Image into `EasyXerox-Kiosk-Appliance-v1.iso`.
2. Flash onto any kiosk SSD drive using **BalenaEtcher** or **Clonezilla**.
3. Plug in power & network. Zero manual board configuration required!
