export const STORAGE_KEYS = {
  DARK_MODE_ENABLED: 'darkModeEnabled',
  SITE_PREFERENCES: 'sitePreferences',
  SITE_SETTINGS: 'siteSettings',
  GLOBAL_ENABLED: 'globalEnabled',
  WHITELIST: 'whitelist',
  BLACKLIST: 'blacklist',
  PRESETS: 'presets',
  SCHEDULE_SETTINGS: 'scheduleSettings',
  FOLLOW_SYSTEM_THEME: 'followSystemTheme',
  SHOW_FLOATING_BUTTON: 'showFloatingButton',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  LAST_ACTION: 'lastAction',
  // New feature keys
  EXCLUDE_IMAGES: 'excludeImages',
  EXCLUDE_VIDEOS: 'excludeVideos',
  READING_MODE_ENABLED: 'readingModeEnabled',
} as const;

export const MESSAGE_TYPES = {
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  GET_DARK_MODE_STATE: 'GET_DARK_MODE_STATE',
  CHECK_COMPATIBILITY: 'CHECK_COMPATIBILITY',
  GET_COMPATIBILITY: 'GET_COMPATIBILITY',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  GET_SETTINGS: 'GET_SETTINGS',
  TOGGLE_QUICK: 'TOGGLE_QUICK',
  SHOW_FAB: 'SHOW_FAB',
  HIDE_FAB: 'HIDE_FAB',
  UNDO_ACTION: 'UNDO_ACTION',
  // Reading mode
  TOGGLE_READING_MODE: 'TOGGLE_READING_MODE',
  GET_READING_MODE_STATE: 'GET_READING_MODE_STATE',
} as const;

export const INCOMPATIBLE_PROTOCOLS = ['chrome-extension:', 'chrome:', 'moz-extension:', 'file:', 'about:'];

export interface ScheduleSettings {
  enabled: boolean;
  mode: 'custom' | 'sunset'; // 'sunset' uses automatic sunrise/sunset
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
}

export const DEFAULT_SCHEDULE: ScheduleSettings = {
  enabled: false,
  mode: 'custom',
  startTime: '20:00',
  endTime: '07:00',
};

export interface LastAction {
  type: 'toggle' | 'settings' | 'whitelist' | 'blacklist';
  domain: string;
  previousValue: unknown;
  timestamp: number;
}
