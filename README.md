# Production QR-based Self-Service Xerox & Printing Kiosk System

A commercial-grade, touch-optimized, self-service printing kiosk system engineered for Windows 11 Pro HMI Touch Screen boards (Intel Celeron J4125, 8GB RAM, 60GB SSD).

---

## Key Features & Highlights

- **4 Integrated Portals**:
  1. **Admin Portal**: Client onboarding, kiosk management, ad approvals, pricing & GST setup, revenue analytics, audit logs.
  2. **Client Portal**: Revenue dashboards (today/monthly), kiosk printer statuses, ad upload manager, split transaction history.
  3. **Mobile Upload Website**: Responsive touch interface accessed by scanning machine QR code (`/upload/:machineId`). Max 100MB PDF upload limit.
  4. **Windows Kiosk Application**: Fullscreen HMI touch interface with live clock, status badges, 10s auto-rotate video/image ad carousel, PDF.js canvas viewer, touch print options, dynamic GST price calculator, Razorpay UPI QR payment modal, and post-print automated file deletion.
- **Windows Silent Print Daemon**: Local node background daemon that monitors printer diagnostics (`Paper Out`, `Toner Low`, `Offline`) via PowerShell and executes silent prints directly to Windows print spooler without opening print dialogs.
- **Realtime Synchronization**: Powered by Socket.IO for zero-latency communication between mobile uploads, central server, kiosk HMI, and local print service.
- **Split Settlement Engine**: Calculates client revenue shares vs platform commission on every transaction.

---

## Project Structure

```
d:/24.Print/
├── backend/                # Express.js REST API + Socket.IO server + Auth + DB Migrations + Razorpay
│   ├── db/
│   │   ├── schema.sql      # Full DDL for all 14 database tables
│   │   ├── seed.sql        # Initial seed data (Admin, Clients, Machines, Ads, Pricing)
│   │   └── migrate.js      # Automated DB migration runner
│   ├── src/
│   │   ├── config/         # Database pool, JWT, Razorpay SDK
│   │   ├── controllers/    # Auth, Clients, Machines, Uploads, Payments, Prints, Ads, Reports, Settings
│   │   ├── middlewares/    # Auth guards, Multer 100MB PDF limit, Rate limiter, Error handler
│   │   ├── routes/         # Express API endpoints
│   │   ├── socket/         # Socket.IO rooms & realtime handlers
│   │   ├── services/       # PDF page counter, Winston logger
│   │   └── server.js       # Main server file
│   └── package.json
│
├── print-service/          # Windows Local Silent Print Service Daemon
│   ├── src/
│   │   ├── index.js        # Main daemon script & queue processor
│   │   └── printerMonitor.js # PowerShell Get-Printer status monitor
│   ├── install-service.bat # Windows Service installer
│   └── package.json
│
├── frontend/               # React 19 + Vite + Tailwind CSS + Framer Motion + PDF.js
│   ├── src/
│   │   ├── components/     # PDFCanvasViewer, PortalLayout
│   │   ├── context/        # AuthContext, SocketContext
│   │   ├── features/
│   │   │   ├── admin/      # Admin Login, Dashboard, Clients, Machines, Ads, Pricing, GST, Reports, Logs
│   │   │   ├── client/     # Client Login, Dashboard, Machines, Ads, Transactions
│   │   │   ├── kiosk/      # Kiosk Home (10s Ad slider, QR code), PDF Preview, Options, Razorpay Payment Modal
│   │   │   └── mobile/     # Mobile Upload Page (/upload/:machineId)
│   │   ├── services/       # Axios API client
│   │   ├── App.jsx         # Main router
│   │   └── main.jsx
│   └── package.json
│
├── docker-compose.yml      # Docker orchestration
├── docs/                   # API Docs, Installation Guide, Print Service Setup
└── README.md
```

---

## Quick Start (Docker)

```bash
docker-compose up -d --build
```

Access Applications:
- **Kiosk HMI Screen**: `http://localhost/kiosk/KIOSK-001`
- **Mobile Upload Site**: `http://localhost/upload/KIOSK-001`
- **Admin Control Portal**: `http://localhost/admin/login` (Admin: `admin@printkiosk.com` / `Admin@123`)
- **Client Partner Portal**: `http://localhost/client/login` (Client: `owner@metroprints.com` / `Client@123`)

---

## Documentation Links
- [REST API Documentation](file:///d:/24.Print/docs/API_DOCUMENTATION.md)
- [Installation Guide](file:///d:/24.Print/docs/INSTALLATION_GUIDE.md)
- [Print Service Setup Guide](file:///d:/24.Print/docs/PRINT_SERVICE_SETUP.md)
