#!/bin/bash

# DarkShift - Deployment Preparation Script
# This script prepares your extension for Chrome Web Store submission

set -e  # Exit on error

echo "🌙 DarkShift - Preparing for Deployment"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Step 1: Clean old builds
echo "📦 Step 1/5: Cleaning old builds..."
if [ -d "dist" ]; then
    rm -rf dist
    echo -e "${GREEN}✓ Cleaned dist folder${NC}"
fi
if [ -f "darkshift-v1.0.0.zip" ]; then
    rm -f darkshift-v*.zip
    echo -e "${GREEN}✓ Removed old ZIP files${NC}"
fi

# Step 2: Install dependencies
echo ""
echo "📥 Step 2/5: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Step 3: Build extension
echo ""
echo "🔨 Step 3/5: Building extension..."
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed. dist folder not created.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed successfully${NC}"

# Step 4: Verify build contents
echo ""
echo "🔍 Step 4/5: Verifying build contents..."

REQUIRED_FILES=("manifest.json" "popup.html" "content.js" "background.js" "icons/icon16.png" "icons/icon48.png" "icons/icon128.png")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "dist/$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ All required files present${NC}"
else
    echo -e "${RED}Error: Missing required files:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

# Check for source files (should not be in dist)
if find dist -name "*.ts" -o -name "*.tsx" | grep -q .; then
    echo -e "${YELLOW}Warning: TypeScript source files found in dist folder${NC}"
fi

if [ -d "dist/node_modules" ]; then
    echo -e "${YELLOW}Warning: node_modules found in dist folder${NC}"
fi

# Step 5: Create ZIP file
echo ""
echo "📦 Step 5/5: Creating ZIP file..."

cd dist
VERSION=$(node -p "require('../package.json').version")
ZIP_NAME="darkshift-v${VERSION}.zip"

zip -r "../$ZIP_NAME" . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

if [ -f "$ZIP_NAME" ]; then
    ZIP_SIZE=$(du -h "$ZIP_NAME" | cut -f1)
    echo -e "${GREEN}✓ ZIP file created: $ZIP_NAME ($ZIP_SIZE)${NC}"
else
    echo -e "${RED}Error: Failed to create ZIP file${NC}"
    exit 1
fi

# Display file count
FILE_COUNT=$(unzip -l "$ZIP_NAME" | tail -1 | awk '{print $2}')
echo -e "${GREEN}✓ Total files in ZIP: $FILE_COUNT${NC}"

# Final summary
echo ""
echo "========================================"
echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Test the extension in Chrome:"
echo "   • Go to chrome://extensions/"
echo "   • Enable Developer mode"
echo "   • Click 'Load unpacked' and select the 'dist' folder"
echo ""
echo "2. Upload to Chrome Web Store:"
echo "   • Go to https://chrome.google.com/webstore/devconsole"
echo "   • Click 'New Item'"
echo "   • Upload: $ZIP_NAME"
echo ""
echo "3. Review the deployment guides:"
echo "   • DEPLOYMENT_GUIDE.md"
echo "   • DEPLOYMENT_CHECKLIST.md"
echo "   • SCREENSHOT_GUIDE.md"
echo ""
echo "🚀 Good luck with your launch!"
echo "========================================"

