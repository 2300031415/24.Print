const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  toggleKioskMode: () => ipcRenderer.send('toggle-kiosk-mode'),
  exitKioskApp: () => ipcRenderer.send('exit-kiosk-app')
});
