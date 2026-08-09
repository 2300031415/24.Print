const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');

/**
 * USB Drive Monitor — detects when removable drives (pendrives) are
 * inserted or removed on the Windows kiosk PC, then notifies via callback.
 */

const SUPPORTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.docx', '.doc', '.txt'];

let _prevDriveLetters = new Set();
let _monitorInterval = null;

/**
 * Gets list of currently inserted removable drives (USB pendrives).
 * DriveType 2 = Removable, 3 = Local (skip), 4 = Network (skip)
 */
async function getRemovableDrives() {
    try {
        const psCmd = `powershell -NoProfile -Command "Get-CimInstance Win32_LogicalDisk | Where-Object { $_.DriveType -eq 2 } | Select-Object -Property DeviceID, VolumeName, Size, FreeSpace | ConvertTo-Json"`;
        const { stdout } = await execPromise(psCmd, { timeout: 5000 });
        if (!stdout || !stdout.trim()) return [];
        const result = JSON.parse(stdout.trim());
        const drives = Array.isArray(result) ? result : [result];
        return drives.map(d => ({
            driveLetter: d.DeviceID,          // e.g. "E:"
            volumeName: d.VolumeName || 'USB Drive',
            totalSize: d.Size ? Math.round(d.Size / (1024 * 1024 * 1024) * 10) / 10 + ' GB' : 'Unknown',
            freeSpace: d.FreeSpace ? Math.round(d.FreeSpace / (1024 * 1024)) + ' MB free' : 'Unknown'
        }));
    } catch (err) {
        // If PowerShell fails (non-Windows or permissions), return empty
        return [];
    }
}

/**
 * Lists all supported printable files on the drive (root + 1 level subfolders)
 */
async function listDriveFiles(driveLetter) {
    try {
        const root = `${driveLetter}\\`;
        const allFiles = [];

        // Read root
        const rootItems = fs.readdirSync(root, { withFileTypes: true });
        for (const item of rootItems) {
            const fullPath = path.join(root, item.name);
            if (item.isFile()) {
                const ext = path.extname(item.name).toLowerCase();
                if (SUPPORTED_EXTENSIONS.includes(ext)) {
                    const stat = fs.statSync(fullPath);
                    allFiles.push({
                        name: item.name,
                        path: fullPath,
                        relativePath: item.name,
                        size: formatSize(stat.size),
                        sizeBytes: stat.size,
                        extension: ext.replace('.', '').toUpperCase(),
                        modified: stat.mtime.toISOString(),
                        folder: null
                    });
                }
            } else if (item.isDirectory() && !item.name.startsWith('.') && !item.name.startsWith('$')) {
                // Scan 1 level deep
                try {
                    const subItems = fs.readdirSync(fullPath, { withFileTypes: true });
                    for (const sub of subItems) {
                        if (sub.isFile()) {
                            const ext = path.extname(sub.name).toLowerCase();
                            if (SUPPORTED_EXTENSIONS.includes(ext)) {
                                const subFullPath = path.join(fullPath, sub.name);
                                const stat = fs.statSync(subFullPath);
                                allFiles.push({
                                    name: sub.name,
                                    path: subFullPath,
                                    relativePath: `${item.name}/${sub.name}`,
                                    size: formatSize(stat.size),
                                    sizeBytes: stat.size,
                                    extension: ext.replace('.', '').toUpperCase(),
                                    modified: stat.mtime.toISOString(),
                                    folder: item.name
                                });
                            }
                        }
                    }
                } catch (subErr) {
                    // Skip unreadable subfolder
                }
            }
        }

        // Sort: PDFs first, then by name
        allFiles.sort((a, b) => {
            if (a.extension === 'PDF' && b.extension !== 'PDF') return -1;
            if (a.extension !== 'PDF' && b.extension === 'PDF') return 1;
            return a.name.localeCompare(b.name);
        });

        return allFiles;
    } catch (err) {
        console.error(`[USB] Error listing files on ${driveLetter}:`, err.message);
        return [];
    }
}

/**
 * Reads a file from USB drive and returns it as a Buffer.
 */
function readDriveFile(filePath) {
    return fs.readFileSync(filePath);
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Starts USB monitoring. Calls onInserted(drive) / onRemoved(driveLetter) when drives change.
 */
function startUSBMonitoring({ onInserted, onRemoved }) {
    console.log('🔌 USB Drive Monitor started (polling every 2 seconds)...');

    _monitorInterval = setInterval(async () => {
        try {
            const currentDrives = await getRemovableDrives();
            const currentLetters = new Set(currentDrives.map(d => d.driveLetter));

            // Detect newly inserted drives
            for (const drive of currentDrives) {
                if (!_prevDriveLetters.has(drive.driveLetter)) {
                    console.log(`🔌 USB Drive INSERTED: ${drive.driveLetter} (${drive.volumeName})`);
                    if (typeof onInserted === 'function') {
                        onInserted(drive);
                    }
                }
            }

            // Detect removed drives
            for (const prevLetter of _prevDriveLetters) {
                if (!currentLetters.has(prevLetter)) {
                    console.log(`🔌 USB Drive REMOVED: ${prevLetter}`);
                    if (typeof onRemoved === 'function') {
                        onRemoved(prevLetter);
                    }
                }
            }

            _prevDriveLetters = currentLetters;
        } catch (err) {
            // Non-critical — skip this poll cycle silently
        }
    }, 2000);
}

function stopUSBMonitoring() {
    if (_monitorInterval) {
        clearInterval(_monitorInterval);
        _monitorInterval = null;
        console.log('🔌 USB Drive Monitor stopped.');
    }
}

module.exports = {
    startUSBMonitoring,
    stopUSBMonitoring,
    listDriveFiles,
    readDriveFile
};
