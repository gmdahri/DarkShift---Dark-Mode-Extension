#!/bin/bash

# Script to sync landing page files from /landing to /docs for GitHub Pages deployment

set -e

echo "🔄 Syncing landing page to docs folder..."

# Define source and destination
SOURCE_DIR="landing"
DEST_DIR="docs"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: $SOURCE_DIR directory not found!"
    exit 1
fi

# Check if destination directory exists
if [ ! -d "$DEST_DIR" ]; then
    echo "📁 Creating $DEST_DIR directory..."
    mkdir -p "$DEST_DIR"
fi

# Copy files
echo "📋 Copying HTML files..."
cp "$SOURCE_DIR"/*.html "$DEST_DIR/" 2>/dev/null || echo "⚠️  No HTML files found"

echo "🎨 Copying CSS files..."
cp "$SOURCE_DIR"/*.css "$DEST_DIR/" 2>/dev/null || echo "⚠️  No CSS files found"

echo "⚡ Copying JavaScript files..."
cp "$SOURCE_DIR"/*.js "$DEST_DIR/" 2>/dev/null || echo "⚠️  No JS files found"

# Create .nojekyll file if it doesn't exist
if [ ! -f "$DEST_DIR/.nojekyll" ]; then
    echo "📝 Creating .nojekyll file..."
    touch "$DEST_DIR/.nojekyll"
fi

echo "✅ Landing page synced successfully!"
echo ""
echo "📂 Files in $DEST_DIR:"
ls -lh "$DEST_DIR" | grep -v "^d" | awk '{print "   " $9, "(" $5 ")"}'
echo ""
echo "Next steps:"
echo "1. Review the changes: git status"
echo "2. Commit: git add docs/ && git commit -m 'Update landing page'"
echo "3. Push: git push origin main"
echo "4. Visit: https://gmdahri.github.io/DarkShift---Dark-Mode-Extension/"

