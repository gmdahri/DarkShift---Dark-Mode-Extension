import { useState, useEffect } from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import { useSiteCompatibility } from './hooks/useSiteCompatibility';
import { useSettings } from './hooks/useSettings';
import { ToggleSwitch } from './components/ToggleSwitch';
import { StatusIndicator } from './components/StatusIndicator';
import { SiteCard } from './components/SiteCard';
import { CompatibilityChecker } from './components/CompatibilityChecker';
import { SettingsPanel } from './components/SettingsPanel';
import { SiteListManager } from './components/SiteListManager';
import { PresetManager } from './components/PresetManager';
import { Background } from './components/Background';

export function Popup() {
  const { enabled, domain, loading, applying, toggleDarkMode } = useDarkMode();
  const { compatibility, state, loading: compatibilityLoading, refresh } = useSiteCompatibility();
  const { settings, updateSettings, resetSettings, domain: settingsDomain } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showSiteList, setShowSiteList] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const handleToggle = async (value: boolean) => {
    try {
      await toggleDarkMode(value);
      setTimeout(() => refresh(), 100);
    } catch (error) {
      console.error('Toggle failed:', error);
    }
  };

  const isDisabled = compatibility?.disableToggle ?? false;

  // Close settings panel when dark mode is disabled
  useEffect(() => {
    if (!enabled || isDisabled) {
      setShowSettings(false);
    }
  }, [enabled, isDisabled]);

  return (
    <div className="relative w-[360px] min-h-[480px] overflow-hidden">
      <Background />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-orange-400 to-amber-400 
                flex items-center justify-center shadow-lg animate-pulse-glow">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-400/20 -z-10 blur-sm" />
            </div>
            
            <div>
              <h1 className="text-xl font-bold gradient-text tracking-tight">DarkShift</h1>
              <p className="text-xs text-white/40 font-medium mt-0.5">Dark Mode Extension</p>
            </div>
          </div>
          
        </div>

        <div className="space-y-4">
          {/* Site Card */}
          <SiteCard 
            domain={domain} 
            compatibility={compatibility}
            loading={compatibilityLoading}
          />

          {/* Main Toggle Card */}
          <div className="rounded-2xl glass p-5 animate-fade-up stagger-2 card-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
                  ${enabled 
                    ? 'bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30' 
                    : 'bg-white/5 border border-white/10'}`}>
                  {enabled ? (
                    <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`text-base font-semibold transition-colors duration-300
                    ${enabled ? 'text-white' : 'text-white/60'}`}>
                    {enabled ? 'Dark Mode Active' : 'Dark Mode Off'}
                  </p>
                  <StatusIndicator state={state} />
                </div>
              </div>
              <ToggleSwitch
                enabled={enabled}
                disabled={isDisabled || loading || applying}
                onChange={handleToggle}
              />
            </div>

            {(loading || applying) && (
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                <div className="w-5 h-5 rounded-full border-2 border-rose-500/30 border-t-rose-500 animate-spin" />
                <span className="text-sm text-white/40 font-medium">
                  {applying ? 'Applying changes...' : 'Loading...'}
                </span>
              </div>
            )}

            {/* Settings button - only show when dark mode is enabled */}
            {enabled && !isDisabled && !loading && !applying && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`w-full mt-4 pt-4 border-t border-white/5 flex items-center justify-between 
                  group transition-all duration-300 ${showSettings ? 'pb-2' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                    ${showSettings 
                      ? 'bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30' 
                      : 'bg-white/5 border border-white/10 group-hover:bg-white/10'}`}>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${showSettings ? 'rotate-90 text-rose-400' : 'text-white/40 group-hover:text-white'}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" 
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold transition-colors duration-300
                      ${showSettings ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                      Fine-tune Settings
                    </p>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      {showSettings ? 'Hide adjustments' : 'Adjust brightness, contrast & more'}
                    </p>
                  </div>
                </div>
                <svg className={`w-4 h-4 transition-transform duration-300 ${showSettings ? 'rotate-180 text-white' : 'text-white/30 group-hover:text-white/50'}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="rounded-2xl glass p-5 animate-scale-in">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500/20 to-amber-500/20 
                  flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white">Fine-tune</span>
              </div>
              <SettingsPanel 
                settings={settings}
                onUpdate={updateSettings}
                onReset={resetSettings}
              />
            </div>
          )}

          {/* Compatibility Error */}
          <CompatibilityChecker 
            compatibility={compatibility}
            loading={compatibilityLoading}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 animate-fade-up stagger-4">
            <button
              onClick={() => setShowPresets(true)}
              className="group rounded-2xl glass p-4 card-hover text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 
                  flex items-center justify-center border border-violet-500/20
                  group-hover:border-violet-500/40 transition-colors">
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                    Presets
                  </p>
                  <p className="text-[11px] text-white/40 mt-0.5">Themes & styles</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowSiteList(true)}
              className="group rounded-2xl glass p-4 card-hover text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 
                  flex items-center justify-center border border-cyan-500/20
                  group-hover:border-cyan-500/40 transition-colors">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    Site Lists
                  </p>
                  <p className="text-[11px] text-white/40 mt-0.5">Allow & block</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/5 animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/30 font-medium">DarkShift</p>
              <p className="text-[9px] text-white/20 mt-0.5">Dark Mode Extension v1.0.0</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5">
              <kbd className="text-[9px] text-white/40 font-mono">⌘</kbd>
              <span className="text-[9px] text-white/30">+</span>
              <kbd className="text-[9px] text-white/40 font-mono">⇧</kbd>
              <span className="text-[9px] text-white/30">+</span>
              <kbd className="text-[9px] text-white/40 font-mono">D</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {showSiteList && (
        <SiteListManager onClose={() => setShowSiteList(false)} />
      )}

      {showPresets && settingsDomain && (
        <PresetManager domain={settingsDomain} onClose={() => setShowPresets(false)} />
      )}
    </div>
  );
}
