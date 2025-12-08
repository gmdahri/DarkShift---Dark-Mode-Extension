export interface Message {
  type: string;
  payload?: unknown;
}

export function sendMessageToContentScript(tabId: number, message: Message): Promise<unknown> {
  return chrome.tabs.sendMessage(tabId, message);
}

export function sendMessageToBackground(message: Message): Promise<unknown> {
  return chrome.runtime.sendMessage(message);
}

export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) {
    throw new Error('No active tab found');
  }
  return tab;
}

