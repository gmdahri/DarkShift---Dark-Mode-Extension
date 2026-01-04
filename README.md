# 🌙 Dark Mode Pro

> Dark mode for any website. Smart filters, custom themes, per-site settings, scheduled dark mode. Reduce eye strain instantly.

🌐 **[Visit Landing Page](https://gmdahri.github.io/DarkShift---Dark-Mode-Extension/)** | 📖 **[Documentation](https://github.com/gmdahri/DarkShift---Dark-Mode-Extension#readme)** | 🐛 **[Report Issues](https://github.com/gmdahri/DarkShift---Dark-Mode-Extension/issues)**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=google-chrome&logoColor=white)](https://chrome.google.com/webstore)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Landing Page](https://img.shields.io/badge/Landing-Page-22d3ee)](https://gmdahri.github.io/DarkShift---Dark-Mode-Extension/)

## ✨ Features

### Core Features
- 🌙 **Smart Dark Mode**: Instantly converts any webpage to dark mode with intelligent CSS filtering
- ✅ **Compatibility Detection**: Automatically detects and handles sites with native dark mode, iframes, and CSP restrictions
- 🎨 **Beautiful UI**: Modern glassmorphism design with smooth animations and gradient effects
- ⚙️ **Fine-tune Settings**: Adjust brightness, contrast, saturation, warmth (sepia), and grayscale to your preference
- 💾 **Per-Site Preferences**: Remembers your dark mode preference for each website individually
- 📋 **Site Lists**: Whitelist or blacklist specific domains for automatic control
- 🎭 **12 Preset Themes**: OLED Black, Nord, Solarized, Dracula, Monochrome, and more
- 🚫 **Auto-Disable**: Intelligently disables toggle for incompatible sites with clear messaging
- ⚡ **Fast & Lightweight**: Optimized for performance with minimal resource usage
- ⌨️ **Keyboard Shortcuts**: Quick toggle with `Cmd/Ctrl + Shift + D`
- 🔄 **SPA Support**: Works seamlessly with single-page applications and dynamic content

### New in v1.1.0
- ⏰ **Scheduled Dark Mode**: Auto-enable based on time of day with custom start/end times
- 🖥️ **Follow System Theme**: Automatically sync with your OS dark/light mode preference
- 🔵 **Icon Badge Status**: See at a glance if dark mode is active via the extension icon
- 🖱️ **Context Menu Toggle**: Right-click anywhere to toggle dark mode
- 🎨 **Saturation Control**: Adjust color vibrancy alongside other settings
- 🎯 **Floating Toggle Button**: Optional on-page button for quick access
- 🎓 **Onboarding Tutorial**: Guided walkthrough for first-time users
- ↩️ **Undo Action**: Toast notifications with undo option after toggling

## 📦 Installation

### From Source

1. **Clone the repository:**
```bash
git clone https://github.com/gmdahri/DarkShift---Dark-Mode-Extension.git
cd DarkShift---Dark-Mode-Extension
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the extension:**
```bash
npm run build
```

4. **Load the extension in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Development Mode

For development with hot-reload:
```bash
npm run dev
```

This will watch for changes and rebuild automatically.

## 🚀 How It Works

1. **Compatibility Check**: When you open the popup, it automatically checks if the current site can be turned dark
2. **Smart Detection**: Detects native dark mode, iframes, extension pages, and CSP restrictions
3. **CSS Filter Injection**: Uses CSS filters (brightness, contrast, sepia, grayscale) to transform the page
4. **Per-Site Storage**: Saves your preference and custom settings for each domain
5. **Auto-Disable**: Intelligently disables toggle and shows helpful messages for incompatible sites
6. **Dynamic Updates**: Monitors page changes and applies dark mode to dynamically loaded content

## 🔧 Compatibility

The extension automatically detects and handles:

- ✅ **Sites with native dark mode** - Disables toggle to avoid conflicts
- ✅ **Extension pages** - Handles `chrome-extension://` protocol pages
- ✅ **Iframes** - Detects and disables toggle for embedded content
- ✅ **CSP restrictions** - Identifies Content Security Policy limitations
- ✅ **Dynamic content** - Works with SPAs and dynamically loaded content
- ✅ **All websites** - Compatible with virtually any website

## ⌨️ Keyboard Shortcuts

- **Toggle Dark Mode**: `Cmd/Ctrl + Shift + D` - Toggle dark mode on current page
- **Toggle Global**: `Cmd/Ctrl + Shift + K` - Toggle global dark mode setting

## 🛠️ Technologies

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Chrome Extension Manifest V3** - Latest extension API
- **ESBuild** - Fast bundler for content scripts

## 📁 Project Structure

```
darkshift-extension/
├── src/
│   ├── popup/           # React popup UI components
│   │   ├── components/  # UI components (Settings, Toggle, etc.)
│   │   ├── hooks/       # Custom React hooks
│   │   └── main.tsx     # Popup entry point
│   ├── content/         # Content script for dark mode injection
│   │   ├── content.ts   # Main content script
│   │   ├── injector.ts  # CSS injection logic
│   │   └── compatibility.ts # Compatibility detection
│   ├── background/      # Background service worker
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── public/
│   └── icons/           # Extension icons
├── dist/                # Build output (generated)
├── scripts/             # Build scripts
└── manifest.json        # Extension manifest
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for better dark mode experiences across the web

---

**Made with ❤️ for a better browsing experience**

