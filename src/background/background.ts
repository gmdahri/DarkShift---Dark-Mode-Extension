// Background service worker
import { STORAGE_KEYS, MESSAGE_TYPES } from '../utils/constants';

// Initialize on install
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Dark Mode Pro Extension installed');

  // Create context menu
  chrome.contextMenus.create({
    id: 'toggle-dark-mode',
    title: 'Toggle Dark Mode',
    contexts: ['all'],
  });

  chrome.contextMenus.create({
    id: 'open-settings',
    title: 'Dark Mode Pro Settings',
    contexts: ['all'],
  });

  // Set initial badge
  await updateBadge(false);

  // Show onboarding for new installs
  if (details.reason === 'install') {
    await chrome.storage.sync.set({ [STORAGE_KEYS.ONBOARDING_COMPLETED]: false });
  }
});

// Update extension badge based on dark mode state
async function updateBadge(enabled: boolean): Promise<void> {
  try {
    if (enabled) {
      await chrome.action.setBadgeText({ text: 'ON' });
      await chrome.action.setBadgeBackgroundColor({ color: '#f97316' }); // Orange
    } else {
      await chrome.action.setBadgeText({ text: '' });
    }
  } catch (error) {
    console.error('Failed to update badge:', error);
  }
}

// Update badge for specific tab
async function updateTabBadge(tabId: number): Promise<void> {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      type: MESSAGE_TYPES.GET_DARK_MODE_STATE,
    }) as { enabled: boolean };
    await updateBadge(response?.enabled ?? false);
  } catch {
    // Tab might not have content script, clear badge
    await updateBadge(false);
  }
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  try {
    if (info.menuItemId === 'toggle-dark-mode') {
      // Get current state and toggle
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: MESSAGE_TYPES.GET_DARK_MODE_STATE,
      }) as { enabled: boolean };

      await chrome.tabs.sendMessage(tab.id, {
        type: MESSAGE_TYPES.TOGGLE_DARK_MODE,
        payload: !response.enabled,
      });

      // Update badge
      await updateBadge(!response.enabled);
    } else if (info.menuItemId === 'open-settings') {
      // Open popup (this opens as a new tab since we can't programmatically open popup)
      await chrome.action.openPopup();
    }
  } catch (error) {
    console.error('Context menu handler error:', error);
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  try {
    if (command === 'toggle-dark-mode') {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        // Get current state
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: MESSAGE_TYPES.GET_DARK_MODE_STATE,
        }) as { enabled: boolean };

        // Toggle it
        await chrome.tabs.sendMessage(tab.id, {
          type: MESSAGE_TYPES.TOGGLE_DARK_MODE,
          payload: !response.enabled,
        });

        // Update badge
        await updateBadge(!response.enabled);
      }
    } else if (command === 'toggle-global') {
      // Toggle global setting
      const result = await chrome.storage.sync.get([STORAGE_KEYS.GLOBAL_ENABLED]);
      const current = result[STORAGE_KEYS.GLOBAL_ENABLED] ?? false;
      await chrome.storage.sync.set({ [STORAGE_KEYS.GLOBAL_ENABLED]: !current });

      // Apply to current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: MESSAGE_TYPES.TOGGLE_DARK_MODE,
          payload: !current,
        });

        // Update badge
        await updateBadge(!current);
      }
    } else if (command === 'toggle-reading-mode') {
      // Toggle reading mode on current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: MESSAGE_TYPES.TOGGLE_READING_MODE,
        });
      }
    }
  } catch (error) {
    console.error('Command handler error:', error);
  }
});

// Update badge when tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateTabBadge(activeInfo.tabId);
});

// Update badge when tab is updated
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    // Small delay to let content script initialize
    setTimeout(() => updateTabBadge(tabId), 500);
  }
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  try {
    if (message.type === 'GET_TAB_INFO') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          sendResponse({ url: tabs[0].url, title: tabs[0].title });
        } else {
          sendResponse({ error: 'No active tab found' });
        }
      });
      return true; // Async response
    }

    if (message.type === 'UPDATE_BADGE') {
      updateBadge(message.payload as boolean);
      sendResponse({ success: true });
      return false;
    }

    if (message.type === 'DARK_MODE_CHANGED') {
      // Update badge when dark mode state changes
      updateBadge(message.payload as boolean);
      return false;
    }
  } catch (error) {
    console.error('Background message handler error:', error);
    sendResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
  return false;
});

