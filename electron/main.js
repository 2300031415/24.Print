const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        fullscreen: true,
        kiosk: true,
        frame: false,
        autoHideMenuBar: true,
        alwaysOnTop: true,
        title: 'PrintPulse Commercial Xerox Kiosk',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const targetUrl = process.env.ELECTRON_START_URL || 'https://lowcostfreedom.com/kiosk/KIOSK-001';
    console.log(`🌐 Electron Kiosk loading Cloud Server URL: ${targetUrl}`);
    
    // Load Cloud Server Kiosk Screen
    mainWindow.loadURL(targetUrl).catch((err) => {
        console.error('⚠️ Failed to load target URL:', err.message);
    });

    // Register Kiosk Admin Exit shortcut (Ctrl + Shift + Alt + K)
    globalShortcut.register('CommandOrControl+Shift+Alt+K', () => {
        if (mainWindow.isKiosk()) {
            mainWindow.setKiosk(false);
            mainWindow.setFullScreen(false);
        } else {
            mainWindow.setKiosk(true);
            mainWindow.setFullScreen(true);
        }
    });

    // Register F5 & Ctrl+R to reload kiosk page inside Electron
    globalShortcut.register('F5', () => {
        if (mainWindow) mainWindow.reload();
    });
    globalShortcut.register('CommandOrControl+R', () => {
        if (mainWindow) mainWindow.reload();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

ipcMain.handle('get-system-info', () => {
    return {
        platform: process.platform,
        arch: process.arch,
        version: app.getVersion()
    };
});

ipcMain.on('exit-kiosk-app', () => {
    app.quit();
});
