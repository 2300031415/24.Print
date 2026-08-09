const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * USB Drive Monitor — Ultra-reliable & instant drive detector for Windows PC.
 * Detects both already-inserted drives on daemon startup AND new insertions.
 */

const SUPPORTED_EXTENSIONS = [
    '.pdf',
    '.doc', '.docx',
    '.txt', '.rtf',
    '.jpg', '.jpeg', '.png', '.bmp', '.webp', '.tiff'
];

const CHECK_LETTERS = ['D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', 'K:', 'L:', 'M:', 'N:', 'O:', 'P:', 'Q:', 'R:', 'S:', 'T:', 'U:', 'V:', 'W:', 'X:', 'Y:', 'Z:'];

let _knownDrives = new Map(); // driveLetter -> driveInfo object
let _monitorInterval = null;

/**
 * Gets volume name using fast built-in `vol D:` command
 */
function getVolumeName(letter) {
    try {
        const stdout = execSync(`cmd /c vol ${letter}`, { timeout: 1500, encoding: 'utf8' });
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
                    // Unreadable drive, skip
                }
            }
        } catch (_) {}
    }

    return currentDrives;
}

/**
 * Recursive directory scanner to find all printable files (root + subfolders up to 4 levels deep)
 */
function scanDirectory(dirPath, depth = 0, folderName = null, allFiles = []) {
    if (depth > 4) return allFiles;
    try {
        const items = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const item of items) {
            // Ignore system/hidden folders
            if (item.name.startsWith('.') || item.name.startsWith('$') || item.name === 'System Volume Information' || item.name === 'RECYCLER') {
                continue;
            }
            const fullPath = path.join(dirPath, item.name);
            if (item.isFile()) {
                const ext = path.extname(item.name).toLowerCase();
                if (SUPPORTED_EXTENSIONS.includes(ext)) {
                    try {
                        const stat = fs.statSync(fullPath);
                        allFiles.push({
                            name: item.name,
                            path: fullPath,
                            relativePath: folderName ? `${folderName}/${item.name}` : item.name,
                            size: formatSize(stat.size),
                            sizeBytes: stat.size,
                            extension: ext.replace('.', '').toUpperCase(),
                            modified: stat.mtime.toISOString(),
                            folder: folderName
                        });
                    } catch (_) {}
                }
            } else if (item.isDirectory()) {
                scanDirectory(fullPath, depth + 1, folderName ? `${folderName}/${item.name}` : item.name, allFiles);
            }
        }
    } catch (_) {}
    return allFiles;
}

/**
 * Lists all printable files on the specified drive (root + nested subfolders)
 */
async function listDriveFiles(driveLetter) {
    try {
        const root = `${driveLetter}\\`;
        if (!fs.existsSync(root)) return [];

        const allFiles = scanDirectory(root, 0, null, []);

        // Sort: PDFs first, then alphabetically
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

    _knownDrives = new Map();

    const scan = () => {
        try {
            const currentDrives = checkConnectedDrives();

            for (const [letter, drive] of currentDrives.entries()) {
                if (!_knownDrives.has(letter)) {
                    console.log(`🔌 USB Drive INSERTED: ${letter} (${drive.volumeName})`);
                    _knownDrives.set(letter, drive);
                    if (typeof onInserted === 'function') {
                        onInserted(drive);
                    }
                }
            }

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
    };

    scan();
    _monitorInterval = setInterval(scan, 1500);
}

function stopUSBMonitoring() {
    if (_monitorInterval) {
        clearInterval(_monitorInterval);
        _monitorInterval = null;
    }
}

function getCurrentDrivesList() {
    try {
        const drivesMap = checkConnectedDrives();
        return Array.from(drivesMap.values());
    } catch (_) {
        return [];
    }
}

module.exports = {
    startUSBMonitoring,
    stopUSBMonitoring,
    listDriveFiles,
    readDriveFile,
    getCurrentDrivesList
};
