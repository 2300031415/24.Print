#!/usr/bin/env bash
# ==============================================================================
# EasyXerox Kiosk ISO Appliance Build Script (Debian Minimal Live Kiosk)
# ==============================================================================

set -e

BUILD_DIR="./easyxerox-kiosk-iso-build"
OUTPUT_ISO="EasyXerox-Kiosk-Appliance-v1.iso"

echo "📦 Creating Minimal EasyXerox Kiosk ISO Build Directory..."
mkdir -p "${BUILD_DIR}"

cat << 'EOF' > "${BUILD_DIR}/install-kiosk-dependencies.sh"
#!/bin/bash
sudo apt update
sudo apt install -y \
  xorg \
  openbox \
  chromium-browser \
  cups \
  cups-filters \
  printer-driver-all \
  curl \
  unclutter \
  x11-xserver-utils

# Enable CUPS Printer Daemon
sudo systemctl enable cups
sudo systemctl start cups
EOF

chmod +x "${BUILD_DIR}/install-kiosk-dependencies.sh"

echo "✅ Kiosk Appliance Builder Package Ready!"
echo "📁 Path: ${BUILD_DIR}"
