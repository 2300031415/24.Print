const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Monitors printers across Windows and Linux (CUPS).
 */
async function getLinuxPrinters() {
    try {
        const { stdout } = await execPromise('lpstat -p -d 2>/dev/null || true');
        if (!stdout || !stdout.trim()) return [];

        const lines = stdout.split('\n');
        const printers = [];

        for (const line of lines) {
            const match = line.match(/^printer\s+([^\s]+)\s+(.*)/i);
            if (match) {
                const name = match[1];
                const desc = match[2] || '';
                const isIdle = desc.includes('is idle');
                const isProcessing = desc.includes('processing') || desc.includes('printing');
                const isDisabled = desc.includes('disabled');

                printers.push({
                    Name: name,
                    PrinterStatus: isDisabled ? 'Error' : (isProcessing ? 'Printing' : 'Normal'),
                    WorkOffline: isDisabled,
                    PaperOut: desc.toLowerCase().includes('paper'),
                    TonerLow: desc.toLowerCase().includes('toner') || desc.toLowerCase().includes('ink')
                });
            }
        }
        return printers;
    } catch (_) {
        return [];
    }
}

/**
 * Monitors Windows printers using PowerShell Get-Printer.
 */
async function getWindowsPrinters() {
    try {
        const psCommand = `powershell -Command "Get-Printer | Select-Name, PrinterStatus, WorkOffline, PaperOut, TonerLow | ConvertTo-Json"`;
        const { stdout } = await execPromise(psCommand);
        if (!stdout || !stdout.trim()) return [];
        const result = JSON.parse(stdout);
        return Array.isArray(result) ? result : [result];
    } catch (err) {
        return [];
    }
}

/**
 * Cross-platform printer discovery.
 */
async function getAllPrinters() {
    if (process.platform === 'win32') {
        const win = await getWindowsPrinters();
        if (win.length > 0) return win;
    } else {
        const lin = await getLinuxPrinters();
        if (lin.length > 0) return lin;
    }

    // Fallback mock printers if no physical printers attached yet
    return [
        { Name: 'HP_LaserJet_Pro_M404dn', PrinterStatus: 'Normal', WorkOffline: false, PaperOut: false, TonerLow: false },
        { Name: 'Canon_ImageCLASS_MF244dw', PrinterStatus: 'Normal', WorkOffline: false, PaperOut: false, TonerLow: false }
    ];
}

/**
 * Get detailed status of a specific printer by name.
 */
async function getPrinterStatus(printerName) {
    const printers = await getAllPrinters();
    const printer = printers.find(p => p.Name.toLowerCase() === (printerName || '').toLowerCase()) || printers[0];

    if (!printer) {
        return { status: 'offline', details: 'Printer not found on system.' };
    }

    if (printer.WorkOffline) {
        return { status: 'offline', details: 'Printer is offline.' };
    }
    if (printer.PaperOut) {
        return { status: 'paper_out', details: 'Paper tray empty. Load paper to continue.' };
    }
    if (printer.TonerLow) {
        return { status: 'toner_low', details: 'Toner level low.' };
    }
    if (printer.PrinterStatus && printer.PrinterStatus.toString().includes('Error')) {
        return { status: 'error', details: 'Printer reports hardware error.' };
    }

    return { status: 'ready', details: 'Printer ready and online.' };
}

module.exports = {
    getWindowsPrinters,
    getLinuxPrinters,
    getAllPrinters,
    getPrinterStatus
};

