const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const util = require('util');
const axios = require('axios');
const io = require('socket.io-client');

const execPromise = util.promisify(exec);
const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Persistent Config Location
const SYSTEM_CONFIG_PATH = '/etc/easyxerox/config.json';
const LOCAL_CONFIG_PATH = path.join(__dirname, 'config.json');
const CONFIG_PATH = fs.existsSync('/etc/easyxerox') ? SYSTEM_CONFIG_PATH : LOCAL_CONFIG_PATH;

function loadConfig() {
  const defaults = {
    configured: false,
    machineCode: 'KIOSK-001',
    boardName: 'EasyXerox Master Board',
    serverUrl: 'https://easyxerox.com',
    autoStartKiosk: true
  };
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return { ...defaults, ...JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) };
    }
  } catch (_) {}
  return defaults;
}

function saveConfig(newConfig) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    try { fs.mkdirSync(dir, { recursive: true }); } catch (_) {}
  }
  const config = { ...loadConfig(), ...newConfig };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  return config;
}

// Get MAC Address
function getMacAddress() {
  try {
    if (process.platform === 'linux') {
      const out = execSync("cat /sys/class/net/e*/address 2>/dev/null || cat /sys/class/net/w*/address 2>/dev/null || cat /sys/class/net/*/address 2>/dev/null | head -n 1", { encoding: 'utf8' });
      const clean = out.replace(/[: \n\r]/g, '').toLowerCase();
      if (clean) return clean;
    }
  } catch (_) {}
  return 'b42e99a1c48f';
}

// Check Internet Connectivity
async function checkInternet() {
  try {
    await axios.get('https://1.1.1.1', { timeout: 2000 });
    return true;
  } catch (_) {
    try {
      await axios.get('https://8.8.8.8', { timeout: 2000 });
      return true;
    } catch (_) {
      return false;
    }
  }
}

// ─────────────────────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────────────────────

// Status & Current Configuration
app.get('/api/status', async (req, res) => {
  const config = loadConfig();
  const isOnline = await checkInternet();
  const mac = getMacAddress();

  let activeIp = '127.0.0.1';
  let activeConn = 'Disconnected';
  try {
    if (process.platform === 'linux') {
      activeIp = execSync("hostname -I 2>/dev/null || true", { encoding: 'utf8' }).trim().split(' ')[0] || '127.0.0.1';
      const nmState = execSync("nmcli -t -f DEVICE,TYPE,STATE dev 2>/dev/null || true", { encoding: 'utf8' });
      if (nmState.includes('connected')) {
        activeConn = nmState.includes('wifi:connected') ? 'Wi-Fi' : 'Ethernet (LAN)';
      }
    }
  } catch (_) {}

  res.json({
    ...config,
    mac,
    ip: activeIp,
    connectionType: activeConn,
    isOnline
  });
});

// Scan WiFi Networks
app.get('/api/wifi/scan', async (req, res) => {
  try {
    if (process.platform === 'linux') {
      const { stdout } = await execPromise('nmcli -t -f SSID,BSSID,SIGNAL,SECURITY,IN-USE dev wifi list --rescan yes 2>/dev/null || nmcli -t -f SSID,BSSID,SIGNAL,SECURITY,IN-USE dev wifi list 2>/dev/null || true');
      const lines = stdout.split('\n').filter(Boolean);
      const networks = [];
      const seen = new Set();

      for (const line of lines) {
        // format: SSID:BSSID:SIGNAL:SECURITY:IN-USE
        // Since BSSID has colons, parse carefully from ends
        const parts = line.split(':');
        if (parts.length >= 5) {
          const ssid = parts[0].trim();
          const inUse = parts[parts.length - 1].trim() === '*';
          const security = parts[parts.length - 2].trim() || 'Open';
          const signal = parseInt(parts[parts.length - 3], 10) || 50;

          if (ssid && !seen.has(ssid)) {
            seen.add(ssid);
            networks.push({ ssid, signal, security, connected: inUse });
          }
        }
      }
      return res.json({ success: true, networks });
    }
  } catch (err) {
    console.error('WiFi scan error:', err.message);
  }

  // Fallback demo list if not on Linux or no WiFi adapter found
  res.json({
    success: true,
    networks: [
      { ssid: 'EasyXerox_Shop_5G', signal: 95, security: 'WPA2-PSK', connected: false },
      { ssid: 'Store_Office_WiFi', signal: 78, security: 'WPA2-PSK', connected: false },
      { ssid: 'Kiosk_Hotspot_Direct', signal: 62, security: 'WPA2', connected: false }
    ]
  });
});

// Connect to WiFi
app.post('/api/wifi/connect', async (req, res) => {
  const { ssid, password } = req.body || {};
  if (!ssid) return res.status(400).json({ success: false, message: 'SSID is required' });

  try {
    if (process.platform === 'linux') {
      const passCmd = password ? `password "${password.replace(/"/g, '\\"')}"` : '';
      await execPromise(`nmcli dev wifi connect "${ssid.replace(/"/g, '\\"')}" ${passCmd} 2>&1`);
      const online = await checkInternet();
      return res.json({ success: true, message: `Connected to ${ssid}`, isOnline: online });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Failed to connect to WiFi' });
  }

  res.json({ success: true, message: `Simulated connection to ${ssid}`, isOnline: true });
});

// Save Machine Configuration
app.post('/api/config', (req, res) => {
  const { machineCode, boardName, serverUrl, configured } = req.body || {};
  const updated = saveConfig({
    machineCode: machineCode ? machineCode.trim() : undefined,
    boardName: boardName ? boardName.trim() : undefined,
    serverUrl: serverUrl ? serverUrl.trim() : undefined,
    configured: configured !== undefined ? configured : true
  });

  // Re-sync central Socket.IO
  initSocketConnection();

  res.json({ success: true, config: updated });
});

// Test Connection to Backend
app.post('/api/test-server', async (req, res) => {
  const { serverUrl, machineCode } = req.body || {};
  const target = serverUrl || loadConfig().serverUrl;
  try {
    const resp = await axios.get(`${target}/api/machines/identify?mac=${getMacAddress()}`, { timeout: 5000 });
    res.json({ success: true, serverReachable: true, data: resp.data });
  } catch (err) {
    res.json({ success: false, serverReachable: false, message: err.message });
  }
});

// System Reboot / Reset
app.post('/api/system/reboot', (req, res) => {
  res.json({ success: true, message: 'Reboot initiated' });
  setTimeout(() => {
    try { execSync('sudo reboot 2>/dev/null || true'); } catch (_) {}
  }, 1000);
});

// ─────────────────────────────────────────────────────────────
// CENTRAL BACKEND SOCKET.IO CLIENT (LIVE OTA & REMOTE CONTROL)
// ─────────────────────────────────────────────────────────────
let socketClient = null;

function initSocketConnection() {
  const config = loadConfig();
  if (socketClient) {
    try { socketClient.disconnect(); } catch (_) {}
  }

  try {
    socketClient = io(config.serverUrl, { reconnection: true, timeout: 5000 });
    socketClient.on('connect', () => {
      console.log(`📡 Kiosk Launcher connected to Central Server Socket: ${config.serverUrl}`);
      socketClient.emit('JOIN_MACHINE', { machineCode: config.machineCode });
    });

    // Remote reload instruction from Super Admin
    socketClient.on('REMOTE_RELOAD', () => {
      console.log('🔄 Received REMOTE_RELOAD from Central Server');
      // trigger page reload
    });

    // Remote reboot instruction
    socketClient.on('REMOTE_REBOOT', () => {
      console.log('🔄 Received REMOTE_REBOOT from Central Server');
      try { execSync('sudo reboot 2>/dev/null || true'); } catch (_) {}
    });
  } catch (_) {}
}

initSocketConnection();

app.listen(PORT, () => {
  console.log(`🚀 EasyXerox Kiosk Setup & Launcher running at http://localhost:${PORT}`);
});
