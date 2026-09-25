/**
 * printerService.js — EasyXerox Hardware Abstraction Layer
 * ─────────────────────────────────────────────────────────────
 * Provides a unified PrinterService class that works on both
 * Linux/CUPS (kiosk appliance) and Windows (legacy deployments).
 *
 * Public API:
 *   getPrinters()           → [{ name, status, isDefault }]
 *   getPrinterStatus(name)  → { status, paper, toner, details }
 *   getPaperStatus(name)    → { level, sheets_remaining, tray }
 *   getTonerStatus(name)    → { level_pct, color, cartridge_id }
 *   submitPrintJob(opts)    → { jobId, queued }
 *   cancelPrintJob(jobId)   → { cancelled }
 *   getSystemTelemetry()    → { cpu, ram, disk, temp, uptime }
 */

'use strict';

const { exec, execSync } = require('child_process');
const util  = require('util');
const fs    = require('fs');
const path  = require('path');
const os    = require('os');

const execPromise = util.promisify(exec);

// ─── Load machine config (set during first-boot setup) ────────
const CONFIG_PATHS = [
  '/etc/easyxerox/config.json',
  path.join(__dirname, '../../kiosk-appliance/machine_config.json'),
  path.join(__dirname, '../machine_config.json')
];

function loadMachineConfig() {
  for (const p of CONFIG_PATHS) {
    try {
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (_) {}
  }
  return { printer_name: '', paper_size: 'A4' };
}

const machineConfig = loadMachineConfig();

// ─── Platform helpers ─────────────────────────────────────────

const IS_LINUX   = process.platform === 'linux';
const IS_WINDOWS = process.platform === 'win32';

/* ─────────────────────────────────────────────────────────────
   getPrinters — list all installed printers
   ─────────────────────────────────────────────────────────────*/
async function getPrinters() {
  if (IS_LINUX) {
    return _getCupsPrinters();
  } else if (IS_WINDOWS) {
    return _getWindowsPrinters();
  }
  return [_mockPrinter()];
}

async function _getCupsPrinters() {
  try {
    // lpstat -a = list all accepted queues
    // lpstat -d = show default printer
    const [acceptedOut, defaultOut] = await Promise.all([
      execPromise('lpstat -a 2>/dev/null || true').then(r => r.stdout || ''),
      execPromise('lpstat -d 2>/dev/null || true').then(r => r.stdout || '')
    ]);

    const defaultMatch = defaultOut.match(/system default destination:\s*(\S+)/i);
    const defaultName  = defaultMatch ? defaultMatch[1].trim() : '';

    if (!acceptedOut.trim()) return [_mockPrinter(defaultName)];

    const printers = [];
    for (const line of acceptedOut.split('\n')) {
      const m = line.match(/^(\S+)\s+accepting/i);
      if (m) {
        const name    = m[1];
        const status  = await _getCupsPrinterStatus(name);
        printers.push({ name, status: status.status, isDefault: name === defaultName });
      }
    }
    return printers.length ? printers : [_mockPrinter(defaultName)];
  } catch (_) {
    return [_mockPrinter()];
  }
}

async function _getWindowsPrinters() {
  try {
    const { stdout } = await execPromise(
      `powershell -Command "Get-Printer | Select-Object Name,PrinterStatus,Default | ConvertTo-Json"`,
      { timeout: 8000 }
    );
    const raw = JSON.parse(stdout);
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr.map(p => ({
      name: p.Name,
      status: _mapWinStatus(p.PrinterStatus),
      isDefault: !!p.Default
    }));
  } catch (_) {
    return [_mockPrinter()];
  }
}

function _mapWinStatus(code) {
  // https://docs.microsoft.com/en-us/windows/win32/printdocs/printer-info-2
  const map = { 0: 'ready', 1: 'paused', 2: 'error', 512: 'printing', 1048576: 'offline' };
  return map[code] || 'unknown';
}

function _mockPrinter(name = 'HP_LaserJet_Default') {
  return { name, status: 'ready', isDefault: true };
}

/* ─────────────────────────────────────────────────────────────
   getPrinterStatus
   ─────────────────────────────────────────────────────────────*/
async function getPrinterStatus(printerName) {
  const name = printerName || machineConfig.printer_name || '';
  if (IS_LINUX) {
    return _getCupsPrinterStatus(name);
  } else if (IS_WINDOWS) {
    return _getWindowsPrinterStatus(name);
  }
  return { status: 'ready', paper: 'ok', toner: 'ok', details: 'Mock OK' };
}

async function _getCupsPrinterStatus(name) {
  try {
    const { stdout } = await execPromise(`lpstat -p "${name}" 2>/dev/null || true`);
    const line = stdout || '';

    if (!line.trim()) return { status: 'offline', paper: 'unknown', toner: 'unknown', details: 'Printer not found in CUPS queue.' };

    const isIdle       = /is idle/i.test(line);
    const isPrinting   = /processing/i.test(line) || /printing/i.test(line);
    const isDisabled   = /disabled/i.test(line);
    const isPaperOut   = /paper/i.test(line);
    const isTonerLow   = /toner|ink/i.test(line);

    let status = 'ready';
    if (isDisabled)  status = 'offline';
    else if (isPaperOut) status = 'paper_out';
    else if (isTonerLow) status = 'toner_low';
    else if (isPrinting)  status = 'printing';
    else if (isIdle)      status = 'ready';

    return {
      status,
      paper: isPaperOut ? 'empty' : 'ok',
      toner: isTonerLow ? 'low'   : 'ok',
      details: line.trim()
    };
  } catch (_) {
    return { status: 'offline', paper: 'unknown', toner: 'unknown', details: 'CUPS query failed.' };
  }
}

async function _getWindowsPrinterStatus(name) {
  try {
    const psCmd = name
      ? `powershell -Command "Get-Printer -Name '${name}' | Select-Object PrinterStatus,PaperOut,TonerLow | ConvertTo-Json"`
      : `powershell -Command "Get-Printer | Where-Object Default -eq $true | Select-Object PrinterStatus,PaperOut,TonerLow | ConvertTo-Json"`;
    const { stdout } = await execPromise(psCmd, { timeout: 6000 });
    const p = JSON.parse(stdout);
    return {
      status: _mapWinStatus(p.PrinterStatus),
      paper: p.PaperOut ? 'empty' : 'ok',
      toner: p.TonerLow ? 'low'   : 'ok',
      details: `WinAPI PrinterStatus=${p.PrinterStatus}`
    };
  } catch (_) {
    return { status: 'offline', paper: 'unknown', toner: 'unknown', details: 'WMI query failed.' };
  }
}

/* ─────────────────────────────────────────────────────────────
   getPaperStatus — paper tray sensor
   Returns level: 'ok' | 'low' | 'empty'
   ─────────────────────────────────────────────────────────────*/
async function getPaperStatus(printerName) {
  const raw = await getPrinterStatus(printerName);
  return {
    level:            raw.paper === 'ok'    ? 'ok'    : (raw.paper === 'empty' ? 'empty' : 'low'),
    sheets_remaining: raw.paper === 'empty' ? 0       : (raw.paper === 'low' ? 50 : 500),
    tray:             'main',
    details:          raw.details
  };
}

/* ─────────────────────────────────────────────────────────────
   getTonerStatus — ink / toner cartridge sensor
   Returns level_pct: 0-100
   ─────────────────────────────────────────────────────────────*/
async function getTonerStatus(printerName) {
  const raw = await getPrinterStatus(printerName);
  return {
    level_pct:    raw.toner === 'ok'  ? 80  : (raw.toner === 'low' ? 15 : 0),
    color:        'black',
    cartridge_id: 'auto-detect',
    details:      raw.details
  };
}

/* ─────────────────────────────────────────────────────────────
   submitPrintJob — submit job to CUPS or Windows spooler
   opts = { filePath, printerName, copies, duplex, paperSize, colorMode }
   ─────────────────────────────────────────────────────────────*/
async function submitPrintJob(opts = {}) {
  const {
    filePath,
    printerName,
    copies    = 1,
    duplex    = false,
    paperSize = machineConfig.paper_size || 'A4',
    colorMode = 'bw'
  } = opts;

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`Print file not found: ${filePath}`);
  }

  const name = printerName || machineConfig.printer_name || '';

  if (IS_LINUX) {
    return _cupsSubmitJob({ filePath, name, copies, duplex, paperSize, colorMode });
  } else if (IS_WINDOWS) {
    return _windowsSubmitJob({ filePath, name, copies, duplex, paperSize, colorMode });
  }

  console.log(`[MockPrint] Would print ${filePath} × ${copies} copies`);
  return { jobId: `mock-${Date.now()}`, queued: true };
}

async function _cupsSubmitJob({ filePath, name, copies, duplex, paperSize, colorMode }) {
  const args = [
    `-n ${copies}`,
    `-o media=${paperSize}`,
    duplex ? '-o sides=two-sided-long-edge' : '-o sides=one-sided',
    colorMode === 'color' ? '-o ColorModel=RGB' : '-o ColorModel=CMYK -o print-color-mode=monochrome',
    name ? `-d "${name}"` : ''
  ].filter(Boolean).join(' ');

  const cmd = `lp ${args} "${filePath}"`;
  try {
    const { stdout } = await execPromise(cmd);
    // stdout: "request id is HP_LaserJet-42 (1 file(s))"
    const m = stdout.match(/request id is (\S+)/i);
    return { jobId: m ? m[1] : `cups-${Date.now()}`, queued: true };
  } catch (err) {
    throw new Error(`CUPS lp failed: ${err.message}`);
  }
}

async function _windowsSubmitJob({ filePath, name, copies, duplex }) {
  try {
    // Use pdf-to-printer if available
    const pdfPrinter = require('pdf-to-printer');
    const opts = { copies, side: duplex ? 'duplex' : 'simplex' };
    if (name) opts.printer = name;
    await pdfPrinter.print(filePath, opts);
    return { jobId: `win-${Date.now()}`, queued: true };
  } catch (_) {
    // Fallback: Edge headless print
    const printerArg = name ? `--print-to="${name}"` : '--print-to-default';
    execSync(
      `powershell -Command "Start-Process msedge -ArgumentList '--headless ${printerArg} \\"${filePath}\\"' -WindowStyle Hidden"`,
      { stdio: 'ignore' }
    );
    return { jobId: `edge-${Date.now()}`, queued: true };
  }
}

/* ─────────────────────────────────────────────────────────────
   cancelPrintJob — cancel a pending CUPS job
   ─────────────────────────────────────────────────────────────*/
async function cancelPrintJob(jobId) {
  if (!jobId) return { cancelled: false, reason: 'No jobId provided.' };
  try {
    if (IS_LINUX) {
      await execPromise(`cancel "${jobId}" 2>/dev/null || true`);
    } else if (IS_WINDOWS) {
      await execPromise(`powershell -Command "Remove-PrintJob -ID ${jobId.split('-').pop()}"`, { timeout: 4000 }).catch(() => {});
    }
    return { cancelled: true, jobId };
  } catch (err) {
    return { cancelled: false, reason: err.message };
  }
}

/* ─────────────────────────────────────────────────────────────
   getSystemTelemetry — CPU, RAM, disk, temp, uptime
   Used by heartbeat daemon to POST to backend every 30s
   ─────────────────────────────────────────────────────────────*/
async function getSystemTelemetry() {
  const uptime_seconds = Math.floor(os.uptime());

  // RAM
  const totalMem = os.totalmem();
  const freeMem  = os.freemem();
  const ram_percent = Math.round(((totalMem - freeMem) / totalMem) * 100);

  // CPU — 1-second average
  let cpu_percent = 0;
  try {
    if (IS_LINUX) {
      const { stdout } = await execPromise("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1");
      cpu_percent = parseFloat(stdout) || 0;
    } else if (IS_WINDOWS) {
      const { stdout } = await execPromise("powershell -Command \"(Get-WmiObject Win32_Processor | Measure-Object -Property LoadPercentage -Average).Average\"", { timeout: 5000 });
      cpu_percent = parseFloat(stdout) || 0;
    }
  } catch (_) {}

  // Disk
  let disk_percent = 0;
  try {
    if (IS_LINUX) {
      const { stdout } = await execPromise("df / | awk 'NR==2{print $5}' | tr -d '%'");
      disk_percent = parseFloat(stdout) || 0;
    }
  } catch (_) {}

  // CPU temperature (Linux only via thermal zone)
  let temp_c = null;
  try {
    if (IS_LINUX) {
      const { stdout } = await execPromise("cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null || echo 0");
      const raw = parseInt(stdout.trim(), 10);
      if (raw > 0) temp_c = Math.round(raw / 1000);
    }
  } catch (_) {}

  return { cpu_percent, ram_percent, disk_percent, temp_c, uptime_seconds };
}

/* ─────────────────────────────────────────────────────────────
   PrinterService class — OOP wrapper for all of the above
   ─────────────────────────────────────────────────────────────*/
class PrinterService {
  constructor(printerName = '') {
    this.printerName = printerName || machineConfig.printer_name || '';
  }

  getPrinters()                   { return getPrinters(); }
  getPrinterStatus()              { return getPrinterStatus(this.printerName); }
  getPaperStatus()                { return getPaperStatus(this.printerName); }
  getTonerStatus()                { return getTonerStatus(this.printerName); }
  getSystemTelemetry()            { return getSystemTelemetry(); }

  submitPrintJob(opts = {}) {
    return submitPrintJob({ printerName: this.printerName, ...opts });
  }

  cancelPrintJob(jobId) {
    return cancelPrintJob(jobId);
  }
}

// ─── Singleton export ─────────────────────────────────────────
const printerService = new PrinterService();

module.exports = {
  PrinterService,
  printerService,
  getPrinters,
  getPrinterStatus,
  getPaperStatus,
  getTonerStatus,
  submitPrintJob,
  cancelPrintJob,
  getSystemTelemetry
};
