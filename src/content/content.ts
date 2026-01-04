import { injectDarkMode, removeDarkMode, isDarkModeActive, updateFilters, DarkModeSettings, DEFAULT_SETTINGS, showFAB, hideFAB, updateFABIcon } from './injector';
import { checkCompatibility } from './compatibility';
import { getDarkModeState, getSiteSettings, setDarkModeState } from '../utils/storage';
import { isBlacklisted, isWhitelisted } from '../utils/siteList';
import { MESSAGE_TYPES, STORAGE_KEYS } from '../utils/constants';

let currentSettings: DarkModeSettings = { ...DEFAULT_SETTINGS };
let fabEnabled = false;

// FAB toggle handler
async function handleFABToggle() {
  const domain = window.location.hostname;
  if (!domain) return;
  
  const currentlyActive = isDarkModeActive();
  
  if (currentlyActive) {
    removeDarkMode();
    await setDarkModeState(domain, false);
  } else {
    currentSettings = await getSiteSettings(domain);
    currentSettings.enabled = true;
    injectDarkMode(currentSettings);
    await setDarkModeState(domain, true);
  }
  
  // Update FAB icon
  updateFABIcon();
  
  // Notify background script of state change
  try {
    chrome.runtime.sendMessage({ 
      type: 'DARK_MODE_CHANGED', 
      payload: !currentlyActive 
    });
  } catch (e) {
    // Ignore if background is not available
  }
}

// Initialize FAB if enabled
async function initFAB() {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.SHOW_FLOATING_BUTTON]);
    fabEnabled = result[STORAGE_KEYS.SHOW_FLOATING_BUTTON] ?? false;
    
    if (fabEnabled) {
      showFAB(handleFABToggle);
    }
  } catch (error) {
    console.error('Failed to initialize FAB:', error);
  }
}

// Check system theme preference
function getSystemThemePreference(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Listen for system theme changes
function setupSystemThemeListener() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', async (e) => {
    try {
      const result = await chrome.storage.local.get([STORAGE_KEYS.FOLLOW_SYSTEM_THEME]);
      const followSystem = result[STORAGE_KEYS.FOLLOW_SYSTEM_THEME] ?? false;
      
      if (followSystem) {
        const domain = window.location.hostname;
        if (!domain) return;
        
        if (e.matches) {
          // System switched to dark mode
          currentSettings = await getSiteSettings(domain);
          currentSettings.enabled = true;
          injectDarkMode(currentSettings);
        } else {
          // System switched to light mode
          removeDarkMode();
        }
        
        updateFABIcon();
      }
    } catch (error) {
      console.error('System theme change handler error:', error);
    }
  });
}

// Check schedule
async function checkSchedule(): Promise<boolean> {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEYS.SCHEDULE_SETTINGS]);
    const schedule = result[STORAGE_KEYS.SCHEDULE_SETTINGS];
    
    if (!schedule?.enabled) return true; // No schedule, allow normal behavior
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = schedule.startTime.split(':').map(Number);
    const [endHour, endMin] = schedule.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // Handle overnight schedules
    if (startMinutes > endMinutes) {
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    } else {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }
  } catch (error) {
    console.error('Schedule check error:', error);
    return true;
  }
}

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
    
    // Initialize FAB
    await initFAB();
    
    // Setup system theme listener
    setupSystemThemeListener();
    
    // Check blacklist first - if blacklisted, ensure dark mode is off
    const blacklisted = await isBlacklisted(domain);
    if (blacklisted) {
      removeDarkMode();
      console.log('Site is blacklisted, dark mode disabled');
      return;
    }
    
    // Check if following system theme
    const result = await chrome.storage.local.get([STORAGE_KEYS.FOLLOW_SYSTEM_THEME]);
    const followSystem = result[STORAGE_KEYS.FOLLOW_SYSTEM_THEME] ?? false;
    
    let shouldEnable = false;
    
    if (followSystem) {
      // Use system preference
      shouldEnable = getSystemThemePreference();
    } else {
      // Check schedule
      const withinSchedule = await checkSchedule();
      if (!withinSchedule) {
        removeDarkMode();
        console.log('Outside scheduled hours, dark mode disabled');
        return;
      }
      
      // Use saved preference
      shouldEnable = await getDarkModeState(domain);
    }
    
    if (shouldEnable) {
      const compatibility = await checkCompatibility();
      if (compatibility.compatible) {
        currentSettings = await getSiteSettings(domain);
        currentSettings.enabled = true;
        injectDarkMode(currentSettings);
        updateFABIcon();
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
        updateFABIcon();
        console.log('Site is blacklisted, dark mode removed');
        sendResponse({ success: true, blacklisted: true });
        return true;
      }
      
      // If whitelisted, always enable dark mode
      if (whitelisted) {
        currentSettings = await getSiteSettings(domain);
        currentSettings.enabled = true;
        const success = injectDarkMode(currentSettings);
        updateFABIcon();
        console.log('Site is whitelisted, dark mode enabled');
        sendResponse({ success, whitelisted: true });
        return true;
      }
      
      // Otherwise, respect the toggle request
      if (requestedEnabled) {
        currentSettings = await getSiteSettings(domain);
        currentSettings.enabled = true;
        const success = injectDarkMode(currentSettings);
        updateFABIcon();
        console.log('Dark mode injection result:', success);
        sendResponse({ success });
      } else {
        currentSettings.enabled = false;
        removeDarkMode();
        updateFABIcon();
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
    } else if (message.type === MESSAGE_TYPES.SHOW_FAB) {
      fabEnabled = true;
      showFAB(handleFABToggle);
      sendResponse({ success: true });
    } else if (message.type === MESSAGE_TYPES.HIDE_FAB) {
      fabEnabled = false;
      hideFAB();
      sendResponse({ success: true });
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
