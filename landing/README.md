# Dark Mode Extension - Landing Page

A modern, responsive landing page for the Dark Mode Chrome Extension.

## Features

- **Modern Design**: Glassmorphism UI with gradient accents
- **Fully Responsive**: Works on desktop, tablet, and mobile
- **Interactive Elements**: FAQ accordion, smooth scrolling
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Fast Loading**: Optimized CSS and minimal JavaScript

## File Structure

```
landing/
├── index.html      # Main HTML file
├── styles.css      # All styles
├── script.js       # Interactive features
└── README.md       # This file
```

## Usage

1. Open `index.html` in a browser
2. Or serve with a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --accent-cyan: #22d3ee;
    --accent-purple: #a855f7;
    /* ... */
}
```

### Content
Edit sections in `index.html`:
- Hero section
- Features
- How it works
- Installation steps
- FAQ

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

