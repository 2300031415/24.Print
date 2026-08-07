const io = require('socket.io-client');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const pdfPrinter = require('pdf-to-printer');
require('dotenv').config();

const { getPrinterStatus, getWindowsPrinters } = require('./printerMonitor');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const MACHINE_CODE = process.env.MACHINE_CODE || 'KIOSK-001';
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

socket.on('connect', () => {
    console.log('✅ Connected to Xerox Central Server Socket.IO!');
    socket.emit('REGISTER_DAEMON', { machineCode: MACHINE_CODE });
    startPrinterMonitoring();
});

socket.on('DO_SILENT_PRINT', (jobData) => {
    console.log(`📥 Received Silent Print Dispatch: Job ID [${jobData.printJobId}], File: [${jobData.originalFilename}]`);
    printQueue.push(jobData);
    processQueue();
});

socket.on('disconnect', () => {
    console.warn('⚠️ Disconnected from Xerox Central Server. Attempting reconnect...');
});

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

            // Notify backend job status = printing
            await updateJobStatus(job.printJobId, 'printing');

            // Download file from server
            const fileUrl = `${BACKEND_URL}${job.filePath}`;
            const localPath = path.join(tempDir, `print-${job.printJobId}.pdf`);

            const response = await axios({
                url: fileUrl,
                method: 'GET',
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(localPath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Silent print options
            const options = {
                copies: job.copies || 1,
                paperSize: job.paperSize || 'A4',
                side: job.duplexMode === 'duplex' ? 'duplex' : 'simplex',
                orientation: job.orientation || 'portrait'
            };

            if (job.printerName && job.printerName !== 'Kiosk_Printer_Default') {
                options.printer = job.printerName;
            }

            // Silent print via pdf-to-printer / Windows spooler
            try {
                await pdfPrinter.print(localPath, options);
                console.log(`✅ Silent printing command dispatched to spooler successfully!`);
            } catch (printErr) {
                console.warn(`Windows pdfPrinter failed (${printErr.message}). Using fallback PowerShell silent print...`);
                // Fallback PowerShell print execution
                const { execSync } = require('child_process');
                execSync(`powershell -Command "Start-Process -FilePath '${localPath}' -Verb Print -WindowStyle Hidden"`);
            }

            // Clean up downloaded file
            setTimeout(() => {
                if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
            }, 5000);

            await updateJobStatus(job.printJobId, 'completed');
            success = true;
            console.log(`🎉 Job [${job.printJobId}] completed successfully!`);
        } catch (err) {
            console.error(`❌ Print execution failed on attempt ${retryCount}:`, err.message);
            if (retryCount >= MAX_RETRIES) {
                await updateJobStatus(job.printJobId, 'failed', err.message);
            } else {
                await new Promise(r => setTimeout(r, 3000)); // Wait 3s before retry
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

function startPrinterMonitoring() {
    setInterval(async () => {
        try {
            const statusObj = await getPrinterStatus('HP_LaserJet_Pro_M404dn');
            socket.emit('PRINTER_STATUS_CHANGE', {
                machineCode: MACHINE_CODE,
                status: statusObj.status,
                details: statusObj.details
            });

            // Update DB via API
            await axios.put(`${BACKEND_URL}/api/v1/machines/code/${MACHINE_CODE}/printer-status`, {
                printer_status: statusObj.status
            }).catch(() => {});
        } catch (err) {
            // Ignore background monitor error
        }
    }, 15000); // Every 15 seconds
}
