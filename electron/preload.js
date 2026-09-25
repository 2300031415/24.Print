const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronKiosk', {
  platform: process.platform,
  isElectron: true,
  version: '2.0.0'
});
