import { useState } from 'react';
import { usePresets } from '../hooks/usePresets';
import { useSettings } from '../hooks/useSettings';
import { Preset } from '../../utils/presets';
import { getCurrentTab } from '../../utils/messaging';
import { sendMessageToContentScript } from '../../utils/messaging';
import { MESSAGE_TYPES } from '../../utils/constants';
import { setSiteSettings } from '../../utils/storage';

interface PresetManagerProps {
  domain: string;
  onClose: () => void;
}

export function PresetManager({ domain, onClose }: PresetManagerProps) {
  const { presets, loading, create, remove, exportData, importData } = usePresets();
  const { settings } = useSettings();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDesc, setPresetDesc] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');

  const handleCreate = async () => {
    if (!presetName.trim()) return;

    await create({
      name: presetName.trim(),
      description: presetDesc.trim() || undefined,
      settings: { ...settings },
    });

    setPresetName('');
    setPresetDesc('');
    setShowCreateForm(false);
  };

  const handleApply = async (preset: Preset) => {
    const tab = await getCurrentTab();
    if (tab.id) {
      await sendMessageToContentScript(tab.id, {
        type: MESSAGE_TYPES.UPDATE_SETTINGS,
        payload: preset.settings,
      });
      await setSiteSettings(domain, preset.settings);
    }
    onClose();
  };

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `darkshift-presets-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    try {
      await importData(importText);
      setImportText('');
      setShowImport(false);
    } catch (error) {
      alert('Failed to import presets: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          await importData(text);
          setShowImport(false);
        } catch (error) {
          alert('Failed to import presets: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      };
      reader.readAsText(file);
    }
  };

  const getPresetStyle = (preset: Preset, index: number) => {
    if (preset.color) {
      return {
        background: `linear-gradient(135deg, ${preset.color}20 0%, ${preset.color}10 100%)`,
        borderColor: `${preset.color}30`,
      };
    }
    const gradients = [
      'from-rose-500/20 to-orange-500/20 border-rose-500/20',
      'from-violet-500/20 to-purple-500/20 border-violet-500/20',
      'from-cyan-500/20 to-blue-500/20 border-cyan-500/20',
      'from-amber-500/20 to-yellow-500/20 border-amber-500/20',
      'from-emerald-500/20 to-teal-500/20 border-emerald-500/20',
      'from-pink-500/20 to-rose-500/20 border-pink-500/20',
    ];
    return { className: `bg-gradient-to-br ${gradients[index % gradients.length]}` };
  };

  return (
    <div className="absolute inset-0 bg-[#08080c]/98 backdrop-blur-xl z-30 flex flex-col animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Presets</h2>
          <p className="text-xs text-white/40 mt-1">Save and apply theme configurations</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Actions */}
      <div className="px-6 pb-4 flex gap-2">
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm 
            bg-gradient-to-r from-rose-500 to-amber-500 text-white
            hover:shadow-lg hover:shadow-rose-500/25 transition-all
            flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create
        </button>
        <button
          onClick={() => setShowImport(!showImport)}
          className="py-2.5 px-4 rounded-xl font-medium text-sm text-white/60 
            bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
        >
          Import
        </button>
        <button
          onClick={handleExport}
          className="py-2.5 px-4 rounded-xl font-medium text-sm text-white/60 
            bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
        >
          Export
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="px-6 pb-4">
          <div className="p-4 rounded-xl glass animate-scale-in">
            <p className="text-xs text-white/40 mb-3">Create from current settings</p>
            <input
              type="text"
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full mb-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-white placeholder-white/30 focus:outline-none focus:border-white/30
                font-medium text-sm transition-colors"
              autoFocus
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={presetDesc}
              onChange={(e) => setPresetDesc(e.target.value)}
              className="w-full mb-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-white placeholder-white/30 focus:outline-none focus:border-white/30
                text-sm transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm 
                  bg-gradient-to-r from-rose-500 to-amber-500 text-white"
              >
                Create Preset
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setPresetName('');
                  setPresetDesc('');
                }}
                className="py-2.5 px-4 rounded-xl font-semibold text-sm text-white/60 
                  bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Form */}
      {showImport && (
        <div className="px-6 pb-4">
          <div className="p-4 rounded-xl glass animate-scale-in">
            <label className="block mb-3 text-xs text-white/40">
              Paste JSON or upload file
            </label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste preset JSON here..."
              className="w-full mb-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                text-white placeholder-white/30 focus:outline-none focus:border-white/30
                font-mono text-xs transition-colors resize-none"
              rows={4}
            />
            <div className="flex gap-2 mb-3">
              <button
                onClick={handleImport}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm 
                  bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
              >
                Import
              </button>
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportText('');
                }}
                className="py-2.5 px-4 rounded-xl font-semibold text-sm text-white/60 
                  bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
            <label className="block cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              <span className="block w-full py-2.5 px-4 rounded-xl text-center text-sm font-medium
                text-white/50 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 
                hover:border-white/30 transition-all">
                Or choose file
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Presets List */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
          </div>
        ) : presets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <p className="text-white/40 font-medium">No presets yet</p>
            <p className="text-white/20 text-sm mt-1">Create your first preset</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset, index) => {
              const style = getPresetStyle(preset, index);
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApply(preset)}
                  className="group relative p-3 rounded-xl border transition-all duration-300 
                    hover:scale-[1.03] hover:shadow-lg animate-fade-up text-center"
                  style={{
                    ...('background' in style ? style : {}),
                    animationDelay: `${index * 0.02}s`,
                  }}
                >
                  {/* Delete button for custom presets */}
                  {preset.id.startsWith('preset-') && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(preset.id);
                      }}
                      className="absolute top-1 right-1 p-1 text-white/30 hover:text-rose-400 
                        hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}

                  {/* Color preview circle */}
                  <div
                    className="w-12 h-12 mx-auto rounded-full mb-2 flex items-center justify-center
                      bg-gradient-to-br from-white/10 to-white/5 border border-white/10
                      group-hover:border-white/20 transition-all"
                    style={preset.color ? {
                      background: `linear-gradient(135deg, ${preset.color}40, ${preset.color}20)`,
                      borderColor: `${preset.color}50`
                    } : {}}
                  >
                    <span className="text-xl">{preset.icon || '🎨'}</span>
                  </div>

                  {/* Name */}
                  <h3 className="text-xs font-semibold text-white truncate">{preset.name}</h3>

                  {/* Settings mini preview */}
                  <div className="flex justify-center gap-1 mt-1.5 text-[8px] font-mono text-white/30">
                    <span>B:{preset.settings.brightness}</span>
                    <span>C:{preset.settings.contrast}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
