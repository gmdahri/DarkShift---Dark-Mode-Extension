import { useState, useEffect, useCallback } from 'react';
import { Preset, getPresets, createPreset, updatePreset, deletePreset, exportPresets, importPresets } from '../../utils/presets';

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPresets = useCallback(async () => {
    setLoading(true);
    try {
      const allPresets = await getPresets();
      setPresets(allPresets);
    } catch (error) {
      console.error('Failed to load presets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  const create = useCallback(async (preset: Omit<Preset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPreset = await createPreset(preset);
    await loadPresets();
    return newPreset;
  }, [loadPresets]);

  const update = useCallback(async (id: string, updates: Partial<Preset>) => {
    await updatePreset(id, updates);
    await loadPresets();
  }, [loadPresets]);

  const remove = useCallback(async (id: string) => {
    await deletePreset(id);
    await loadPresets();
  }, [loadPresets]);

  const exportData = useCallback(async () => {
    return await exportPresets();
  }, []);

  const importData = useCallback(async (json: string) => {
    await importPresets(json);
    await loadPresets();
  }, [loadPresets]);

  const applyPreset = useCallback(async (preset: Preset) => {
    // This will be handled by the settings hook
    return preset.settings;
  }, []);

  return {
    presets,
    loading,
    create,
    update,
    remove,
    exportData,
    importData,
    applyPreset,
    refresh: loadPresets,
  };
}

