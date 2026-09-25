#!/usr/bin/env bash
# ==============================================================================
# Helper Script to Build EasyXerox Kiosk ISO using Docker
# Run from macOS, Linux, or Windows (WSL / Git Bash)
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "🐳 Building EasyXerox Kiosk Appliance ISO inside Docker..."

# Check if docker is available and running
if ! command -v docker >/dev/null 2>&1; then
  echo "❌ Error: Docker is not installed or not in PATH."
  echo "Please install Docker Desktop or run natively on an Ubuntu/Debian machine."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "❌ Error: Docker daemon is not running."
  echo "Please start Docker Desktop and run this script again."
  exit 1
fi

IMAGE_TAG="easyxerox-iso-builder:latest"

echo "🔨 Building builder Docker image..."
docker build --platform linux/amd64 -t "${IMAGE_TAG}" -f "${SCRIPT_DIR}/Dockerfile.iso-builder" "${SCRIPT_DIR}"

echo "🚀 Running ISO build inside container..."
docker run --platform linux/amd64 --rm --privileged \
  -v "${PROJECT_ROOT}:/workspace" \
  "${IMAGE_TAG}"

echo "✅ Docker ISO build completed!"
echo "📁 Resulting ISO: ${SCRIPT_DIR}/EasyXerox-Kiosk-Appliance-v1.iso"
