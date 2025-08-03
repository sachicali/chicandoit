@echo off
REM Chi Can Do It - Development Setup Script for Windows

echo 🚀 Setting up Chi Can Do It development environment...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if Rust is installed
rustc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Rust is not installed. Please install Rust first:
    echo    Visit: https://rustup.rs/
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Install Tauri CLI
echo 🔧 Installing Tauri CLI...
npm install --save-dev @tauri-apps/cli

REM Setup Tauri
echo ⚡ Setting up Tauri...
npx tauri init

echo ✅ Setup complete!
echo.
echo To start development:
echo   npm run tauri dev
echo.
echo To build for production:
echo   npm run tauri build

pause