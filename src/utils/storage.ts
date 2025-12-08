import { STORAGE_KEYS } from './constants';
import { DarkModeSettings, DEFAULT_SETTINGS } from '../content/injector';
import { isWhitelisted, isBlacklisted } from './siteList';

export interface SitePreferences {
  [domain: string]: boolean;
}

export interface SiteSettings {
  [domain: string]: DarkModeSettings;
}

export async function getDarkModeState(domain: string): Promise<boolean> {
  // Check blacklist first - if blacklisted, always return false
  if (await isBlacklisted(domain)) {
    return false;
  }
  
  // Check whitelist - if whitelisted, always return true
  if (await isWhitelisted(domain)) {
    return true;
  }
  
  // Otherwise use site preferences or global default
  const result = await chrome.storage.local.get([STORAGE_KEYS.SITE_PREFERENCES, STORAGE_KEYS.GLOBAL_ENABLED]);
  const sitePrefs: SitePreferences = result[STORAGE_KEYS.SITE_PREFERENCES] || {};
  const globalEnabled: boolean = result[STORAGE_KEYS.GLOBAL_ENABLED] ?? false;
  
  return sitePrefs[domain] ?? globalEnabled;
}

export async function setDarkModeState(domain: string, enabled: boolean): Promise<void> {
  // Don't set preference if site is blacklisted or whitelisted
  // (blacklist/whitelist take priority)
  if (await isBlacklisted(domain) || await isWhitelisted(domain)) {
    return;
  }
  
  const result = await chrome.storage.local.get([STORAGE_KEYS.SITE_PREFERENCES]);
  const sitePrefs: SitePreferences = result[STORAGE_KEYS.SITE_PREFERENCES] || {};
  
  sitePrefs[domain] = enabled;
  
  await chrome.storage.local.set({
    [STORAGE_KEYS.SITE_PREFERENCES]: sitePrefs,
  });
}

export async function getGlobalEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.GLOBAL_ENABLED]);
  return result[STORAGE_KEYS.GLOBAL_ENABLED] ?? false;
}

export async function setGlobalEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEYS.GLOBAL_ENABLED]: enabled,
  });
}

export async function getSiteSettings(domain: string): Promise<DarkModeSettings> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.SITE_SETTINGS]);
  const siteSettings: SiteSettings = result[STORAGE_KEYS.SITE_SETTINGS] || {};
  
  return siteSettings[domain] || { ...DEFAULT_SETTINGS };
}

export async function setSiteSettings(domain: string, settings: DarkModeSettings): Promise<void> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.SITE_SETTINGS]);
  const siteSettings: SiteSettings = result[STORAGE_KEYS.SITE_SETTINGS] || {};
  
  siteSettings[domain] = settings;
  
  await chrome.storage.local.set({
    [STORAGE_KEYS.SITE_SETTINGS]: siteSettings,
  });
}
