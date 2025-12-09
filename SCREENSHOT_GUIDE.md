# DarkShift Screenshot & Marketing Assets Guide

## Required Screenshots for Chrome Web Store

### Specifications
- **Format:** PNG or JPEG
- **Dimensions:** 1280x800 or 640x400 pixels (recommended: 1280x800)
- **Count:** Minimum 1, Maximum 5, Recommended 3-5
- **File size:** Less than 1MB each

---

## Screenshot Ideas

### 1. Main Interface - Active State ⭐ PRIORITY
**What to show:**
- DarkShift popup open on a popular website (e.g., LinkedIn, Twitter)
- Dark mode clearly active
- Toggle switch in ON position
- "Dark Mode Active" status visible
- Clean, professional appearance

**How to capture:**
1. Visit a bright, recognizable website (LinkedIn works great)
2. Activate DarkShift
3. Open the extension popup
4. Use Chrome's built-in screenshot tool or Snagit
5. Crop to 1280x800

**Annotations to add:**
- Small arrow pointing to toggle: "One-click activation"
- Highlight the status indicator
- Optional: "Works on any website" badge

### 2. Fine-tune Settings Panel ⭐ PRIORITY
**What to show:**
- Settings panel expanded
- All sliders visible (Brightness, Contrast, Warmth, Grayscale)
- Real-time preview in background
- Modern UI with glassmorphism effect

**How to capture:**
1. Activate dark mode
2. Click "Fine-tune Settings"
3. Adjust sliders to interesting values (not all default)
4. Capture the popup with settings open

**Annotations to add:**
- "Customize every detail"
- Highlight specific sliders
- "Real-time adjustments"

### 3. Before & After Comparison
**What to show:**
- Split screen or side-by-side comparison
- Left: Website in normal bright mode
- Right: Same website with DarkShift active
- Same website, same scroll position

**Popular websites to demonstrate:**
- LinkedIn
- Twitter/X
- GitHub (already has dark mode, so maybe skip)
- Wikipedia
- News websites (CNN, BBC)
- Google search results

**How to create:**
1. Take screenshot without dark mode (1280x800)
2. Activate dark mode
3. Take screenshot at same scroll position
4. Use image editor to create side-by-side
5. Add divider line in the middle
6. Label "Before" and "After"

### 4. Presets Management
**What to show:**
- Presets overlay open
- Several custom presets created
- Nice names like "Midnight", "Warm Evening", "Pure Black"
- Settings preview for each preset

**How to capture:**
1. Create 3-4 custom presets beforehand
2. Click "Presets" button
3. Show the preset list with variety
4. Capture the full overlay

**Annotations to add:**
- "Save your favorite themes"
- "One-click preset switching"

### 5. Site Lists Management
**What to show:**
- Site Lists overlay open
- Whitelist and Blacklist tabs
- Some domains added to each
- Clean interface

**How to capture:**
1. Add 3-4 example domains to whitelist (linkedin.com, twitter.com)
2. Add 2-3 to blacklist
3. Open Site Lists
4. Capture the overlay

**Annotations to add:**
- "Automatic control for specific sites"
- "Whitelist & Blacklist support"

---

## Promotional Images

### Small Tile (440x280)

**Design:**
```
┌─────────────────────────────┐
│                             │
│     [DarkShift Logo]        │
│                             │
│      DarkShift              │
│   Dark Mode for Any Site    │
│                             │
└─────────────────────────────┘
```

**Elements:**
- Dark gradient background (from your UI colors)
- Extension icon (moon icon) centered
- Extension name in gradient text
- Short tagline
- Subtle glow effects

**Tools:** Canva, Figma, or Photoshop

### Large Tile (920x680)

**Design:**
```
┌────────────────────────────────────────┐
│                                        │
│  🌙 DarkShift                          │
│                                        │
│  ✨ Transform Any Website              │
│  🎨 Beautiful Customization            │
│  💾 Per-Site Preferences               │
│  ⚡ Fast & Lightweight                 │
│                                        │
│  [Popup Preview Image]                 │
│                                        │
└────────────────────────────────────────┘
```

**Elements:**
- Extension name at top
- 3-4 key features with emojis
- Screenshot or mockup of the popup
- Gradient background
- Professional typography

### Marquee (1400x560)

**Design:**
```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  Transform Any Website Into Beautiful Dark Mode          │
│  [Laptop mockup showing website transformation]          │
│                                                           │
│  ⚙️ Customizable  💾 Smart  ⚡ Fast  🎨 Beautiful        │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Elements:**
- Hero headline
- Visual showing before/after or laptop mockup
- 4 quick features with icons
- Call-to-action if space permits
- Brand colors and gradients

---

## Tools for Creating Assets

### Free Tools
1. **Figma** - Best for design mockups (free tier available)
2. **Canva** - Easy promotional images (free tier available)
3. **GIMP** - Free alternative to Photoshop
4. **Inkscape** - Vector graphics (free)
5. **Shottr** (Mac) - Advanced screenshot tool (free)
6. **ShareX** (Windows) - Screenshot and annotation (free)

### Paid Tools (Optional)
1. **Adobe Photoshop** - Professional editing
2. **Sketch** - UI design (Mac only)
3. **Snagit** - Screen capture and annotation
4. **Figma Pro** - Advanced features

### Chrome Extensions for Screenshots
1. **Awesome Screenshot** - Full page screenshots
2. **GoFullPage** - Full page capture
3. **Nimbus Screenshot** - Advanced capture tools

---

## Creating Process

### Step 1: Setup
```bash
# Build your extension first
npm run build

# Load it in Chrome
# chrome://extensions -> Load unpacked -> select 'dist' folder
```

### Step 2: Find Good Demo Sites
Best websites to demonstrate on:
- ✅ LinkedIn (lots of white space)
- ✅ Twitter/X (recognizable)
- ✅ Wikipedia (text-heavy)
- ✅ Stack Overflow (developer audience)
- ✅ Reddit (popular)
- ✅ Medium (reading experience)

### Step 3: Capture Screenshots
1. Set browser window to exactly 1280x800 pixels
2. Visit target website
3. Scroll to interesting content (not top of page)
4. Open DarkShift popup
5. Capture with tool of choice
6. Save as PNG

### Step 4: Annotate (Optional)
Use tools like:
- Figma (add arrows, highlights, text)
- Snagit (annotations built-in)
- Photoshop (professional editing)

**Annotation tips:**
- Keep text minimal
- Use contrasting colors for visibility
- Arrow/boxes should be subtle
- Don't cover important parts
- Use your brand colors

### Step 5: Optimize
```bash
# Compress PNG files
# Use: tinypng.com or imageoptim.com

# Ensure file size < 1MB
# Format: PNG (recommended) or JPEG
```

---

## Screenshot Checklist

Before uploading to Chrome Web Store:

- [ ] All images are 1280x800 px
- [ ] File format is PNG or JPEG
- [ ] Each file is under 1MB
- [ ] Images show real functionality
- [ ] No placeholder or lorem ipsum text
- [ ] Extension UI is clearly visible
- [ ] Screenshots are high quality (not blurry)
- [ ] Annotations are professional and minimal
- [ ] Images tell a story (1→2→3→4→5 sequence)
- [ ] Branding is consistent across all images
- [ ] No competitor names or logos visible
- [ ] Images show actual benefits to users

---

## Example Screenshot Sequence

### Recommended 5-Screenshot Story:

1. **Hero Shot** - Main popup active on LinkedIn
   - *"One-click dark mode for any website"*

2. **Settings** - Fine-tune controls open
   - *"Customize brightness, contrast, and warmth"*

3. **Before/After** - Split view of transformation
   - *"Transform bright sites instantly"*

4. **Presets** - Preset management interface
   - *"Save and switch between custom themes"*

5. **Site Lists** - Whitelist/blacklist management
   - *"Automatic control for your favorite sites"*

---

## Video Demo (Optional but Powerful)

### 30-Second Demo Script:

```
[0-5s]   - Show bright website, squinting emoji
           Text: "Tired of bright websites?"

[5-10s]  - Click extension icon, toggle dark mode
           Website transforms smoothly

[10-15s] - Show settings adjustments in real-time
           Text: "Fine-tune to your preference"

[15-20s] - Quick showcase: Presets, Site Lists
           Text: "Save presets & manage sites"

[20-25s] - Show on multiple popular websites
           Text: "Works everywhere"

[25-30s] - Extension icon with install CTA
           Text: "Install DarkShift today"
```

### Tools for Video:
- **OBS Studio** (free) - Screen recording
- **DaVinci Resolve** (free) - Video editing
- **iMovie** (Mac, free) - Simple editing
- **Loom** (free tier) - Quick recordings

---

## Quick Start: Minimum Viable Assets

If you're short on time, create these FIRST:

1. **One great screenshot** - Main popup on LinkedIn with dark mode active
2. **Small tile promotional image** - Simple logo + name + tagline
3. **Privacy policy** - Already created ✓

These 3 assets are enough to launch. You can add more later.

---

## Pro Tips

1. **Use real content** - Don't use fake or staged content
2. **Show recognizable sites** - LinkedIn, Twitter help users understand quickly
3. **Consistent branding** - Use your extension's color scheme
4. **Mobile-friendly** - Screenshots should look good at small sizes too
5. **Tell a story** - Order screenshots logically (intro → features → benefits)
6. **Update regularly** - Refresh screenshots when you add major features
7. **A/B test** - Try different screenshots and see which converts better
8. **Localize** - Create screenshots in different languages if targeting international markets

---

## Next Steps

1. ✅ Build extension (`npm run build`)
2. ✅ Create 1-5 screenshots following this guide
3. ✅ Design promotional images in Canva/Figma
4. ✅ (Optional) Record demo video
5. ✅ Optimize all images
6. ✅ Ready for Chrome Web Store submission!

---

Need help? Check out successful extensions for inspiration:
- Dark Reader (very popular dark mode extension)
- Grammarly (great promotional materials)
- Honey (excellent screenshot storytelling)

Good luck! 🚀

