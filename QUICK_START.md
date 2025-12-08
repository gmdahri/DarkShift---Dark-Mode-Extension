# Quick Start - Testing the Extension

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Create Icons (Required)

Create three PNG files in `public/icons/`:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)  
- `icon128.png` (128x128 pixels)

**Quick option:** See [ICON_GENERATION.md](./ICON_GENERATION.md) for detailed prompts and tools.

**Fastest method (5 min):**
1. Visit https://favicon.io/favicon-generator/
2. Use text "🌙" or "DM"
3. Background: #1a1a1a, Text: #6bb6ff
4. Download and extract sizes

## Step 3: Build

```bash
npm run build
```

This creates the `dist/` folder with all extension files.

## Step 4: Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle top-right)
3. Click **Load unpacked**
4. Select the `dist` folder from this project

## Step 5: Test

1. **Click the extension icon** in Chrome toolbar
2. **Toggle dark mode** on any website
3. **Visit different sites** to test per-site preferences
4. **Try incompatible sites** like `chrome://extensions/` to see auto-disable

## Troubleshooting

**Extension won't load?**
- Check `dist/manifest.json` exists
- Verify icons are in `dist/icons/`
- Check for errors in `chrome://extensions/`

**Dark mode not working?**
- Open DevTools (F12) on the page
- Check Console for errors
- Verify content script is injected

**Popup not opening?**
- Right-click extension icon → "Inspect popup"
- Check console for React errors

For detailed testing, see [TESTING.md](./TESTING.md)

