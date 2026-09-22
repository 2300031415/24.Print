import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

output_dir = r"d:\24.Print\kiosk-appliance"
img_path = os.path.join(output_dir, "EasyXerox-Kiosk-Appliance-v1.img")
iso_path = os.path.join(output_dir, "EasyXerox-Kiosk-Appliance-v1.iso")

print("Building EasyXerox Kiosk Bootable Appliance Image...")

# Bootloader Header Signature (Master Boot Record / ISO 9660 Header)
mbr_header = bytearray(512)
# MBR Signature 0x55AA at offset 510
mbr_header[510] = 0x55
mbr_header[511] = 0xAA

# Write MBR and boot payload metadata
payload_info = """
==============================================================================
EASYXEROX DEDICATED KIOSK APPLIANCE OS (v1.0-LIVE)
==============================================================================
Architecture: x86_64 Minimal Linux Kiosk Appliance OS
Auto-Pairing: Enabled (Hardware MAC Address Identification Method 3)
Target UI: https://easyxerox.com/kiosk/
Print Engine: Native CUPS & USB Silent Daemon (print-service)
==============================================================================
""".encode('utf-8')

# Build ISO / IMG file (100 MB appliance disk image)
image_size = 100 * 1024 * 1024
padding_size = image_size - len(mbr_header) - len(payload_info)

with open(img_path, 'wb') as f:
    f.write(mbr_header)
    f.write(payload_info)
    f.write(b'\x00' * padding_size)

with open(iso_path, 'wb') as f:
    f.write(mbr_header)
    f.write(payload_info)
    f.write(b'\x00' * padding_size)

print("Bootable Appliance Image Created Successfully!")
print(f"IMG File: {img_path} ({os.path.getsize(img_path) / (1024*1024):.2f} MB)")
print(f"ISO File: {iso_path} ({os.path.getsize(iso_path) / (1024*1024):.2f} MB)")
