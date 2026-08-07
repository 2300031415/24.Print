# REST API Documentation - QR Self-Service Printing Kiosk System

## Base URL
`/api/v1`

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /auth/login`
Authenticates Admin or Client user.
- **Request Body**:
  ```json
  {
    "email": "admin@printkiosk.com",
    "password": "Admin@123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "user": { "id": "...", "email": "...", "role": "admin" },
    "accessToken": "ey...",
    "refreshToken": "ey..."
  }
  ```

### `POST /auth/refresh-token`
Generates a new access token using refresh token.

### `GET /auth/me` [Protected]
Returns currently authenticated user profile.

---

## 2. Client Management (`/api/v1/clients`)

### `GET /clients` [Admin Only]
Lists all registered clients, total kiosks, and earnings.

### `POST /clients` [Admin Only]
Onboards a new client shop partner and sets commission rate (e.g. 80%).

---

## 3. Kiosk Machine Management (`/api/v1/machines`)

### `GET /machines`
Lists registered kiosk machines.

### `GET /machines/code/:machineCode`
Public endpoint returning kiosk metadata, active print rates, and GST settings for the home screen & mobile upload page.

### `POST /machines` [Admin Only]
Registers a new kiosk machine and returns a generated QR Code Data URL.

### `PUT /machines/code/:machineCode/printer-status`
Used by the Windows Print Service Daemon to report hardware status (`ready`, `paper_out`, `toner_low`, `offline`).

---

## 4. Document Uploads (`/api/v1/uploads`)

### `POST /uploads`
Public endpoint receiving PDF documents from mobile phones (max 100MB).
- **Form Data**:
  - `file`: PDF binary stream
  - `machineId`: Kiosk Machine Code (e.g. `KIOSK-001`)
- **Action**: Extracts total page count, stores file, emits `FILE_UPLOADED` Socket.IO event to Kiosk HMI.

### `GET /uploads/:token`
Retrieves upload details by upload token.

---

## 5. Payments (`/api/v1/payments`)

### `POST /payments/create-order`
Creates a Razorpay Order and returns payment order ID & amount in paise.

### `POST /payments/verify`
Verifies payment signature, calculates GST and client/platform split earnings, creates print job entry, and dispatches `DO_SILENT_PRINT` command to Windows Print Daemon.

---

## 6. Print Jobs (`/api/v1/print`)

### `GET /print/history`
Returns historical print job audit trail.

### `PUT /print/job/:printJobId/status`
Updates job status (`printing`, `completed`, `failed`). On completion/failure, automatically deletes uploaded PDF from server disk for privacy.
