#!/bin/bash

# Script to prepare Chrome Web Store package

set -e

echo "🚀 Preparing DarkShift for Chrome Web Store Submission"
echo "========================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get version from manifest
VERSION=$(node -p "require('./manifest.json').version")
PACKAGE_NAME="darkshift-extension-v${VERSION}.zip"

echo "📦 Version: ${VERSION}"
echo ""

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
echo "   ✅ Cleaned dist/ folder"
echo ""

# Step 2: Build the extension
echo "🔨 Building extension..."
if npm run build; then
    echo -e "${GREEN}   ✅ Build successful${NC}"
else
    echo -e "${RED}   ❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 3: Verify build output
echo "🔍 Verifying build output..."
REQUIRED_FILES=("manifest.json" "popup.html" "content.js" "background.js")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "dist/$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo -e "${GREEN}   ✅ All required files present${NC}"
else
    echo -e "${RED}   ❌ Missing files: ${MISSING_FILES[*]}${NC}"
    exit 1
fi

# Check for icons
if [ -d "dist/icons" ]; then
    echo "   ✅ Icons directory found"
else
    echo -e "${YELLOW}   ⚠️  Icons directory missing${NC}"
fi
echo ""

# Step 4: Create ZIP package
echo "📦 Creating ZIP package..."
cd dist
zip -r "../${PACKAGE_NAME}" . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

if [ -f "${PACKAGE_NAME}" ]; then
    SIZE=$(ls -lh "${PACKAGE_NAME}" | awk '{print $5}')
    echo -e "${GREEN}   ✅ Package created: ${PACKAGE_NAME} (${SIZE})${NC}"
else
    echo -e "${RED}   ❌ Failed to create package${NC}"
    exit 1
fi
echo ""

# Step 5: List package contents
echo "📋 Package contents:"
unzip -l "${PACKAGE_NAME}" | head -20
echo ""

# Step 6: Create marketing folder if it doesn't exist
if [ ! -d "marketing" ]; then
    echo "📁 Creating marketing folder..."
    mkdir -p marketing/screenshots
    mkdir -p marketing/promotional
    echo "   ✅ Created marketing/screenshots/"
    echo "   ✅ Created marketing/promotional/"
    echo ""
fi

# Step 7: Summary
echo "========================================================"
echo -e "${GREEN}✅ Chrome Web Store package ready!${NC}"
echo "========================================================"
echo ""
echo "📦 Package: ${PACKAGE_NAME}"
echo "📏 Size: $(ls -lh "${PACKAGE_NAME}" | awk '{print $5}')"
echo "🔢 Version: ${VERSION}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Test the extension locally:"
echo "   • Open chrome://extensions/"
echo "   • Enable Developer mode"
echo "   • Load unpacked → select 'dist' folder"
echo "   • Test thoroughly on multiple websites"
echo ""
echo "2. Create marketing materials:"
echo "   • Screenshots (1280x800) → save to marketing/screenshots/"
echo "   • Take 3-5 screenshots showing key features"
echo "   • Optional: Create promo tiles (440x280, 1400x560)"
echo ""
echo "3. Submit to Chrome Web Store:"
echo "   • Visit: https://chrome.google.com/webstore/devconsole"
echo "   • Click 'New Item'"
echo "   • Upload: ${PACKAGE_NAME}"
echo "   • Fill out store listing (see CHROME_WEB_STORE_DEPLOYMENT.md)"
echo ""
echo "4. Important URLs to provide:"
echo "   • Website: https://gmdahri.github.io/DarkShift---Dark-Mode-Extension/"
echo "   • Support: https://github.com/gmdahri/DarkShift---Dark-Mode-Extension/issues"
echo "   • Privacy: https://gmdahri.github.io/DarkShift---Dark-Mode-Extension/privacy.html"
echo ""
echo "📖 Full guide: CHROME_WEB_STORE_DEPLOYMENT.md"
echo ""
echo -e "${GREEN}Good luck with your submission! 🎉${NC}"

