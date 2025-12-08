import { useState, useEffect, useCallback } from 'react';
import { DarkModeSettings, DEFAULT_SETTINGS } from '../../content/injector';
import { getSiteSettings, setSiteSettings } from '../../utils/storage';
import { getCurrentTab } from '../../utils/messaging';
import { MESSAGE_TYPES } from '../../utils/constants';

export function useSettings() {
  const [settings, setSettings] = useState<DarkModeSettings>(DEFAULT_SETTINGS);
  const [domain, setDomain] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const tab = await getCurrentTab();
      if (tab.url) {
        const url = new URL(tab.url);
        const hostname = url.hostname;
        setDomain(hostname);
        
        const savedSettings = await getSiteSettings(hostname);
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = useCallback(async (newSettings: Partial<DarkModeSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      // Save to storage
      if (domain) {
        await setSiteSettings(domain, updated);
      }

      // Send to content script
      const tab = await getCurrentTab();
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: MESSAGE_TYPES.UPDATE_SETTINGS,
          payload: updated,
        });
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }, [settings, domain]);

  const resetSettings = useCallback(async () => {
    await updateSettings(DEFAULT_SETTINGS);
  }, [updateSettings]);

  return {
    settings,
    domain,
    loading,
    updateSettings,
    resetSettings,
  };
}

