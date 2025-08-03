#!/bin/bash

echo "Git Push Strategy for Large Commit"
echo "=================================="

# Configure git for large pushes
echo "1. Configuring Git for large transfers..."
git config http.postBuffer 524288000  # 500MB
git config pack.windowMemory "100m"
git config pack.packSizeLimit "100m"
git config pack.threads "1"
git config http.lowSpeedLimit 0
git config http.lowSpeedTime 999999

# Show current status
echo -e "\n2. Current commit status:"
git log --oneline -3

echo -e "\n3. Attempting to push commits..."

# Try pushing with progress and verbose output
echo -e "\nPushing to origin/main with verbose output..."
GIT_TRACE_PACKET=1 GIT_TRACE=1 GIT_CURL_VERBOSE=1 git push --progress origin main 2>&1 | grep -E "(Writing objects|Total|Compressing|Delta)"

echo -e "\nIf the push fails, try these alternatives:"
echo "  a) Use GitHub Desktop (handles large pushes better)"
echo "  b) Push from a different network with better bandwidth"
echo "  c) Use SSH instead of HTTPS:"
echo "     git remote set-url origin git@github.com:sachicali/chicandoit.git"
echo "  d) Contact GitHub support about the large commit"

# Alternative: Create a fresh clone and apply changes
echo -e "\nAlternative approach (if all else fails):"
echo "  1. Clone a fresh copy: git clone https://github.com/sachicali/chicandoit.git chicandoit-fresh"
echo "  2. Copy your working files (excluding .git, node_modules, out, src-tauri/target)"
echo "  3. Commit and push from the fresh clone"