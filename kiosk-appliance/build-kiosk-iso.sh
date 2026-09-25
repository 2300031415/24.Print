#!/usr/bin/env bash
# ==============================================================================
# EasyXerox Kiosk Appliance — Debian Minimal Live Hybrid ISO Builder
# Generates a bootable ISO for both Legacy BIOS and UEFI x86_64 hardware.
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BUILD_DIR="${BUILD_DIR:-/tmp/easyxerox-kiosk-build}"
CHROOT_DIR="${BUILD_DIR}/chroot"
IMAGE_DIR="${BUILD_DIR}/image"
OUTPUT_ISO="${SCRIPT_DIR}/EasyXerox-Kiosk-Appliance-v1.iso"
DEBIAN_VERSION="bookworm"
DEBIAN_MIRROR="http://deb.debian.org/debian"

echo "======================================================================"
echo "💿 EasyXerox Kiosk Appliance Live ISO Builder"
echo "Target ISO: ${OUTPUT_ISO}"
echo "Debian Base: ${DEBIAN_VERSION} (amd64 / x86_64)"
echo "Boot Modes: Hybrid BIOS (ISOLINUX MBR) + UEFI (GRUB EFI)"
echo "======================================================================"

if [ "$(id -u)" -ne 0 ]; then
  echo "❌ Error: This script must be run as root (sudo)."
  exit 1
fi

# 1. Install Host Dependencies
echo "📦 [1/8] Installing host build tools..."
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get install -y \
  debootstrap \
  squashfs-tools \
  xorriso \
  isolinux \
  syslinux-common \
  grub-pc-bin \
  grub-efi-amd64-bin \
  mtools \
  dosfstools \
  curl \
  rsync

# 2. Prepare Clean Build Directory
echo "🧹 [2/8] Preparing build directories..."
# Unmount previous mounts if any
umount -lf "${CHROOT_DIR}/proc" 2>/dev/null || true
umount -lf "${CHROOT_DIR}/sys" 2>/dev/null || true
umount -lf "${CHROOT_DIR}/dev/pts" 2>/dev/null || true
umount -lf "${CHROOT_DIR}/dev" 2>/dev/null || true

rm -rf "${BUILD_DIR}"
mkdir -p "${CHROOT_DIR}"
mkdir -p "${IMAGE_DIR}/live"
mkdir -p "${IMAGE_DIR}/isolinux"
mkdir -p "${IMAGE_DIR}/boot/grub"

# 3. Bootstrap Minimal Debian System
echo "🚀 [3/8] Bootstrapping Debian ${DEBIAN_VERSION} (amd64)..."
debootstrap --arch=amd64 --variant=minbase "${DEBIAN_VERSION}" "${CHROOT_DIR}" "${DEBIAN_MIRROR}"

# 4. Mount Virtual Filesystems for Chroot
mount --bind /dev "${CHROOT_DIR}/dev"
mount --bind /dev/pts "${CHROOT_DIR}/dev/pts"
mount -t proc proc "${CHROOT_DIR}/proc"
mount -t sysfs sysfs "${CHROOT_DIR}/sys"

cleanup() {
  echo "🧹 Cleaning up mounts..."
  umount -lf "${CHROOT_DIR}/proc" 2>/dev/null || true
  umount -lf "${CHROOT_DIR}/sys" 2>/dev/null || true
  umount -lf "${CHROOT_DIR}/dev/pts" 2>/dev/null || true
  umount -lf "${CHROOT_DIR}/dev" 2>/dev/null || true
}
trap cleanup EXIT

# Configure APT sources in chroot
cat << EOF > "${CHROOT_DIR}/etc/apt/sources.list"
deb ${DEBIAN_MIRROR} ${DEBIAN_VERSION} main contrib non-free non-free-firmware
deb http://security.debian.org/debian-security ${DEBIAN_VERSION}-security main contrib non-free non-free-firmware
deb ${DEBIAN_MIRROR} ${DEBIAN_VERSION}-updates main contrib non-free non-free-firmware
EOF

cat << EOF > "${CHROOT_DIR}/etc/hostname"
easyxerox-kiosk
EOF

cat << EOF > "${CHROOT_DIR}/etc/hosts"
127.0.0.1   localhost easyxerox-kiosk
::1         localhost ip6-localhost ip6-loopback
EOF

# 5. Install Packages & Services inside Chroot
echo "📦 [4/8] Installing Kiosk Kernel, X11, Chromium, CUPS, and Node.js inside appliance..."
chroot "${CHROOT_DIR}" /bin/bash -c "
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y --no-install-recommends \
  linux-image-amd64 \
  live-boot \
  systemd-sysv \
  xorg \
  xinit \
  nodm \
  xterm \
  xserver-xorg-video-all \
  x11-xserver-utils \
  openbox \
  unclutter \
  chromium \
  cups \
  cups-filters \
  printer-driver-all \
  nodejs \
  npm \
  curl \
  jq \
  network-manager \
  iproute2 \
  pciutils \
  usbutils \
  udisks2 \
  sudo \
  libnss3 \
  libasound2 \
  fonts-noto-core \
  fonts-freefont-ttf

# Create Kiosk User
useradd -m -s /bin/bash -G audio,video,netdev,lp,lpadmin,dialout kiosk
passwd -d kiosk
passwd -d root

# Enable NetworkManager, CUPS, and NODM
systemctl enable NetworkManager
systemctl enable cups
systemctl enable nodm
systemctl set-default graphical.target

# Clean APT caches to minimize squashfs size
apt-get clean
rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
"

# 6. Deploy Kiosk Appliance Scripts & Services
echo "⚙️ [5/8] Configuring auto-start, kiosk autostart script, and print daemon..."

# Copy kiosk autostart script
cp "${SCRIPT_DIR}/kiosk-autostart.sh" "${CHROOT_DIR}/usr/local/bin/kiosk-autostart.sh"
chmod +x "${CHROOT_DIR}/usr/local/bin/kiosk-autostart.sh"

# Copy print-service into appliance
mkdir -p "${CHROOT_DIR}/opt/easyxerox/print-service"
rsync -av --exclude="node_modules" --exclude="temp_print" "${PROJECT_ROOT}/print-service/" "${CHROOT_DIR}/opt/easyxerox/print-service/"

# Install print-service production npm dependencies inside chroot
chroot "${CHROOT_DIR}" /bin/bash -c "
cd /opt/easyxerox/print-service
npm install --omit=dev --no-audit --no-fund
"

# Deploy systemd services
cp "${SCRIPT_DIR}/systemd/easyxerox-kiosk.service" "${CHROOT_DIR}/etc/systemd/system/easyxerox-kiosk.service"
cp "${SCRIPT_DIR}/systemd/easyxerox-print.service" "${CHROOT_DIR}/etc/systemd/system/easyxerox-print.service"

chroot "${CHROOT_DIR}" /bin/bash -c "
systemctl enable easyxerox-kiosk.service
systemctl enable easyxerox-print.service
"

# Configure Automatic Login on tty1 (No password, zero-click boot)
mkdir -p "${CHROOT_DIR}/etc/systemd/system/getty@tty1.service.d"
cat << 'EOF' > "${CHROOT_DIR}/etc/systemd/system/getty@tty1.service.d/autologin.conf"
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin kiosk --noclear %I $TERM
EOF

# Configure NODM (Automatic Kiosk Display Manager)
cat << 'EOF' > "${CHROOT_DIR}/etc/default/nodm"
NODM_ENABLED=true
NODM_USER=kiosk
NODM_XSESSION=/home/kiosk/.xsession
NODM_X_OPTIONS="-nocursor -s 0 -dpms"
NODM_MIN_SESSION_TIME=5
EOF

cat << 'EOF' > "${CHROOT_DIR}/home/kiosk/.xsession"
#!/bin/bash
exec /usr/local/bin/kiosk-autostart.sh
EOF
chmod +x "${CHROOT_DIR}/home/kiosk/.xsession"

# Configure Xwrapper to allow non-root user kiosk to start Xorg
cat << 'EOF' > "${CHROOT_DIR}/etc/X11/Xwrapper.config"
allowed_users=anybody
needs_root_rights=yes
EOF

# Configure Auto-Startx on login for kiosk user
cat << 'EOF' > "${CHROOT_DIR}/home/kiosk/.bash_profile"
if [[ -z $DISPLAY && $(tty) == "/dev/tty1" ]]; then
    exec startx /usr/local/bin/kiosk-autostart.sh -- -nocursor -s 0 -dpms
fi
EOF

cat << 'EOF' > "${CHROOT_DIR}/home/kiosk/.xinitrc"
exec /usr/local/bin/kiosk-autostart.sh
EOF

# Configure Openbox for kiosk user
mkdir -p "${CHROOT_DIR}/home/kiosk/.config/openbox"
cat << 'EOF' > "${CHROOT_DIR}/home/kiosk/.config/openbox/autostart"
/usr/local/bin/kiosk-autostart.sh &
EOF
chroot "${CHROOT_DIR}" chown -R kiosk:kiosk /home/kiosk

# 7. Extract Kernel & Initramfs, then Build SquashFS
echo "🗜️ [6/8] Extracting kernel and creating SquashFS filesystem..."
cp "$(ls -t "${CHROOT_DIR}/boot"/vmlinuz-* | head -n1)" "${IMAGE_DIR}/live/vmlinuz"
cp "$(ls -t "${CHROOT_DIR}/boot"/initrd.img-* | head -n1)" "${IMAGE_DIR}/live/initrd.img"

# Unmount before squashing
cleanup

mksquashfs "${CHROOT_DIR}" "${IMAGE_DIR}/live/filesystem.squashfs" -comp xz -e boot

# 8. Configure BIOS & UEFI Bootloaders
echo "⚙️ [7/8] Configuring ISOLINUX (BIOS) and GRUB (UEFI)..."

# BIOS (ISOLINUX)
cp /usr/lib/ISOLINUX/isolinux.bin "${IMAGE_DIR}/isolinux/" 2>/dev/null || cp /usr/lib/syslinux/isolinux.bin "${IMAGE_DIR}/isolinux/"
cp /usr/lib/syslinux/modules/bios/ldlinux.c32 "${IMAGE_DIR}/isolinux/" 2>/dev/null || true
cp /usr/lib/syslinux/modules/bios/libutil.c32 "${IMAGE_DIR}/isolinux/" 2>/dev/null || true
cp /usr/lib/syslinux/modules/bios/menu.c32 "${IMAGE_DIR}/isolinux/" 2>/dev/null || true
cp "${SCRIPT_DIR}/boot-configs/isolinux.cfg" "${IMAGE_DIR}/isolinux/isolinux.cfg"

# UEFI (GRUB)
cp "${SCRIPT_DIR}/boot-configs/grub.cfg" "${IMAGE_DIR}/boot/grub/grub.cfg"

# Create EFI Boot Image (FAT image containing EFI/BOOT/BOOTX64.EFI)
EFI_IMG="${IMAGE_DIR}/boot/grub/efi.img"
mkdir -p "${BUILD_DIR}/efi_temp/EFI/BOOT"
grub-mkstandalone \
  --format=x86_64-efi \
  --output="${BUILD_DIR}/efi_temp/EFI/BOOT/BOOTX64.EFI" \
  --locales="" \
  --fonts="" \
  "boot/grub/grub.cfg=${SCRIPT_DIR}/boot-configs/grub.cfg"

dd if=/dev/zero of="${EFI_IMG}" bs=1M count=20
mkfs.vfat "${EFI_IMG}"
mcopy -s -i "${EFI_IMG}" "${BUILD_DIR}/efi_temp/EFI" ::/

# 9. Build Hybrid Bootable ISO
echo "💿 [8/8] Generating Hybrid Bootable ISO with xorriso..."

ISOHDPFX="/usr/lib/ISOLINUX/isohdpfx.bin"
if [ ! -f "$ISOHDPFX" ]; then
  ISOHDPFX="/usr/lib/syslinux/isohdpfx.bin"
fi

xorriso -as mkisofs \
  -iso-level 3 \
  -r -J -l \
  -V "EASYXEROX_KIOSK" \
  -b isolinux/isolinux.bin \
  -c isolinux/boot.cat \
  -no-emul-boot -boot-load-size 4 -boot-info-table \
  -isohybrid-mbr "${ISOHDPFX}" \
  -eltorito-alt-boot \
  -e boot/grub/efi.img \
  -no-emul-boot \
  -isohybrid-gpt-basdat \
  -output "${OUTPUT_ISO}" \
  "${IMAGE_DIR}"

echo "======================================================================"
echo "🎉 SUCCESS: EasyXerox Kiosk Appliance ISO Generated!"
echo "📁 Output File: ${OUTPUT_ISO}"
echo "📊 File Size:   $(du -h "${OUTPUT_ISO}" | cut -f1)"
echo "✅ Compatible with: Legacy BIOS (MBR) and UEFI (x86_64)"
echo "======================================================================"
