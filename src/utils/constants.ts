export const STORAGE_KEYS = {
  DARK_MODE_ENABLED: 'darkModeEnabled',
  SITE_PREFERENCES: 'sitePreferences',
  SITE_SETTINGS: 'siteSettings',
  GLOBAL_ENABLED: 'globalEnabled',
  WHITELIST: 'whitelist',
  BLACKLIST: 'blacklist',
  PRESETS: 'presets',
} as const;

export const MESSAGE_TYPES = {
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  GET_DARK_MODE_STATE: 'GET_DARK_MODE_STATE',
  CHECK_COMPATIBILITY: 'CHECK_COMPATIBILITY',
  GET_COMPATIBILITY: 'GET_COMPATIBILITY',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  GET_SETTINGS: 'GET_SETTINGS',
  TOGGLE_QUICK: 'TOGGLE_QUICK',
} as const;

export const INCOMPATIBLE_PROTOCOLS = ['chrome-extension:', 'chrome:', 'moz-extension:', 'file:', 'about:'];
