import { useState, useEffect } from 'react';
import { getCurrentTab } from '../../utils/messaging';
import { MESSAGE_TYPES } from '../../utils/constants';
import { useStorage } from './useStorage';

export function useDarkMode() {
  const [domain, setDomain] = useState<string>('');
  const { enabled, loading: storageLoading, updateEnabled } = useStorage(domain);
  const [applying, setApplying] = useState<boolean>(false);

  useEffect(() => {
    getCurrentTab().then(tab => {
      if (tab.url) {
        try {
          const url = new URL(tab.url);
          setDomain(url.hostname);
        } catch {
          setDomain('');
        }
      }
    });
  }, []);

  const toggleDarkMode = async (value: boolean) => {
    if (applying) return;

    setApplying(true);
    try {
      const tab = await getCurrentTab();
      if (!tab.id) {
        throw new Error('No tab ID');
      }

      // Check blacklist/whitelist before toggling
      const { isBlacklisted, isWhitelisted } = await import('../../utils/siteList');
      if (tab.url) {
        try {
          const url = new URL(tab.url);
          const hostname = url.hostname;
          
          if (await isBlacklisted(hostname)) {
            // Site is blacklisted, force disable
            value = false;
          } else if (await isWhitelisted(hostname)) {
            // Site is whitelisted, force enable
            value = true;
          }
        } catch {
          // Invalid URL, continue with requested value
        }
      }

      // Try to send message, inject script if needed
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: MESSAGE_TYPES.TOGGLE_DARK_MODE,
          payload: value,
        });
      } catch (error) {
        // Content script might not be loaded, try to inject it
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js'],
          });
          // Wait for script to initialize
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Retry sending message
          await chrome.tabs.sendMessage(tab.id, {
            type: MESSAGE_TYPES.TOGGLE_DARK_MODE,
            payload: value,
          });
        } catch (injectError) {
          console.error('Failed to inject content script:', injectError);
          throw new Error('Could not communicate with page. Please refresh the page and try again.');
        }
      }

      await updateEnabled(value);
    } catch (error) {
      console.error('Failed to toggle dark mode:', error);
      throw error;
    } finally {
      setApplying(false);
    }
  };

  return {
    enabled,
    domain,
    loading: storageLoading,
    applying,
    toggleDarkMode,
  };
}

