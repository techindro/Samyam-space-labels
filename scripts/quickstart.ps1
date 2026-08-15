# SamyamLM 1-Line Installer & Quickstart Script (Windows PowerShell)

Write-Host ""
Write-Host " 🌍 =========================================================" -ForegroundColor Cyan
Write-Host "    SamyamLM — Multimodal Satellite & AI Platform Setup" -ForegroundColor Cyan
Write-Host " =========================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVer = node --version
    Write-Host "✔ Node.js detected: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH. Please install Node.js (v18+) from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check Git
try {
    $gitVer = git --version
    Write-Host "✔ Git detected: $gitVer" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit 1
}

$targetDir = "SamyamLM"

if (-not (Test-Path $targetDir)) {
    Write-Host "📥 Cloning SamyamLM repository..." -ForegroundColor Yellow
    git clone https://github.com/samyam-ai/SamyamLM.git $targetDir
    Set-Location $targetDir
} else {
    Set-Location $targetDir
    Write-Host "📁 Repository directory exists. Pulling latest updates..." -ForegroundColor Yellow
    git pull
}

if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "📄 Copying .env.example to .env..." -ForegroundColor Green
        Copy-Item .env.example .env
    }
}

Write-Host "📦 Installing dependencies (npm install)..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🚀 Launching SamyamLM locally..." -ForegroundColor Green
Write-Host "🌐 Server starting at http://localhost:8080" -ForegroundColor Cyan
Write-Host ""

npm run dev
