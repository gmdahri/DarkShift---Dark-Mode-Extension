const STYLE_ID = 'dark-mode-extension-style';
const FILTER_ID = 'dark-mode-extension-filter';

export interface DarkModeSettings {
  enabled: boolean;
  brightness: number; // 0-200, default 100
  contrast: number;   // 0-200, default 100
  sepia: number;      // 0-100, default 0
  grayscale: number;  // 0-100, default 0
}

export const DEFAULT_SETTINGS: DarkModeSettings = {
  enabled: true,
  brightness: 100,
  contrast: 100,
  sepia: 0,
  grayscale: 0,
};

export function injectDarkMode(settings: DarkModeSettings = DEFAULT_SETTINGS): boolean {
  try {
    // Remove existing styles if present
    removeDarkMode();
    
    // Create and inject main dark mode style
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = getDarkModeCSS();
    
    // Create filter style for brightness/contrast
    const filterStyle = document.createElement('style');
    filterStyle.id = FILTER_ID;
    filterStyle.textContent = getFilterCSS(settings);
    
    // Insert at the beginning of head for higher priority
    if (document.head.firstChild) {
      document.head.insertBefore(filterStyle, document.head.firstChild);
      document.head.insertBefore(style, document.head.firstChild);
    } else {
      document.head.appendChild(style);
      document.head.appendChild(filterStyle);
    }
    
    console.log('Dark mode injected successfully');
    return true;
  } catch (error) {
    console.error('Failed to inject dark mode:', error);
    return false;
  }
}

export function updateFilters(settings: DarkModeSettings): void {
  let filterStyle = document.getElementById(FILTER_ID) as HTMLStyleElement;
  
  if (!filterStyle) {
    filterStyle = document.createElement('style');
    filterStyle.id = FILTER_ID;
    document.head.appendChild(filterStyle);
  }
  
  filterStyle.textContent = getFilterCSS(settings);
}

export function removeDarkMode(): void {
  const existingStyle = document.getElementById(STYLE_ID);
  const existingFilter = document.getElementById(FILTER_ID);
  if (existingStyle) existingStyle.remove();
  if (existingFilter) existingFilter.remove();
}

export function isDarkModeActive(): boolean {
  return document.getElementById(STYLE_ID) !== null;
}

function getFilterCSS(settings: DarkModeSettings): string {
  const filters = [];
  
  if (settings.brightness !== 100 && settings.brightness > 0) {
    filters.push(`brightness(${Math.max(10, Math.min(200, settings.brightness))}%)`);
  }
  if (settings.contrast !== 100 && settings.contrast > 0) {
    filters.push(`contrast(${Math.max(10, Math.min(200, settings.contrast))}%)`);
  }
  if (settings.sepia > 0) {
    filters.push(`sepia(${Math.max(0, Math.min(100, settings.sepia))}%)`);
  }
  if (settings.grayscale > 0) {
    filters.push(`grayscale(${Math.max(0, Math.min(100, settings.grayscale))}%)`);
  }
  
  if (filters.length === 0) {
    return '';
  }
  
  // Calculate inverse filters for media (to counteract page-level filters)
  const mediaFilters = [];
  if (settings.brightness !== 100 && settings.brightness > 0) {
    const inverseBrightness = Math.max(10, Math.min(200, Math.round(10000 / settings.brightness)));
    mediaFilters.push(`brightness(${inverseBrightness}%)`);
  }
  if (settings.contrast !== 100 && settings.contrast > 0) {
    const inverseContrast = Math.max(10, Math.min(200, Math.round(10000 / settings.contrast)));
    mediaFilters.push(`contrast(${inverseContrast}%)`);
  }
  
  return `
    html {
      filter: ${filters.join(' ')} !important;
    }
    
    /* Exclude media from filters to preserve quality */
    img, video, iframe, canvas, svg {
      filter: ${mediaFilters.length > 0 ? mediaFilters.join(' ') : 'none'} !important;
    }
  `;
}

function getDarkModeCSS(): string {
  return `
    /* Base dark mode using CSS filter inversion */
    html {
      background-color: #121212 !important;
    }
    
    /* Apply invert filter to the whole page */
    html > body {
      filter: invert(1) hue-rotate(180deg) !important;
      background-color: #fff !important;
    }
    
    /* Revert media elements so they look normal */
    img,
    video,
    picture,
    canvas,
    iframe,
    embed,
    object,
    svg image,
    [style*="background-image"],
    [style*="background: url"],
    [style*="background:url"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Fix for nested inverts */
    img img,
    picture img {
      filter: none !important;
    }
    
    /* Preserve specific elements */
    video,
    [class*="video"],
    [class*="player"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* Fix inputs and form elements */
    input,
    textarea,
    select,
    button {
      background-color: #f0f0f0 !important;
      color: #1a1a1a !important;
      border-color: #ccc !important;
    }
    
    /* Fix placeholder text */
    input::placeholder,
    textarea::placeholder {
      color: #666 !important;
    }
    
    /* Scrollbar styling */
    ::-webkit-scrollbar {
      background-color: #2a2a2a !important;
      width: 12px;
    }
    
    ::-webkit-scrollbar-track {
      background-color: #1a1a1a !important;
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: #555 !important;
      border-radius: 6px;
      border: 2px solid #1a1a1a !important;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background-color: #777 !important;
    }
    
    /* Selection styling */
    ::selection {
      background-color: #4a90d9 !important;
      color: #fff !important;
    }
  `;
}
