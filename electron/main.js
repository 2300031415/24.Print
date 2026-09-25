const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

// Auto-start the local Kiosk Launcher server if not already running
try {
  require('../kiosk-appliance/launcher/server.js');
} catch (e) {
  console.log('Local launcher server initialized or already active.');
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    kiosk: true,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    alwaysOnTop: process.env.NODE_ENV === 'production',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the Local Kiosk Launcher & Setup Engine
  const startUrl = process.env.KIOSK_URL || 'http://localhost:5050';
  mainWindow.loadURL(startUrl);

  // Crash recovery
  mainWindow.webContents.on('render-process-gone', (event, detailed) => {
    console.warn('Renderer process crashed, reloading...', detailed.reason);
    mainWindow.loadURL(startUrl);
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.warn('Renderer unresponsive, reloading...');
    mainWindow.reload();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    // Disable typical exit shortcuts in production
    if (process.env.NODE_ENV === 'production') {
      globalShortcut.register('Alt+F4', () => false);
      globalShortcut.register('CommandOrControl+W', () => false);
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
