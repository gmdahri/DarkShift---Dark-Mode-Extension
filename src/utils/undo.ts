import { STORAGE_KEYS, LastAction } from './constants';

export async function saveLastAction(action: LastAction): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEYS.LAST_ACTION]: action,
  });
}

export async function getLastAction(): Promise<LastAction | null> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.LAST_ACTION]);
  const action = result[STORAGE_KEYS.LAST_ACTION];
  
  // Only return action if it's less than 30 seconds old
  if (action && Date.now() - action.timestamp < 30000) {
    return action;
  }
  
  return null;
}

export async function clearLastAction(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEYS.LAST_ACTION);
}


