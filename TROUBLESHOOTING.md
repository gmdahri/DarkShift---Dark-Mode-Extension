# Troubleshooting Guide

## Common Errors and Solutions

### Error Button Appears in Extension Page

If you see an "Errors" button in `chrome://extensions/`, follow these steps:

#### 1. Check the Error Details
- Click the "Errors" button
- Read the error message in the popup
- Common errors are listed below

#### 2. Common Error Types

**"Could not load service worker"**
- **Solution**: Check that `dist/background.js` exists and is valid
- Rebuild: `npm run build`

**"Could not load content script"**
- **Solution**: Check that `dist/content.js` exists
- Verify it has no import statements (should be IIFE format)
- Rebuild: `npm run build`

**"Could not load manifest"**
- **Solution**: Check `dist/manifest.json` exists
- Verify JSON is valid
- Check all referenced files exist

**"Failed to load popup"**
- **Solution**: Check `dist/popup.html` exists
- Verify `dist/assets/popup.js` exists
- Check browser console for React errors

**"Missing icon"**
- **Solution**: Ensure `dist/icons/icon16.png`, `icon48.png`, `icon128.png` exist
- Check file paths in manifest.json

#### 3. Quick Fix Steps

1. **Rebuild the extension:**
   ```bash
   npm run build
   ```

2. **Verify all files exist:**
   ```bash
   ls -la dist/
   ls -la dist/icons/
   ls -la dist/assets/
   ```

3. **Check for syntax errors:**
   ```bash
   node -c dist/content.js
   node -c dist/background.js
   ```

4. **Reload the extension:**
   - Go to `chrome://extensions/`
   - Click the reload icon on your extension
   - Check if errors are gone

5. **Check console logs:**
   - Open DevTools (F12) on any webpage
   - Check Console tab for content script errors
   - Right-click extension icon → "Inspect popup" for popup errors
   - Click "service worker" link in extension page for background errors

#### 4. Reset Extension

If errors persist:
1. Remove the extension
2. Delete `dist/` folder
3. Rebuild: `npm run build`
4. Reload extension

#### 5. Check Browser Console

**Content Script Errors:**
- Open any webpage
- Press F12 → Console tab
- Look for errors from "content.js"

**Popup Errors:**
- Right-click extension icon
- Click "Inspect popup"
- Check Console tab

**Background Script Errors:**
- Go to `chrome://extensions/`
- Find your extension
- Click "service worker" link
- Check console for errors

## Still Having Issues?

1. **Check Node.js version:**
   ```bash
   node --version  # Should be 16+ 
   ```

2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Clear build cache:**
   ```bash
   rm -rf dist/
   npm run build
   ```

4. **Verify Chrome version:**
   - Extension requires Chrome 88+ (Manifest V3)
   - Check: `chrome://version/`

