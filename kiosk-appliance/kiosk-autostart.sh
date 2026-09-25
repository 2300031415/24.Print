#!/usr/bin/env bash
# ==============================================================================
# EasyXerox Kiosk Appliance — Hardware MAC Auto-Pairing Boot Script
# ==============================================================================

# 1. Load Local Configuration if present
CONFIG_FILE="/etc/default/easyxerox-kiosk"
if [ -f "$CONFIG_FILE" ]; then
  # shellcheck source=/dev/null
  source "$CONFIG_FILE"
fi

SERVER_URL="${SERVER_URL:-https://easyxerox.com}"
API_URL="${SERVER_URL}/api/machines/identify"

echo "🚀 EasyXerox Dedicated Kiosk Appliance Initializing..."
echo "🌐 Server URL: ${SERVER_URL}"

# 2. Prevent Screen Sleeping & Hide Mouse Cursor
xset s off 2>/dev/null || true
xset -dpms 2>/dev/null || true
xset s noblank 2>/dev/null || true
unclutter -idle 0.5 -root 2>/dev/null &

# Start Openbox Window Manager if not already active
if ! pgrep -x "openbox" >/dev/null 2>&1; then
  openbox &
fi


# 3. Wait for Network to be Ready
echo "⏳ Waiting for network connection..."
for i in {1..30}; do
  if ping -c 1 -W 2 1.1.1.1 >/dev/null 2>&1 || ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1 || curl -s -m 2 "${SERVER_URL}" >/dev/null 2>&1; then
    echo "✅ Network connection confirmed active (attempt $i)."
    break
  fi
  sleep 1
done

# 4. Get Primary Network MAC Address
MAC_ADDR=$(cat /sys/class/net/e*/address 2>/dev/null || cat /sys/class/net/w*/address 2>/dev/null || cat /sys/class/net/*/address 2>/dev/null | head -n 1)
MAC_CLEAN=$(echo "$MAC_ADDR" | tr -d ' :' | tr '[:upper:]' '[:lower:]')

if [ -z "$MAC_CLEAN" ]; then
  MAC_CLEAN="unknown0000"
fi
echo "🔍 Board MAC Address: [${MAC_CLEAN}]"

# 5. Hardware Auto-Pairing Identification Loop
TARGET_URL=""
for attempt in {1..10}; do
  echo "📡 Querying registration status for MAC: [${MAC_CLEAN}] (Attempt ${attempt}/10)..."
  RESPONSE=$(curl -s -m 6 "${API_URL}?mac=${MAC_CLEAN}" || true)
  
  if [ -n "$RESPONSE" ]; then
    IS_REGISTERED=$(echo "$RESPONSE" | grep -o '"registered":true' || true)
    MACHINE_CODE=$(echo "$RESPONSE" | grep -o '"machineCode":"[^"]*' | cut -d'"' -f4 || true)

    if [ -n "$IS_REGISTERED" ] && [ -n "$MACHINE_CODE" ]; then
      echo "✅ Board Paired Successfully! Machine Code: [${MACHINE_CODE}]"
      TARGET_URL="${SERVER_URL}/kiosk/${MACHINE_CODE}"
      break
    else
      echo "⏳ Unregistered Board. MAC: [${MAC_CLEAN}]. Launching setup standby."
      TARGET_URL="${SERVER_URL}/features/public/UnregisteredKiosk?mac=${MAC_CLEAN}"
      break
    fi
  fi

  sleep 2
done

# Fallback if completely offline or unreachable
if [ -z "$TARGET_URL" ]; then
  echo "⚠️ Network not ready or server unreachable. Launching fallback standby UI."
  TARGET_URL="${SERVER_URL}/features/public/UnregisteredKiosk?mac=${MAC_CLEAN}&offline=true"
fi

# 6. Locate Browser Executable (Chromium / Chrome)
BROWSER_BIN=""
for bin in chromium chromium-browser google-chrome-stable google-chrome; do
  if command -v "$bin" >/dev/null 2>&1; then
    BROWSER_BIN="$bin"
    break
  fi
done

if [ -z "$BROWSER_BIN" ]; then
  echo "❌ Error: No Chromium or Chrome browser executable found!"
  exit 1
fi

echo "🖥️ Starting Fullscreen Kiosk Mode using [${BROWSER_BIN}]"
echo "🌐 URL: ${TARGET_URL}"

# 7. Continuous Kiosk Loop (Auto-restart if browser crashes or closes)
while true; do
  "$BROWSER_BIN" \
    --kiosk \
    --noerrdialogs \
    --disable-infobars \
    --disable-translate \
    --disable-pinch \
    --overscroll-history-navigation=0 \
    --check-for-update-interval=31536000 \
    --autoplay-policy=no-user-gesture-required \
    --no-first-run \
    --disable-session-crashed-bubble \
    --incognito \
    "${TARGET_URL}"

  echo "⚠️ Browser exited. Restarting in 2 seconds..."
  sleep 2
done

