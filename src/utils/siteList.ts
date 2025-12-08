import { STORAGE_KEYS } from './constants';

export interface SiteListEntry {
  domain: string;
  addedAt: number;
  note?: string;
}

export async function getWhitelist(): Promise<SiteListEntry[]> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.WHITELIST]);
  return result[STORAGE_KEYS.WHITELIST] || [];
}

export async function getBlacklist(): Promise<SiteListEntry[]> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.BLACKLIST]);
  return result[STORAGE_KEYS.BLACKLIST] || [];
}

export async function addToWhitelist(domain: string, note?: string): Promise<void> {
  const whitelist = await getWhitelist();
  if (!whitelist.find(entry => entry.domain === domain)) {
    whitelist.push({
      domain,
      addedAt: Date.now(),
      note,
    });
    await chrome.storage.local.set({ [STORAGE_KEYS.WHITELIST]: whitelist });
  }
}

export async function removeFromWhitelist(domain: string): Promise<void> {
  const whitelist = await getWhitelist();
  const filtered = whitelist.filter(entry => entry.domain !== domain);
  await chrome.storage.local.set({ [STORAGE_KEYS.WHITELIST]: filtered });
}

export async function addToBlacklist(domain: string, note?: string): Promise<void> {
  const blacklist = await getBlacklist();
  if (!blacklist.find(entry => entry.domain === domain)) {
    blacklist.push({
      domain,
      addedAt: Date.now(),
      note,
    });
    await chrome.storage.local.set({ [STORAGE_KEYS.BLACKLIST]: blacklist });
  }
}

export async function removeFromBlacklist(domain: string): Promise<void> {
  const blacklist = await getBlacklist();
  const filtered = blacklist.filter(entry => entry.domain !== domain);
  await chrome.storage.local.set({ [STORAGE_KEYS.BLACKLIST]: filtered });
}

export async function isWhitelisted(domain: string): Promise<boolean> {
  const whitelist = await getWhitelist();
  return whitelist.some(entry => entry.domain === domain);
}

export async function isBlacklisted(domain: string): Promise<boolean> {
  const blacklist = await getBlacklist();
  return blacklist.some(entry => entry.domain === domain);
}

export async function clearWhitelist(): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.WHITELIST]: [] });
}

export async function clearBlacklist(): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.BLACKLIST]: [] });
}

