// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Dark Mode Extension installed');
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  try {
    if (command === 'toggle-dark-mode') {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        // Get current state
        const response = await chrome.tabs.sendMessage(tab.id, {
          type: 'GET_DARK_MODE_STATE',
        }) as { enabled: boolean };
        
        // Toggle it
        await chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_DARK_MODE',
          payload: !response.enabled,
        });
      }
    } else if (command === 'toggle-global') {
      // Toggle global setting
      const result = await chrome.storage.local.get(['globalEnabled']);
      const current = result.globalEnabled ?? false;
      await chrome.storage.local.set({ globalEnabled: !current });
      
      // Apply to current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_DARK_MODE',
          payload: !current,
        });
      }
    }
  } catch (error) {
    console.error('Command handler error:', error);
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
  } catch (error) {
    console.error('Background message handler error:', error);
    sendResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
  return false;
});

