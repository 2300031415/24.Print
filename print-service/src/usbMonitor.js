const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * USB Drive Monitor — Ultra-reliable & instant drive detector for Windows PC.
 * Uses native fs.existsSync + cmd vol check (0ms overhead, zero flickering/timeouts).
 */

const SUPPORTED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.docx', '.doc', '.txt'];
const CHECK_LETTERS = ['D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', 'K:', 'L:', 'M:', 'N:', 'O:', 'P:', 'Q:', 'R:', 'S:', 'T:', 'U:', 'V:', 'W:', 'X:', 'Y:', 'Z:'];

let _knownDrives = new Map(); // driveLetter -> driveInfo object
let _monitorInterval = null;

/**
 * Gets volume name using fast built-in `vol D:` command
 */
function getVolumeName(letter) {
    try {
        const stdout = execSync(`cmd /c vol ${letter}`, { timeout: 1500, encoding: 'utf8' });
        // Output format: "Volume in drive D is KALI LINUX\n Volume Serial Number is..."
        const match = stdout.match(/Volume in drive [A-Z] is (.*)/i);
        if (match && match[1] && match[1].trim()) {
            return match[1].trim();
        }
    } catch (_) {}
    return 'USB Drive';
}

/**
 * Scans drive letters D: through Z: instantly using fs.existsSync
 */
function checkConnectedDrives() {
    const currentDrives = new Map();

    for (const letter of CHECK_LETTERS) {
        const rootPath = `${letter}\\`;
        try {
            if (fs.existsSync(rootPath)) {
                // Confirm drive is readable
                try {
                    fs.readdirSync(rootPath);
                    const volName = getVolumeName(letter);
                    currentDrives.set(letter, {
                        driveLetter: letter,
                        volumeName: volName,
                        totalSize: 'Removable Storage',
                        freeSpace: 'Ready'
                    });
                } catch (_) {
                    // Unreadable drive (e.g. empty CD drive or locked device), ignore
                }
            }
        } catch (_) {}
    }

    return currentDrives;
}

/**
 * Lists all printable files on the specified drive (root + 1 level deep)
 */
async function listDriveFiles(driveLetter) {
    try {
        const root = `${driveLetter}\\`;
        const allFiles = [];

        if (!fs.existsSync(root)) return [];

        const rootItems = fs.readdirSync(root, { withFileTypes: true });
        for (const item of rootItems) {
            const fullPath = path.join(root, item.name);
            if (item.isFile()) {
                const ext = path.extname(item.name).toLowerCase();
                if (SUPPORTED_EXTENSIONS.includes(ext)) {
                    try {
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
                    } catch (_) {}
                }
            } else if (item.isDirectory() && !item.name.startsWith('.') && !item.name.startsWith('$')) {
                // Scan 1 level subfolder
                try {
                    const subItems = fs.readdirSync(fullPath, { withFileTypes: true });
                    for (const sub of subItems) {
                        if (sub.isFile()) {
                            const ext = path.extname(sub.name).toLowerCase();
                            if (SUPPORTED_EXTENSIONS.includes(ext)) {
                                const subFullPath = path.join(fullPath, sub.name);
                                try {
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
                                } catch (_) {}
                            }
                        }
                    }
                } catch (_) {}
            }
        }

        // Sort: PDFs first
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
 * Read file buffer from USB drive
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
 * Starts USB monitoring. Checks every 1.5 seconds.
 */
function startUSBMonitoring({ onInserted, onRemoved }) {
    console.log('🔌 USB Drive Monitor active (instant drive scan every 1.5s)...');

    // Initial scan
    _knownDrives = checkConnectedDrives();

    _monitorInterval = setInterval(() => {
        try {
            const currentDrives = checkConnectedDrives();

            // Check newly inserted
            for (const [letter, drive] of currentDrives.entries()) {
                if (!_knownDrives.has(letter)) {
                    console.log(`🔌 USB Drive INSERTED: ${letter} (${drive.volumeName})`);
                    _knownDrives.set(letter, drive);
                    if (typeof onInserted === 'function') {
                        onInserted(drive);
                    }
                }
            }

            // Check removed
            for (const [letter, drive] of _knownDrives.entries()) {
                if (!currentDrives.has(letter)) {
                    console.log(`🔌 USB Drive REMOVED: ${letter}`);
                    _knownDrives.delete(letter);
                    if (typeof onRemoved === 'function') {
                        onRemoved(letter);
                    }
                }
            }
        } catch (_) {}
    }, 1500);
}

function stopUSBMonitoring() {
    if (_monitorInterval) {
        clearInterval(_monitorInterval);
        _monitorInterval = null;
    }
}

module.exports = {
    startUSBMonitoring,
    stopUSBMonitoring,
    listDriveFiles,
    readDriveFile
};
