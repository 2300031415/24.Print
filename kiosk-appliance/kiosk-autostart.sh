#!/usr/bin/env bash
# ==============================================================================
# EasyXerox Kiosk Appliance — Hardware MAC Auto-Pairing Boot Script
# ==============================================================================

SERVER_URL="https://easyxerox.com"
API_URL="${SERVER_URL}/api/machines/identify"

# 1. Get Primary Network MAC Address
MAC_ADDR=$(cat /sys/class/net/e*/address 2>/dev/null || cat /sys/class/net/w*/address 2>/dev/null || cat /sys/class/net/*/address | head -n 1)
MAC_CLEAN=$(echo "$MAC_ADDR" | tr -d ' :' | tr '[:upper:]' '[:lower:]')

echo "🚀 EasyXerox Hardware Kiosk Appliance Initializing..."
echo "🔍 Board MAC Address: [${MAC_CLEAN}]"

# 2. Prevent Screen Sleeping & Hide Mouse Cursor
xset s off 2>/dev/null
xset -dpms 2>/dev/null
xset s noblank 2>/dev/null
unclutter -idle 0.5 -root 2>/dev/null &

# 3. Hardware Auto-Pairing Identification Loop
while true; do
  RESPONSE=$(curl -s -m 5 "${API_URL}?mac=${MAC_CLEAN}")
  IS_REGISTRED=$(echo "$RESPONSE" | grep -o '"registered":true')
  MACHINE_CODE=$(echo "$RESPONSE" | grep -o '"machineCode":"[^"]*' | cut -d'"' -f4)

  if [ -n "$IS_REGISTRED" ] && [ -n "$MACHINE_CODE" ]; then
    echo "✅ Board Paired Successfully! Machine Code: [${MACHINE_CODE}]"
    TARGET_URL="${SERVER_URL}/kiosk/${MACHINE_CODE}"
    break
  else
    echo "⏳ Standing by... Unregistered Board. MAC: [${MAC_CLEAN}]. Waiting for Super Admin setup."
    # If unregistered, launch local standby UI
    TARGET_URL="${SERVER_URL}/features/public/UnregisteredKiosk?mac=${MAC_CLEAN}"
    break
  fi

  sleep 3
done

# 4. Launch Fullscreen Locked-Down Kiosk Browser
echo "🖥️ Launching Fullscreen Kiosk Mode -> ${TARGET_URL}"
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-translate \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --check-for-update-interval=31536000 \
  --autoplay-policy=no-user-gesture-required \
  "${TARGET_URL}"
