#!/usr/bin/env bash

# SamyamLM 1-Line Installer & Quickstart Script (Linux / macOS / Git Bash)
set -e

echo ""
echo " 🌍 ========================================================="
echo "    SamyamLM — Multimodal Satellite & AI Platform Setup"
echo " ========================================================="
echo ""

# Check Git
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18+) first."
    exit 1
fi

TARGET_DIR="SamyamLM"

if [ ! -d "$TARGET_DIR" ]; then
    echo "📥 Cloning SamyamLM repository..."
    git clone https://github.com/samyam-ai/SamyamLM.git "$TARGET_DIR"
    cd "$TARGET_DIR"
else
    cd "$TARGET_DIR"
    echo "📁 Directory existing. Fetching latest updates..."
    git pull || true
fi

if [ ! -f ".env" ]; then
    echo "📄 Creating .env configuration from template..."
    cp .env.example .env 2>/dev/null || true
fi

echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "🚀 Launching SamyamLM locally..."
echo "🌐 Open browser at http://localhost:8080"
echo ""

npm run dev
