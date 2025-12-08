# Testing Guide

## Prerequisites

1. **Install dependencies:**
```bash
npm install
```

2. **Create icon files** (or use placeholders):
   - Create `public/icons/icon16.png` (16x16 pixels)
   - Create `public/icons/icon48.png` (48x48 pixels)
   - Create `public/icons/icon128.png` (128x128 pixels)
   
   You can use any image editor or online icon generator. For quick testing, you can create simple colored squares.

## Build the Extension

```bash
npm run build
```

This will:
- Compile TypeScript
- Build React components
- Bundle all scripts
- Copy manifest and icons to `dist/` folder

## Load Extension in Chrome

1. **Open Chrome Extensions page:**
   - Navigate to `chrome://extensions/`
   - Or: Menu (⋮) → Extensions → Manage Extensions

2. **Enable Developer Mode:**
   - Toggle "Developer mode" switch in the top-right corner

3. **Load the extension:**
   - Click "Load unpacked"
   - Select the `dist` folder from this project
   - The extension should appear in your extensions list

4. **Verify installation:**
   - You should see "Dark Mode Extension" in the list
   - Check that there are no errors (red text)

## Testing Checklist

### 1. Basic Functionality

- [ ] **Open popup:**
  - Click the extension icon in Chrome toolbar
  - Popup should open with glassmorphism UI
  - Should show current website domain

- [ ] **Compatibility check:**
  - Popup should show "Checking..." initially
  - Should display compatibility status (Compatible/Incompatible/Partial)
  - Status indicator should show appropriate color

### 2. Dark Mode Toggle

- [ ] **Enable dark mode:**
  - Toggle the switch ON
  - Page should turn dark immediately
  - Toggle should show as enabled

- [ ] **Disable dark mode:**
  - Toggle the switch OFF
  - Page should return to normal
  - Toggle should show as disabled

### 3. Compatibility Detection

Test on different types of sites:

- [ ] **Regular website** (e.g., google.com):
  - Should be compatible
  - Toggle should be enabled
  - Dark mode should work

- [ ] **Extension page** (chrome://extensions/):
  - Should detect as incompatible
  - Toggle should be disabled
  - Should show message: "Extension pages cannot be modified"

- [ ] **Site with native dark mode:**
  - Should detect native dark mode
  - Toggle should be disabled
  - Should show appropriate message

- [ ] **Iframe content:**
  - Should detect iframe
  - Toggle should be disabled
  - Should show message: "Cannot apply dark mode to iframes"

### 4. Per-Site Preferences

- [ ] **Enable on Site A:**
  - Enable dark mode on google.com
  - Navigate to another site (e.g., github.com)
  - Dark mode should be off (new site)

- [ ] **Return to Site A:**
  - Navigate back to google.com
  - Dark mode should still be enabled (remembered)

### 5. SPA Navigation

- [ ] **Single Page App:**
  - Test on a SPA (e.g., React app, Vue app)
  - Enable dark mode
  - Navigate to different routes
  - Dark mode should persist across navigation

### 6. UI/UX Testing

- [ ] **Popup appearance:**
  - Glassmorphism effect visible (blur, transparency)
  - Gradient background visible
  - All text readable
  - Icons display correctly

- [ ] **Toggle switch:**
  - Smooth transition when toggling
  - Disabled state shows lock icon
  - Visual feedback on click

- [ ] **Status indicators:**
  - Green for compatible
  - Yellow for partial
  - Red for incompatible
  - Gray for checking

- [ ] **Error messages:**
  - Incompatible sites show clear message
  - Message in glassmorphism card
  - Easy to understand

### 7. Edge Cases

- [ ] **Page still loading:**
  - Open popup while page is loading
  - Should show "Checking..." or appropriate state

- [ ] **Multiple tabs:**
  - Enable dark mode on Tab 1
  - Switch to Tab 2
  - Tab 2 should have its own state
  - Return to Tab 1, dark mode should still be on

- [ ] **Refresh page:**
  - Enable dark mode
  - Refresh the page (F5)
  - Dark mode should persist after refresh

## Debugging

### Check Console Logs

1. **Popup console:**
   - Right-click extension icon → "Inspect popup"
   - Check for any errors in console

2. **Content script console:**
   - Open DevTools on any webpage (F12)
   - Check Console tab for content script logs

3. **Background script:**
   - Go to `chrome://extensions/`
   - Find your extension
   - Click "service worker" link
   - Check console for background script logs

### Common Issues

**Extension not loading:**
- Check `dist/manifest.json` exists
- Verify all required files are in `dist/`
- Check for errors in `chrome://extensions/`

**Dark mode not applying:**
- Check content script is injected (DevTools → Sources → Content scripts)
- Verify no CSP errors in console
- Check if site is in incompatible list

**Toggle not working:**
- Check popup console for errors
- Verify messaging between popup and content script
- Check storage permissions in manifest

**Build errors:**
- Run `npm install` again
- Clear `dist/` folder and rebuild
- Check TypeScript errors: `npx tsc --noEmit`

## Quick Test Script

```bash
# 1. Build
npm run build

# 2. Check dist folder
ls -la dist/

# 3. Verify files exist
test -f dist/popup.html && echo "✓ popup.html exists"
test -f dist/manifest.json && echo "✓ manifest.json exists"
test -f dist/content.js && echo "✓ content.js exists"
test -f dist/background.js && echo "✓ background.js exists"
```

## Manual Testing Scenarios

### Scenario 1: First-time User
1. Install extension
2. Visit google.com
3. Open popup
4. See compatibility check
5. Toggle dark mode ON
6. Page turns dark ✓

### Scenario 2: Incompatible Site
1. Visit chrome://extensions/
2. Open popup
3. See "Extension pages cannot be modified"
4. Toggle is disabled ✓

### Scenario 3: Site with Native Dark Mode
1. Visit a site with dark mode toggle
2. Open popup
3. See "This site already has native dark mode"
4. Toggle is disabled ✓

### Scenario 4: Multiple Sites
1. Enable dark mode on Site A
2. Visit Site B (dark mode off)
3. Return to Site A (dark mode still on) ✓

## Performance Testing

- [ ] **Large pages:**
  - Test on pages with many elements
  - Dark mode should apply without lag
  - No performance degradation

- [ ] **Memory usage:**
  - Check memory in Chrome Task Manager
  - Extension should use minimal memory

- [ ] **Load time:**
  - Popup should open quickly
  - Compatibility check should complete in < 1 second

## Browser Compatibility

Tested on:
- [ ] Chrome (latest)
- [ ] Edge (Chromium-based)
- [ ] Other Chromium browsers

