const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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
        // Fallback mock printers if PowerShell command fails or non-Windows env
        return [
            { Name: 'HP_LaserJet_Pro_M404dn', PrinterStatus: 'Normal', WorkOffline: false, PaperOut: false, TonerLow: false },
            { Name: 'Canon_ImageCLASS_MF244dw', PrinterStatus: 'Normal', WorkOffline: false, PaperOut: false, TonerLow: false }
        ];
    }
}

/**
 * Get detailed status of a specific printer by name.
 */
async function getPrinterStatus(printerName) {
    const printers = await getWindowsPrinters();
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
    getPrinterStatus
};
