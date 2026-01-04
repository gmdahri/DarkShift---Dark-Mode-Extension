import { useState, useEffect } from 'react';
import { getShowFloatingButton, setShowFloatingButton } from '../../utils/schedule';

interface AdvancedSettingsProps {
  onClose: () => void;
}

export function AdvancedSettings({ onClose }: AdvancedSettingsProps) {
  const [showFab, setShowFab] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const fabEnabled = await getShowFloatingButton();
      setShowFab(fabEnabled);
    } finally {
      setLoading(false);
    }
  };

  const handleFabChange = async (enabled: boolean) => {
    setShowFab(enabled);
    await setShowFloatingButton(enabled);

    // Notify content script to show/hide FAB
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: enabled ? 'SHOW_FAB' : 'HIDE_FAB',
        });
      }
    } catch (error) {
      console.error('Failed to toggle FAB:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-5 h-5 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-[340px] mx-4 rounded-3xl glass border border-white/10 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 
              flex items-center justify-center border border-emerald-500/30">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Advanced Settings</h2>
              <p className="text-[11px] text-white/40">Extra options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/40 hover:text-white/60 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Floating Button Toggle */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-rose-500/20 
                  flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Floating Button</p>
                  <p className="text-[11px] text-white/40">Quick toggle on pages</p>
                </div>
              </div>
              <button
                onClick={() => handleFabChange(!showFab)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${showFab
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                    : 'bg-white/10'
                  }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 ${showFab ? 'left-7' : 'left-1'
                  }`} />
              </button>
            </div>
            <p className="mt-3 text-[11px] text-white/30">
              Shows a floating button on every page for quick dark mode toggle
            </p>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 
                flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-white">Keyboard Shortcuts</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/50">Toggle dark mode</span>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5">
                  <kbd className="text-[10px] text-white/60 font-mono">⌘</kbd>
                  <span className="text-[10px] text-white/30">+</span>
                  <kbd className="text-[10px] text-white/60 font-mono">⇧</kbd>
                  <span className="text-[10px] text-white/30">+</span>
                  <kbd className="text-[10px] text-white/60 font-mono">D</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/50">Toggle global</span>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5">
                  <kbd className="text-[10px] text-white/60 font-mono">⌘</kbd>
                  <span className="text-[10px] text-white/30">+</span>
                  <kbd className="text-[10px] text-white/60 font-mono">⇧</kbd>
                  <span className="text-[10px] text-white/30">+</span>
                  <kbd className="text-[10px] text-white/60 font-mono">K</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center pt-2">
            <p className="text-[10px] text-white/20">Dark Mode Pro v1.1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}


