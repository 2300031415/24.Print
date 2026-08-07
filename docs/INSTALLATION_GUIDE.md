# Installation & Deployment Guide

## Hardware Specifications Target
- **OS**: Windows 11 Pro (Kiosk Shell Mode enabled)
- **CPU**: Intel Celeron J4125 @ 2.0GHz
- **RAM**: 8 GB RAM
- **Storage**: 60 GB SSD
- **Input**: Multi-touch Screen HMI Display
- **Peripherals**: USB or Network Laser/Inkjet Printer (HP, Canon, Epson, Brother)

---

## 1. Quick Start via Docker Compose (Server)

1. Clone or copy project repository to central server.
2. Ensure Docker Desktop / Docker Engine is installed.
3. Run:
   ```bash
   docker-compose up -d --build
   ```
4. Database migrations & seed data will execute automatically.
5. Central Server URLs:
   - **Frontend App**: `http://localhost`
   - **Backend API**: `http://localhost:5000`
   - **PostgreSQL**: `localhost:5432`

---

## 2. Manual Development Setup

### Step A: Database
1. Install PostgreSQL 14+ on Windows or Linux.
2. Create database `print_kiosk_db`.
3. Execute `backend/db/schema.sql` and `backend/db/seed.sql`.

### Step B: Backend API Server
1. Navigate to `/backend`:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### Step C: Frontend Web Application
1. Navigate to `/frontend`:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Step D: Windows Print Service Daemon (On Kiosk Machine)
1. Navigate to `/print-service`:
   ```bash
   cd print-service
   npm install
   npm start
   ```
2. To auto-start on boot:
   Right-click `install-service.bat` -> **Run as Administrator**.
