# DarkShift Landing Page

This directory contains the landing page for DarkShift, deployed via GitHub Pages.

## Files

- `index.html` - Main landing page
- `styles.css` - Styling for the landing page
- `script.js` - JavaScript functionality (FAQ accordion, smooth scrolling, animations)
- `privacy.html` - Privacy policy page
- `privacy.md` - Privacy policy in Markdown format

## Deployment

The landing page is automatically deployed to GitHub Pages from this `docs` folder.

**Live URL:** https://gmdahri.github.io/DarkShift---Dark-Mode-Extension/

## Local Development

To test the landing page locally:

1. Navigate to this directory:
```bash
cd docs
```

2. Start a local server:
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx serve

# Or using PHP
php -S localhost:8000
```

3. Open your browser to `http://localhost:8000`

## Features

- 📱 Fully responsive design
- 🎨 Modern glassmorphism UI with gradient accents
- ⚡ Fast and lightweight
- 🌙 Dark theme that matches the extension
- 📋 Interactive FAQ section
- 🔗 Direct links to GitHub repository

## Updates

When updating the landing page:

1. Edit files in the `/landing` directory first
2. Test changes locally
3. Copy updated files to `/docs`:
```bash
cp landing/*.{html,css,js} docs/
```
4. Commit and push changes
5. GitHub Pages will automatically update

