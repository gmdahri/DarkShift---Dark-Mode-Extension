import { STORAGE_KEYS } from './constants';

export async function isOnboardingCompleted(): Promise<boolean> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.ONBOARDING_COMPLETED]);
  return result[STORAGE_KEYS.ONBOARDING_COMPLETED] ?? false;
}

export async function setOnboardingCompleted(completed: boolean): Promise<void> {
  await chrome.storage.local.set({
    [STORAGE_KEYS.ONBOARDING_COMPLETED]: completed,
  });
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Dark Mode Pro',
    description: 'Transform any website into a beautiful dark mode experience. Let\'s get you started!',
    icon: '🌙',
  },
  {
    id: 'toggle',
    title: 'Easy Toggle',
    description: 'Click the toggle to enable dark mode on any site. Your preference is saved automatically.',
    icon: '🔘',
  },
  {
    id: 'customize',
    title: 'Fine-tune Your Experience',
    description: 'Adjust brightness, contrast, saturation, and warmth to create your perfect dark mode.',
    icon: '🎨',
  },
  {
    id: 'presets',
    title: 'Choose a Theme',
    description: 'Pick from beautiful presets like OLED Black, Nord, Dracula, or create your own.',
    icon: '✨',
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts',
    description: 'Press Cmd/Ctrl + Shift + D to quickly toggle dark mode without opening the popup.',
    icon: '⌨️',
  },
  {
    id: 'schedule',
    title: 'Smart Scheduling',
    description: 'Set up automatic dark mode based on time of day or follow your system theme.',
    icon: '⏰',
  },
];


