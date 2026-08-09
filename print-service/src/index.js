const io = require('socket.io-client');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const pdfPrinter = require('pdf-to-printer');
require('dotenv').config();

const { getPrinterStatus } = require('./printerMonitor');
const { startUSBMonitoring, listDriveFiles, readDriveFile } = require('./usbMonitor');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const MACHINE_CODE = process.env.MACHINE_CODE || 'KIOSK-001';
const PRINTER_NAME = process.env.PRINTER_NAME || '';  // Set in .env — run: Get-Printer | Select Name
const tempDir = path.join(__dirname, '../temp_print');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

console.log(`🖨️ Windows Silent Print Daemon initializing... Machine Code: [${MACHINE_CODE}]`);

const socket = io(BACKEND_URL, {
    reconnection: true,
    reconnectionDelay: 2000
});

const printQueue = [];
let isProcessingQueue = false;

// ──────────────────────────────────────────────────────────────
// SOCKET.IO — CONNECTION & CORE EVENTS
// ──────────────────────────────────────────────────────────────

socket.on('connect', () => {
    console.log('✅ Connected to Xerox Central Server Socket.IO!');
    socket.emit('REGISTER_DAEMON', { machineCode: MACHINE_CODE });
    startPrinterMonitoring();

    // Start USB drive detection on kiosk PC
    startUSBMonitoring({
        onInserted: (drive) => {
            console.log(`🔌 USB Inserted: ${drive.driveLetter} (${drive.volumeName})`);
            socket.emit('USB_DRIVE_CONNECTED', { machineCode: MACHINE_CODE, drive });
        },
        onRemoved: (driveLetter) => {
            console.log(`🔌 USB Removed: ${driveLetter}`);
            socket.emit('USB_DRIVE_DISCONNECTED', { machineCode: MACHINE_CODE, driveLetter });
        }
    });
});

socket.on('disconnect', () => {
    console.warn('⚠️ Disconnected from Xerox Central Server. Attempting reconnect...');
});

// ──────────────────────────────────────────────────────────────
// PRINT JOB — from backend dispatch
// ──────────────────────────────────────────────────────────────

socket.on('DO_SILENT_PRINT', (jobData) => {
    console.log(`📥 Received Silent Print Dispatch: Job ID [${jobData.printJobId}], File: [${jobData.originalFilename}]`);
    printQueue.push(jobData);
    processQueue();
});

// ──────────────────────────────────────────────────────────────
// USB — Kiosk UI requests file list for a drive
// ──────────────────────────────────────────────────────────────

socket.on('USB_LIST_FILES', async (data) => {
    const { driveLetter } = data || {};
    if (!driveLetter) return;
    console.log(`📁 Kiosk requested file list for ${driveLetter}`);
    try {
        const files = await listDriveFiles(driveLetter);
        socket.emit('USB_FILES_LIST', { machineCode: MACHINE_CODE, driveLetter, files });
    } catch (err) {
        socket.emit('USB_FILES_LIST', { machineCode: MACHINE_CODE, driveLetter, files: [], error: err.message });
    }
});

// ──────────────────────────────────────────────────────────────
// USB — Kiosk user selects a file → upload to backend
// ──────────────────────────────────────────────────────────────

socket.on('USB_SELECT_FILE', async (data) => {
    const { filePath, fileName } = data || {};
    if (!filePath || !fileName) return;
    console.log(`📄 Kiosk selected USB file: ${fileName}`);

    try {
        socket.emit('USB_UPLOAD_PROGRESS', { machineCode: MACHINE_CODE, status: 'reading', fileName });

        // Read file buffer from USB drive (local filesystem)
        const fileBuffer = readDriveFile(filePath);
        const ext = path.extname(fileName).toLowerCase();

        // Build multipart form-data — same endpoint as mobile upload
        const formData = new FormData();
        formData.append('file', fileBuffer, {
            filename: fileName,
            contentType: ext === '.pdf'  ? 'application/pdf'
                : ['.jpg', '.jpeg'].includes(ext) ? 'image/jpeg'
                : ext === '.png'  ? 'image/png'
                : 'application/octet-stream'
        });
        formData.append('machineCode', MACHINE_CODE);
        formData.append('source', 'usb');

        socket.emit('USB_UPLOAD_PROGRESS', { machineCode: MACHINE_CODE, status: 'uploading', fileName });

        const uploadRes = await axios.post(
            `${BACKEND_URL}/api/v1/uploads/usb`,
            formData,
            { headers: formData.getHeaders(), maxBodyLength: Infinity, timeout: 60000 }
        );

        if (uploadRes.data && uploadRes.data.success) {
            console.log(`✅ USB file uploaded. Token: ${uploadRes.data.uploadToken}`);
            socket.emit('USB_UPLOAD_PROGRESS', { machineCode: MACHINE_CODE, status: 'done', fileName });
            // Backend will emit FILE_UPLOADED to machine room → kiosk navigates to preview automatically
        } else {
            throw new Error('Backend upload returned failure');
        }
    } catch (err) {
        console.error(`❌ USB file upload failed:`, err.message);
        socket.emit('USB_UPLOAD_PROGRESS', {
            machineCode: MACHINE_CODE,
            status: 'error',
            fileName,
            error: err.message
        });
    }
});

// ──────────────────────────────────────────────────────────────
// PRINT QUEUE PROCESSOR (existing logic preserved)
// ──────────────────────────────────────────────────────────────

async function processQueue() {
    if (isProcessingQueue || printQueue.length === 0) return;
    isProcessingQueue = true;

    const job = printQueue.shift();
    let retryCount = 0;
    const MAX_RETRIES = 3;
    let success = false;

    while (retryCount < MAX_RETRIES && !success) {
        try {
            retryCount++;
            console.log(`🖨️ Executing Silent Print (Attempt ${retryCount}/${MAX_RETRIES}) for Job [${job.printJobId}]...`);

            await updateJobStatus(job.printJobId, 'printing');

            const fileUrl = `${BACKEND_URL}${job.filePath}`;
            const localPath = path.join(tempDir, `print-${job.printJobId}.pdf`);

            const response = await axios({ url: fileUrl, method: 'GET', responseType: 'stream' });
            const writer = fs.createWriteStream(localPath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            const options = {
                copies: job.copies || 1,
                paperSize: job.paperSize || 'A4',
                side: job.duplexMode === 'duplex' ? 'duplex' : 'simplex',
                orientation: job.orientation || 'portrait'
            };

            const resolvedPrinter = (PRINTER_NAME && PRINTER_NAME.trim() !== '')
                ? PRINTER_NAME.trim()
                : (job.printerName !== 'Kiosk_Printer_Default' ? job.printerName : undefined);
            if (resolvedPrinter && resolvedPrinter !== 'Kiosk_Printer_Default') {
                options.printer = resolvedPrinter;
            }

            console.log(`🖨️ Target Printer: [${options.printer || 'System Default Printer'}]`);

            // 3-Tier Robust Silent Print
            try {
                await pdfPrinter.print(localPath, options);
                console.log(`✅ Silent printing dispatched to spooler!`);
            } catch (printErr) {
                console.warn(`Tier 1 failed (${printErr.message}). Trying Tier 2 (System Default)...`);
                try {
                    const defaultOptions = { ...options };
                    delete defaultOptions.printer;
                    await pdfPrinter.print(localPath, defaultOptions);
                    console.log(`✅ Dispatched to default printer spooler!`);
                } catch (err2) {
                    console.warn(`Tier 2 failed (${err2.message}). Trying Tier 3 (Edge)...`);
                    const { execSync } = require('child_process');
                    const targetP = options.printer ? `"${options.printer}"` : '';
                    if (targetP) {
                        execSync(`powershell -Command "Start-Process msedge -ArgumentList '--headless --print-to=${targetP} \\"${localPath}\\"' -WindowStyle Hidden"`, { stdio: 'ignore' });
                    } else {
                        execSync(`powershell -Command "Start-Process msedge -ArgumentList '--headless --print-to-default \\"${localPath}\\"' -WindowStyle Hidden"`, { stdio: 'ignore' });
                    }
                    console.log(`✅ Dispatched via Microsoft Edge!`);
                }
            }

            setTimeout(() => { if (fs.existsSync(localPath)) fs.unlinkSync(localPath); }, 5000);

            await updateJobStatus(job.printJobId, 'completed');
            success = true;
            console.log(`🎉 Job [${job.printJobId}] completed!`);
        } catch (err) {
            console.error(`❌ Print failed on attempt ${retryCount}:`, err.message);
            if (retryCount >= MAX_RETRIES) {
                await updateJobStatus(job.printJobId, 'failed', err.message);
            } else {
                await new Promise(r => setTimeout(r, 3000));
            }
        }
    }

    isProcessingQueue = false;
    if (printQueue.length > 0) processQueue();
}

async function updateJobStatus(printJobId, status, errorMessage = null) {
    try {
        await axios.put(`${BACKEND_URL}/api/v1/print/job/${printJobId}/status`, {
            status,
            error_message: errorMessage
        });
    } catch (err) {
        console.error('Failed to notify backend job status:', err.message);
    }
}

// ──────────────────────────────────────────────────────────────
// PRINTER HEALTH MONITOR (every 15 seconds)
// ──────────────────────────────────────────────────────────────

function startPrinterMonitoring() {
    setInterval(async () => {
        try {
            const statusObj = await getPrinterStatus(PRINTER_NAME || 'default');
            socket.emit('PRINTER_STATUS_CHANGE', {
                machineCode: MACHINE_CODE,
                status: statusObj.status,
                details: statusObj.details
            });
            await axios.put(`${BACKEND_URL}/api/v1/machines/code/${MACHINE_CODE}/printer-status`, {
                printer_status: statusObj.status
            }).catch(() => {});
        } catch (err) {
            // Ignore background monitor error
        }
    }, 15000);
}
