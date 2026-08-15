@echo off
:: SamyamLM Windows PC Desktop App Installer & Desktop Shortcut Creator
title SamyamLM PC Desktop Installer
color 0A

echo ========================================================
echo   🌍 SamyamLM — PC Desktop App Setup & Installer
echo ========================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js is not installed!
    echo     Downloading Node.js installer for Windows...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi' -OutFile 'node_installer.msi'"
    echo     Installing Node.js...
    msiexec /i node_installer.msi /qb
    del node_installer.msi
)

echo [v] Node.js environment ready.

:: Create Desktop Shortcut Script
set TARGET_DIR=%CD%
set SHORTCUT_PATH=%USERPROFILE%\Desktop\SamyamLM.url

echo [InternetShortcut] > "%SHORTCUT_PATH%"
echo URL=http://localhost:8080 >> "%SHORTCUT_PATH%"
echo IconFile=%TARGET_DIR%\public\samyam-logo.jpg >> "%SHORTCUT_PATH%"
echo IconIndex=0 >> "%SHORTCUT_PATH%"

echo [v] Desktop Shortcut "SamyamLM" created on your Desktop!

echo [i] Installing dependencies...
call npm install

echo [^!] Launching SamyamLM Desktop App...
start http://localhost:8080
call npm run dev
