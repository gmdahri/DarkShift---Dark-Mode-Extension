import { STORAGE_KEYS } from './constants';
import { DarkModeSettings } from '../content/injector';

export interface Preset {
  id: string;
  name: string;
  description?: string;
  settings: DarkModeSettings;
  createdAt: number;
  updatedAt: number;
}

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard dark mode',
    settings: {
      enabled: true,
      brightness: 100,
      contrast: 100,
      sepia: 0,
      grayscale: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep dark mode',
    settings: {
      enabled: true,
      brightness: 80,
      contrast: 110,
      sepia: 0,
      grayscale: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'twilight',
    name: 'Twilight',
    description: 'Warm dark mode',
    settings: {
      enabled: true,
      brightness: 90,
      contrast: 100,
      sepia: 20,
      grayscale: 0,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'paper',
    name: 'Paper',
    description: 'Soft sepia mode',
    settings: {
      enabled: true,
      brightness: 110,
      contrast: 95,
      sepia: 40,
      grayscale: 0,
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

