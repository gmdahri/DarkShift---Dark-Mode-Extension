const STYLE_ID = 'dark-mode-extension-style';
const FILTER_ID = 'dark-mode-extension-filter';
const FAB_ID = 'dark-mode-extension-fab';

export interface DarkModeSettings {
  enabled: boolean;
  brightness: number; // 0-200, default 100
  contrast: number;   // 0-200, default 100
  sepia: number;      // 0-100, default 0
  grayscale: number;  // 0-100, default 0
  saturation: number; // 0-200, default 100
  excludeImages: boolean; // Exclude images from dark mode filter
  excludeVideos: boolean; // Exclude videos from dark mode filter
}

export const DEFAULT_SETTINGS: DarkModeSettings = {
  enabled: true,
  brightness: 100,
  contrast: 100,
  sepia: 0,
  grayscale: 0,
  saturation: 100,
  excludeImages: true,
  excludeVideos: true,
};

export function injectDarkMode(settings: DarkModeSettings = DEFAULT_SETTINGS): boolean {
  try {
    // Remove existing styles if present
    removeDarkMode();

    // Create and inject main dark mode style
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = getDarkModeCSS(settings);

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

// Floating Action Button (FAB) functionality
export function showFAB(onClick: () => void): void {
  // Remove existing FAB if present
  hideFAB();

  // Create FAB container with fixed positioning to ensure visibility
  const fab = document.createElement('div');
  fab.id = FAB_ID;

  // Apply critical styles directly to container - NOT using 'all: initial' as it resets width/height
  fab.style.cssText = `
    position: fixed !important;
    bottom: 24px !important;
    right: 24px !important;
    width: 56px !important;
    height: 56px !important;
    z-index: 2147483647 !important;
    pointer-events: auto !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    box-sizing: border-box !important;
  `;

  fab.innerHTML = `
    <button id="dark-mode-fab-button" style="
      position: absolute;
      top: 0;
      left: 0;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
      border: none;
      cursor: pointer;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      font-family: system-ui, -apple-system, sans-serif;
      pointer-events: auto;
      margin: 0;
      padding: 0;
    ">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
    <style>
      #${FAB_ID} {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        width: 56px !important;
        height: 56px !important;
        z-index: 2147483647 !important;
        pointer-events: auto !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      #dark-mode-fab-button {
        pointer-events: auto !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 56px !important;
        height: 56px !important;
      }
      #dark-mode-fab-button:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 6px 24px rgba(249, 115, 22, 0.5), 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      }
      #dark-mode-fab-button:active {
        transform: scale(0.95) !important;
      }
      @keyframes dark-mode-fab-pulse {
        0%, 100% { box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4); }
        50% { box-shadow: 0 4px 30px rgba(249, 115, 22, 0.6); }
      }
    </style>
  `;

  // Append to documentElement (html) instead of body to avoid being affected by 
  // the CSS filter on body, which creates a new containing block for fixed elements.
  // This ensures the FAB stays fixed to the viewport.
  document.documentElement.appendChild(fab);

  // Add click handler
  const button = document.getElementById('dark-mode-fab-button');
  if (button) {
    button.addEventListener('click', onClick);
  }

  // Update FAB icon based on current state
  updateFABIcon();
}

export function hideFAB(): void {
  const fab = document.getElementById(FAB_ID);
  if (fab) {
    fab.remove();
  }
}

export function updateFABIcon(): void {
  const button = document.getElementById('dark-mode-fab-button');
  if (!button) return;

  const isActive = isDarkModeActive();

  if (isActive) {
    // Sun icon when dark mode is active (clicking will turn it off)
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    button.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
  } else {
    // Moon icon when dark mode is off (clicking will turn it on)
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    button.style.background = 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)';
  }
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
  if (settings.saturation !== undefined && settings.saturation !== 100) {
    filters.push(`saturate(${Math.max(0, Math.min(200, settings.saturation))}%)`);
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

function getDarkModeCSS(settings?: DarkModeSettings): string {
  const excludeImages = settings?.excludeImages ?? true;
  const excludeVideos = settings?.excludeVideos ?? true;

  // Build media selector based on what should be excluded
  const mediaSelectors: string[] = [];
  if (excludeImages) {
    mediaSelectors.push('img', 'picture', 'svg image', '[style*="background-image"]', '[style*="background: url"]', '[style*="background:url"]');
  }
  if (excludeVideos) {
    mediaSelectors.push('video', '[class*="video"]', '[class*="player"]');
  }
  // Always include these for proper rendering
  mediaSelectors.push('canvas', 'iframe', 'embed', 'object');

  const mediaRevertCSS = mediaSelectors.length > 0 ? `
    /* Revert media elements so they look normal */
    ${mediaSelectors.join(',\n    ')} {
      filter: invert(1) hue-rotate(180deg) !important;
    }
  ` : '';

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
    
    ${mediaRevertCSS}
    
    /* Fix for nested inverts */
    img img,
    picture img {
      filter: none !important;
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
