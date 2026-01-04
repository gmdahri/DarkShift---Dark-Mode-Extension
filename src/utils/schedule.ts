import { STORAGE_KEYS, ScheduleSettings, DEFAULT_SCHEDULE } from './constants';

export async function getScheduleSettings(): Promise<ScheduleSettings> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.SCHEDULE_SETTINGS]);
  return result[STORAGE_KEYS.SCHEDULE_SETTINGS] || { ...DEFAULT_SCHEDULE };
}

export async function setScheduleSettings(settings: ScheduleSettings): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEYS.SCHEDULE_SETTINGS]: settings,
  });
}

export async function getFollowSystemTheme(): Promise<boolean> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.FOLLOW_SYSTEM_THEME]);
  return result[STORAGE_KEYS.FOLLOW_SYSTEM_THEME] ?? false;
}

export async function setFollowSystemTheme(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEYS.FOLLOW_SYSTEM_THEME]: enabled,
  });
}

export async function getShowFloatingButton(): Promise<boolean> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.SHOW_FLOATING_BUTTON]);
  return result[STORAGE_KEYS.SHOW_FLOATING_BUTTON] ?? false;
}

export async function setShowFloatingButton(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEYS.SHOW_FLOATING_BUTTON]: enabled,
  });
}

export function isWithinSchedule(schedule: ScheduleSettings): boolean {
  if (!schedule.enabled) return true; // If schedule is disabled, always allow
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = schedule.startTime.split(':').map(Number);
  const [endHour, endMin] = schedule.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  // Handle overnight schedules (e.g., 20:00 to 07:00)
  if (startMinutes > endMinutes) {
    // Schedule spans midnight
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  } else {
    // Schedule is within the same day
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
}

export function getSunriseSunset(_latitude: number, longitude: number): { sunrise: string; sunset: string } {
  // Simple sunrise/sunset calculation based on day of year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  // Approximate calculation (simplified)
  const baseHour = 6; // Base sunrise hour
  const variation = Math.sin((dayOfYear - 80) * (2 * Math.PI / 365)) * 2;
  
  const sunriseHour = Math.round(baseHour - variation + (longitude / 15));
  const sunsetHour = Math.round(18 + variation + (longitude / 15));
  
  return {
    sunrise: `${String(Math.max(5, Math.min(8, sunriseHour))).padStart(2, '0')}:00`,
    sunset: `${String(Math.max(17, Math.min(21, sunsetHour))).padStart(2, '0')}:00`,
  };
}

export async function shouldEnableDarkMode(): Promise<{ enabled: boolean; reason: string }> {
  // Check if following system theme
  const followSystem = await getFollowSystemTheme();
  if (followSystem) {
    // This will be checked in the popup/content script where we have access to matchMedia
    return { enabled: true, reason: 'system' };
  }
  
  // Check schedule
  const schedule = await getScheduleSettings();
  if (schedule.enabled) {
    const withinSchedule = isWithinSchedule(schedule);
    return { 
      enabled: withinSchedule, 
      reason: withinSchedule ? 'within_schedule' : 'outside_schedule' 
    };
  }
  
  return { enabled: true, reason: 'manual' };
}

