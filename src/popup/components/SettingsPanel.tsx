import { DarkModeSettings } from '../../content/injector';
import { Slider } from './Slider';

interface SettingsPanelProps {
  settings: DarkModeSettings;
  onUpdate: (settings: Partial<DarkModeSettings>) => void;
  onReset: () => void;
}

export function SettingsPanel({ settings, onUpdate, onReset }: SettingsPanelProps) {
  return (
    <div className="space-y-5">
      <Slider
        label="Brightness"
        value={settings.brightness}
        min={50}
        max={150}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
        onChange={(value) => onUpdate({ brightness: value })}
      />
      
      <Slider
        label="Contrast"
        value={settings.contrast}
        min={50}
        max={150}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.3" />
          </svg>
        }
        onChange={(value) => onUpdate({ contrast: value })}
      />
      
      <Slider
        label="Warmth"
        value={settings.sepia}
        min={0}
        max={100}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
        }
        onChange={(value) => onUpdate({ sepia: value })}
      />
      
      <Slider
        label="Grayscale"
        value={settings.grayscale}
        min={0}
        max={100}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
        onChange={(value) => onUpdate({ grayscale: value })}
      />
      
      <button
        onClick={onReset}
        className="w-full mt-3 px-4 py-2.5 text-sm font-semibold text-white/60 
          bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20
          transition-all duration-300 hover:text-white group"
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" 
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset to Default
        </span>
      </button>
    </div>
  );
}
