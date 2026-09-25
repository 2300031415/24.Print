# 1. Start Local Kiosk Setup & Launcher Daemon if not running
LAUNCHER_DIR="/opt/easyxerox/kiosk-launcher"
if [ ! -d "$LAUNCHER_DIR" ]; then
  LAUNCHER_DIR="$(dirname "${BASH_SOURCE[0]}")/launcher"
fi

if ! pgrep -f "launcher/server.js" >/dev/null 2>&1; then
  echo "🚀 Starting Local Kiosk Setup Engine on Port 5050..."
  if [ -d "$LAUNCHER_DIR" ]; then
    (cd "$LAUNCHER_DIR" && node server.js > /tmp/kiosk-launcher.log 2>&1 &)
    sleep 1.5
  fi
fi

# 2. Prevent Screen Sleeping & Hide Mouse Cursor
xset s off 2>/dev/null || true
xset -dpms 2>/dev/null || true
xset s noblank 2>/dev/null || true
unclutter -idle 0.5 -root 2>/dev/null &

# Start Openbox Window Manager if not already active
if ! pgrep -x "openbox" >/dev/null 2>&1; then
  openbox &
fi

# 3. Target UI is the Local Kiosk Shell (Guaranteed 0 Dinosaur Errors)
TARGET_URL="http://localhost:5050"

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

