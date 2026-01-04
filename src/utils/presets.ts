import { STORAGE_KEYS } from './constants';
import { DarkModeSettings } from '../content/injector';

export interface Preset {
  id: string;
  name: string;
  description?: string;
  settings: DarkModeSettings;
  createdAt: number;
  updatedAt: number;
  icon?: string; // Emoji or icon identifier
  color?: string; // Theme color for UI
}

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard dark mode',
    icon: '🌙',
    color: '#6366f1',
    settings: {
      enabled: true,
      brightness: 100,
      contrast: 100,
      sepia: 0,
      grayscale: 0,
      saturation: 100,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep dark mode',
    icon: '🌑',
    color: '#1e1b4b',
    settings: {
      enabled: true,
      brightness: 80,
      contrast: 110,
      sepia: 0,
      grayscale: 0,
      saturation: 100,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'twilight',
    name: 'Twilight',
    description: 'Warm dark mode',
    icon: '🌅',
    color: '#f59e0b',
    settings: {
      enabled: true,
      brightness: 90,
      contrast: 100,
      sepia: 20,
      grayscale: 0,
      saturation: 100,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'paper',
    name: 'Paper',
    description: 'Soft sepia mode',
    icon: '📜',
    color: '#d4a574',
    settings: {
      enabled: true,
      brightness: 110,
      contrast: 95,
      sepia: 40,
      grayscale: 0,
      saturation: 90,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'oled',
    name: 'OLED Black',
    description: 'Pure blacks for OLED screens',
    icon: '⬛',
    color: '#000000',
    settings: {
      enabled: true,
      brightness: 70,
      contrast: 120,
      sepia: 0,
      grayscale: 0,
      saturation: 100,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic inspired palette',
    icon: '❄️',
    color: '#5e81ac',
    settings: {
      enabled: true,
      brightness: 95,
      contrast: 95,
      sepia: 5,
      grayscale: 10,
      saturation: 85,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'solarized',
    name: 'Solarized',
    description: 'Easy on the eyes',
    icon: '☀️',
    color: '#268bd2',
    settings: {
      enabled: true,
      brightness: 95,
      contrast: 90,
      sepia: 15,
      grayscale: 0,
      saturation: 95,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: 'Dark purple theme',
    icon: '🧛',
    color: '#bd93f9',
    settings: {
      enabled: true,
      brightness: 90,
      contrast: 105,
      sepia: 0,
      grayscale: 0,
      saturation: 120,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Grayscale mode',
    icon: '🔲',
    color: '#6b7280',
    settings: {
      enabled: true,
      brightness: 95,
      contrast: 100,
      sepia: 0,
      grayscale: 100,
      saturation: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Nature-inspired greens',
    icon: '🌲',
    color: '#22c55e',
    settings: {
      enabled: true,
      brightness: 90,
      contrast: 100,
      sepia: 10,
      grayscale: 5,
      saturation: 110,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'reading',
    name: 'Reading',
    description: 'Optimized for long reading',
    icon: '📖',
    color: '#eab308',
    settings: {
      enabled: true,
      brightness: 85,
      contrast: 90,
      sepia: 30,
      grayscale: 0,
      saturation: 80,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'highcontrast',
    name: 'High Contrast',
    description: 'Maximum readability',
    icon: '🔆',
    color: '#ffffff',
    settings: {
      enabled: true,
      brightness: 100,
      contrast: 140,
      sepia: 0,
      grayscale: 0,
      saturation: 100,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export async function getPresets(): Promise<Preset[]> {
  const result = await chrome.storage.local.get([STORAGE_KEYS.PRESETS]);
  const customPresets = result[STORAGE_KEYS.PRESETS] || [];
  return [...DEFAULT_PRESETS, ...customPresets];
}

export async function getPreset(id: string): Promise<Preset | null> {
  const presets = await getPresets();
  return presets.find(p => p.id === id) || null;
}

export async function createPreset(preset: Omit<Preset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Preset> {
  const newPreset: Preset = {
    ...preset,
    id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  const presets = await getPresets();
  const customPresets = presets.filter(p => !DEFAULT_PRESETS.find(dp => dp.id === p.id));
  customPresets.push(newPreset);
  
  await chrome.storage.local.set({ [STORAGE_KEYS.PRESETS]: customPresets });
  return newPreset;
}

export async function updatePreset(id: string, updates: Partial<Preset>): Promise<void> {
  const presets = await getPresets();
  const customPresets = presets.filter(p => !DEFAULT_PRESETS.find(dp => dp.id === p.id));
  const preset = customPresets.find(p => p.id === id);
  
  if (preset) {
    Object.assign(preset, updates, { updatedAt: Date.now() });
    await chrome.storage.local.set({ [STORAGE_KEYS.PRESETS]: customPresets });
  }
}

export async function deletePreset(id: string): Promise<void> {
  // Can't delete default presets
  if (DEFAULT_PRESETS.find(p => p.id === id)) {
    throw new Error('Cannot delete default preset');
  }
  
  const presets = await getPresets();
  const customPresets = presets.filter(p => !DEFAULT_PRESETS.find(dp => dp.id === p.id));
  const filtered = customPresets.filter(p => p.id !== id);
  
  await chrome.storage.local.set({ [STORAGE_KEYS.PRESETS]: filtered });
}

export async function exportPresets(): Promise<string> {
  const presets = await getPresets();
  return JSON.stringify(presets, null, 2);
}

export async function importPresets(json: string): Promise<void> {
  try {
    const imported = JSON.parse(json) as Preset[];
    // Validate structure
    if (!Array.isArray(imported)) {
      throw new Error('Invalid preset format');
    }
    
    // Filter out default presets and validate
    const customPresets = imported
      .filter(p => !DEFAULT_PRESETS.find(dp => dp.id === p.id))
      .map(p => ({
        ...p,
        id: p.id.startsWith('preset-') ? p.id : `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        updatedAt: Date.now(),
      }));
    
    await chrome.storage.local.set({ [STORAGE_KEYS.PRESETS]: customPresets });
  } catch (error) {
    throw new Error('Failed to import presets: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

