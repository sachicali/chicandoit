#!/bin/bash

# Chi Can Do It - Development Setup Script

echo "🚀 Setting up Chi Can Do It development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is not installed. Please install Rust first:"
    echo "   Visit: https://rustup.rs/"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Tauri CLI
echo "🔧 Installing Tauri CLI..."
npm install --save-dev @tauri-apps/cli

# Setup Tauri
echo "⚡ Setting up Tauri..."
npx tauri init

echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  npm run tauri dev"
echo ""
echo "To build for production:"
echo "  npm run tauri build"