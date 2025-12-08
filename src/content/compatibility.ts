import { CompatibilityResult } from '../types/compatibility';
import { INCOMPATIBLE_PROTOCOLS } from '../utils/constants';

export async function checkCompatibility(): Promise<CompatibilityResult> {
  const url = window.location.href;
  
  // Check for incompatible protocols
  if (INCOMPATIBLE_PROTOCOLS.some(p => url.startsWith(p))) {
    return {
      compatible: false,
      disableToggle: true,
      message: 'Extension pages cannot be modified',
      reason: 'incompatible_protocol',
      confidence: 'high',
    };
  }
  
  // Check if page is in an iframe
  if (window.self !== window.top) {
    return {
      compatible: false,
      disableToggle: true,
      message: 'Cannot apply dark mode to iframes',
      reason: 'iframe_detected',
      confidence: 'high',
    };
  }
  
  // Check for native dark mode
  const hasNativeDarkMode = checkNativeDarkMode();
  if (hasNativeDarkMode) {
    return {
      compatible: false,
      disableToggle: true,
      message: 'This site already has native dark mode',
      reason: 'native_dark_mode',
      confidence: 'high',
    };
  }
  
  // Check for CSP that might block injection (but don't block if test passes)
  // Most sites allow style injection, so we'll be lenient here
  const cspCheck = checkCSP();
  if (!cspCheck.canInject) {
    // Only warn, don't disable - let the injection test be the final check
    return {
      compatible: true,
      disableToggle: false,
      message: 'Dark mode available (may have limitations)',
      reason: 'csp_warning',
      confidence: 'medium',
      warnings: ['Site may have content security restrictions'],
    };
  }
  
  // Check page load state
  if (document.readyState !== 'complete') {
    return {
      compatible: true,
      disableToggle: false,
      message: 'Page is still loading',
      reason: 'page_loading',
      confidence: 'medium',
      warnings: ['Page may not be fully loaded'],
    };
  }
  
  // Test CSS injection capability
  const injectionTest = testCSSInjection();
  if (!injectionTest.success) {
    return {
      compatible: false,
      disableToggle: true,
      message: 'Cannot inject styles on this page',
      reason: 'injection_failed',
      confidence: 'high',
    };
  }
  
  return {
    compatible: true,
    disableToggle: false,
    message: 'Dark mode available',
    confidence: 'high',
  };
}

function checkNativeDarkMode(): boolean {
  // Don't check system preference - that's the user's setting, not the site's feature
  // Only check if the website itself has implemented dark mode
  
  // Check for common dark mode classes/attributes on html/body
  const darkModeIndicators = [
    'html.dark',
    'html.dark-mode',
    'html.theme-dark',
    'body.dark',
    'body.dark-mode',
    'body.theme-dark',
    '[data-theme="dark"]',
    '[data-mode="dark"]',
  ];
  
  const hasDarkClass = darkModeIndicators.some(selector => {
    try {
      return document.querySelector(selector) !== null;
    } catch {
      return false;
    }
  });
  
  // Check meta tag for color-scheme (but only if it explicitly includes dark)
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
  const metaContent = colorSchemeMeta?.getAttribute('content');
  // Only consider it native dark mode if it's explicitly set to "dark" (not just includes it)
  const hasDarkMeta = metaContent === 'dark' || metaContent === 'dark light';
  
  // Check if html element has dark class
  const htmlHasDark = document.documentElement.classList.contains('dark') ||
                      document.documentElement.classList.contains('dark-mode') ||
                      document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Check if body has dark class
  const bodyHasDark = document.body.classList.contains('dark') ||
                      document.body.classList.contains('dark-mode');
  
  return hasDarkClass || hasDarkMeta || htmlHasDark || bodyHasDark;
}

function checkCSP(): { canInject: boolean; reason?: string } {
  // Try to detect CSP by checking if we can create a style element
  try {
    const testStyle = document.createElement('style');
    testStyle.textContent = '/* test */';
    document.head.appendChild(testStyle);
    document.head.removeChild(testStyle);
    return { canInject: true };
  } catch (error) {
    return { canInject: false, reason: 'CSP blocks style injection' };
  }
}

function testCSSInjection(): { success: boolean; error?: string } {
  try {
    const testId = 'dark-mode-test-' + Date.now();
    const testStyle = document.createElement('style');
    testStyle.id = testId;
    testStyle.textContent = 'body { visibility: visible !important; }';
    document.head.appendChild(testStyle);
    
    const injected = document.getElementById(testId) !== null;
    if (injected) {
      document.head.removeChild(testStyle);
    }
    
    return { success: injected };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

