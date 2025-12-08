import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
const publicDir = join(process.cwd(), 'public');

// Ensure dist directory exists
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Move index.html from src/popup/ to root and rename to popup.html
const srcPopupHtml = join(distDir, 'src', 'popup', 'index.html');
const popupHtml = join(distDir, 'popup.html');
const indexHtml = join(distDir, 'index.html');

// Check if HTML is in src/popup/ directory (Vite output)
if (existsSync(srcPopupHtml) && !existsSync(popupHtml)) {
  let htmlContent = readFileSync(srcPopupHtml, 'utf-8');
  // Fix paths: replace ../../assets/ with ./assets/ (since we're moving to root)
  htmlContent = htmlContent.replace(/\.\.\/\.\.\/assets\//g, './assets/');
  // Also handle any other relative paths that might be wrong
  htmlContent = htmlContent.replace(/src="\/assets\//g, 'src="./assets/');
  htmlContent = htmlContent.replace(/href="\/assets\//g, 'href="./assets/');
  writeFileSync(popupHtml, htmlContent, 'utf-8');
  console.log('Moved popup HTML from src/popup/index.html to popup.html and fixed paths');
}
// Fallback: check root for index.html
else if (existsSync(indexHtml) && !existsSync(popupHtml)) {
  let htmlContent = readFileSync(indexHtml, 'utf-8');
  // Fix paths if needed
  htmlContent = htmlContent.replace(/src="\/assets\//g, 'src="./assets/');
  htmlContent = htmlContent.replace(/href="\/assets\//g, 'href="./assets/');
  writeFileSync(popupHtml, htmlContent, 'utf-8');
  console.log('Renamed index.html to popup.html and fixed paths');
}

// Clean up src folder in dist (not needed for production)
const srcInDist = join(distDir, 'src');
if (existsSync(srcInDist)) {
  rmSync(srcInDist, { recursive: true, force: true });
  console.log('Cleaned up src folder from dist');
}

// Copy manifest.json
copyFileSync(
  join(process.cwd(), 'manifest.json'),
  join(distDir, 'manifest.json')
);

// Copy only required icons (not all public/icons files)
const iconsDir = join(publicDir, 'icons');
const destIconsDir = join(distDir, 'icons');

if (existsSync(iconsDir)) {
  // Create icons directory if it doesn't exist
  if (!existsSync(destIconsDir)) {
    mkdirSync(destIconsDir, { recursive: true });
  }
  
  // Only copy the required icons for Chrome extension
  const requiredIcons = ['icon16.png', 'icon48.png', 'icon128.png'];
  requiredIcons.forEach(icon => {
    const src = join(iconsDir, icon);
    if (existsSync(src)) {
      copyFileSync(src, join(destIconsDir, icon));
    }
  });
  
  // Remove unnecessary files from icons folder
  const unnecessaryFiles = [
    'android-chrome-192x192.png',
    'android-chrome-512x512.png', 
    'apple-touch-icon.png',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon.ico',
    'README.md'
  ];
  
  unnecessaryFiles.forEach(file => {
    const filePath = join(destIconsDir, file);
    if (existsSync(filePath)) {
      rmSync(filePath);
    }
  });
}

console.log('Files copied successfully!');
console.log('');
console.log('Build complete! To create a ZIP for publishing:');
console.log('  cd dist && zip -r ../darkshift-dark-mode.zip . && cd ..');
