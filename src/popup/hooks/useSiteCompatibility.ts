import { useState, useEffect } from 'react';
import { CompatibilityResult, CompatibilityState } from '../../types/compatibility';
import { getCurrentTab } from '../../utils/messaging';
import { MESSAGE_TYPES } from '../../utils/constants';

export function useSiteCompatibility() {
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [state, setState] = useState<CompatibilityState>('checking');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkCompatibility();
  }, []);

  async function checkCompatibility() {
    setLoading(true);
    setState('checking');

    try {
      const tab = await getCurrentTab();
      if (!tab.id) {
        throw new Error('No tab ID');
      }

      // Try to send message first
      let response: CompatibilityResult | null = null;
      let retries = 2;
      
      try {
        response = await chrome.tabs.sendMessage(tab.id, {
          type: MESSAGE_TYPES.CHECK_COMPATIBILITY,
        }) as CompatibilityResult;
      } catch (error) {
        // Content script might not be loaded, try to inject it
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            files: ['content.js'],
          });
          // Wait for script to initialize
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Retry sending message
          while (retries > 0 && !response) {
            try {
              response = await chrome.tabs.sendMessage(tab.id, {
                type: MESSAGE_TYPES.CHECK_COMPATIBILITY,
              }) as CompatibilityResult;
            } catch (retryError) {
              retries--;
              if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 200));
              }
            }
          }
        } catch (injectError) {
          console.warn('Could not inject content script:', injectError);
        }
        
        // If still no response, default to compatible
        if (!response) {
          console.warn('Content script not responding, defaulting to compatible');
          response = {
            compatible: true,
            disableToggle: false,
            message: 'Dark mode available',
            reason: 'script_not_ready',
            confidence: 'low',
          };
        }
      }

      if (!response || typeof response.compatible === 'undefined') {
        throw new Error('Invalid response from content script');
      }

      setCompatibility(response);
      
      if (!response.compatible) {
        setState('incompatible');
      } else if (response.warnings && response.warnings.length > 0) {
        setState('partial');
      } else {
        setState('compatible');
      }
    } catch (error) {
      console.error('Compatibility check failed:', error);
      // Default to compatible instead of incompatible on error
      setCompatibility({
        compatible: true,
        disableToggle: false,
        message: 'Dark mode available',
        reason: 'check_failed',
        confidence: 'low',
      });
      setState('compatible');
    } finally {
      setLoading(false);
    }
  }

  return {
    compatibility,
    state,
    loading,
    refresh: checkCompatibility,
  };
}

