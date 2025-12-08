import { injectDarkMode, removeDarkMode, isDarkModeActive, updateFilters, DarkModeSettings, DEFAULT_SETTINGS } from './injector';
import { checkCompatibility } from './compatibility';
import { getDarkModeState, getSiteSettings } from '../utils/storage';
import { isBlacklisted, isWhitelisted } from '../utils/siteList';
import { MESSAGE_TYPES, STORAGE_KEYS } from '../utils/constants';

let currentSettings: DarkModeSettings = { ...DEFAULT_SETTINGS };

// Initialize on page load
(async () => {
  try {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', resolve);
        } else {
          resolve(null);
        }
      });
    }
    
    const domain = window.location.hostname;
    if (!domain) return;
    
    // Check blacklist first - if blacklisted, ensure dark mode is off
    const blacklisted = await isBlacklisted(domain);
    if (blacklisted) {
      removeDarkMode();
      console.log('Site is blacklisted, dark mode disabled');
      return;
    }
    
    const enabled = await getDarkModeState(domain);
    
    if (enabled) {
      const compatibility = await checkCompatibility();
      if (compatibility.compatible) {
        currentSettings = await getSiteSettings(domain);
        currentSettings.enabled = true;
        injectDarkMode(currentSettings);
      }
    } else {
      // Ensure dark mode is removed if not enabled
      removeDarkMode();
    }
  } catch (error) {
    console.error('Failed to initialize dark mode:', error);
  }
})();

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  try {
    if (message.type === MESSAGE_TYPES.TOGGLE_DARK_MODE) {
      const domain = window.location.hostname;
      const requestedEnabled = message.payload as boolean;
      console.log('Toggle dark mode received:', requestedEnabled);
      
      // Check blacklist/whitelist first
      const blacklisted = await isBlacklisted(domain);
      const whitelisted = await isWhitelisted(domain);
      
      // If blacklisted, always remove dark mode
      if (blacklisted) {
        currentSettings.enabled = false;
        removeDarkMode();
        console.log('Site is blacklisted, dark mode removed');
        sendResponse({ success: true, blacklisted: true });
        return true;
      }
      
      // If whitelisted, always enable dark mode
      if (whitelisted) {
        currentSettings = await getSiteSettings(domain);
        currentSettings.enabled = true;
        const success = injectDarkMode(currentSettings);
        console.log('Site is whitelisted, dark mode enabled');
        sendResponse({ success, whitelisted: true });
        return true;
      }
      
      // Otherwise, respect the toggle request
      if (requestedEnabled) {
        currentSettings = await getSiteSettings(domain);
        currentSettings.enabled = true;
        const success = injectDarkMode(currentSettings);
        console.log('Dark mode injection result:', success);
        sendResponse({ success });
      } else {
        currentSettings.enabled = false;
        removeDarkMode();
        console.log('Dark mode removed');
        sendResponse({ success: true });
      }
    } else if (message.type === MESSAGE_TYPES.GET_DARK_MODE_STATE) {
      sendResponse({ enabled: isDarkModeActive() });
    } else if (message.type === MESSAGE_TYPES.UPDATE_SETTINGS) {
      const settings = message.payload as DarkModeSettings;
      currentSettings = { ...settings };
      
      if (currentSettings.enabled && isDarkModeActive()) {
        updateFilters(currentSettings);
      }
      sendResponse({ success: true });
    } else if (message.type === MESSAGE_TYPES.GET_SETTINGS) {
      sendResponse({ settings: currentSettings });
    } else if (message.type === MESSAGE_TYPES.CHECK_COMPATIBILITY) {
      checkCompatibility()
        .then(result => {
          sendResponse(result);
        })
        .catch(error => {
          console.error('Compatibility check error:', error);
          sendResponse({
            compatible: true,
            disableToggle: false,
            message: 'Dark mode available',
            reason: 'check_error',
            confidence: 'low',
          });
        });
      return true; // Async response
    }
  } catch (error) {
    console.error('Message handler error:', error);
    sendResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
  
  return true;
});

// Listen for storage changes (e.g., blacklist/whitelist updates)
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== 'local') return;
  
  // Check if blacklist or whitelist changed
  if (changes[STORAGE_KEYS.BLACKLIST] || changes[STORAGE_KEYS.WHITELIST] || changes[STORAGE_KEYS.SITE_PREFERENCES]) {
    const domain = window.location.hostname;
    if (!domain) return;
    
    try {
      // Re-check blacklist/whitelist status
      const blacklisted = await isBlacklisted(domain);
      const whitelisted = await isWhitelisted(domain);
      
      if (blacklisted) {
        // Site was added to blacklist, remove dark mode
        removeDarkMode();
        console.log('Site added to blacklist, dark mode removed');
      } else if (whitelisted) {
        // Site was added to whitelist, enable dark mode
        currentSettings = await getSiteSettings(domain);
        currentSettings.enabled = true;
        injectDarkMode(currentSettings);
        console.log('Site added to whitelist, dark mode enabled');
      } else {
        // Re-check normal state
        const enabled = await getDarkModeState(domain);
        if (enabled) {
          currentSettings = await getSiteSettings(domain);
          currentSettings.enabled = true;
          injectDarkMode(currentSettings);
        } else {
          removeDarkMode();
        }
      }
    } catch (error) {
      console.error('Storage change handler error:', error);
    }
  }
});

// Handle SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    // Re-check and apply dark mode on navigation
    (async () => {
      try {
        const domain = window.location.hostname;
        if (!domain) return;
        
        // Check blacklist first
        const blacklisted = await isBlacklisted(domain);
        if (blacklisted) {
          removeDarkMode();
          return;
        }
        
        const enabled = await getDarkModeState(domain);
        
        if (enabled) {
          // Re-inject to ensure it works on new content
          setTimeout(() => {
            currentSettings = { ...currentSettings, enabled: true };
            injectDarkMode(currentSettings);
          }, 100);
        } else {
          removeDarkMode();
        }
      } catch (error) {
        console.error('SPA navigation handler error:', error);
      }
    })();
  }
}).observe(document, { subtree: true, childList: true });
