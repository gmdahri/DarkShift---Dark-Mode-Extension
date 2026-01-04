import { useState, useEffect } from 'react';
import { ScheduleSettings as ScheduleSettingsType, DEFAULT_SCHEDULE } from '../../utils/constants';
import { getScheduleSettings, setScheduleSettings, getFollowSystemTheme, setFollowSystemTheme } from '../../utils/schedule';

interface ScheduleSettingsProps {
  onClose: () => void;
}

export function ScheduleSettings({ onClose }: ScheduleSettingsProps) {
  const [schedule, setSchedule] = useState<ScheduleSettingsType>(DEFAULT_SCHEDULE);
  const [followSystem, setFollowSystem] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [scheduleData, systemData] = await Promise.all([
        getScheduleSettings(),
        getFollowSystemTheme(),
      ]);
      setSchedule(scheduleData);
      setFollowSystem(systemData);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = async (updates: Partial<ScheduleSettingsType>) => {
    const newSchedule = { ...schedule, ...updates };
    setSchedule(newSchedule);
    await setScheduleSettings(newSchedule);
  };

  const handleFollowSystemChange = async (enabled: boolean) => {
    setFollowSystem(enabled);
    await setFollowSystemTheme(enabled);
    // Disable schedule if following system
    if (enabled && schedule.enabled) {
      await handleScheduleChange({ enabled: false });
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
      <div className="w-[340px] max-h-[90%] mx-4 rounded-3xl glass border border-white/10 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 
              flex items-center justify-center border border-violet-500/30">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Schedule & Automation</h2>
              <p className="text-[11px] text-white/40">Auto-enable dark mode</p>
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
        <div className="p-5 space-y-5 max-h-[400px] overflow-y-auto">
          {/* Follow System Theme */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 
                  flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Follow System Theme</p>
                  <p className="text-[11px] text-white/40">Match your OS appearance</p>
                </div>
              </div>
              <button
                onClick={() => handleFollowSystemChange(!followSystem)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  followSystem 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                    : 'bg-white/10'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 ${
                  followSystem ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Schedule Toggle */}
          <div className={`rounded-xl bg-white/5 border border-white/10 p-4 transition-opacity ${
            followSystem ? 'opacity-50 pointer-events-none' : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 
                  flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Scheduled Mode</p>
                  <p className="text-[11px] text-white/40">Enable at specific times</p>
                </div>
              </div>
              <button
                onClick={() => handleScheduleChange({ enabled: !schedule.enabled })}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                  schedule.enabled 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                    : 'bg-white/10'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 ${
                  schedule.enabled ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>

            {/* Time Settings */}
            {schedule.enabled && (
              <div className="space-y-4 pt-4 border-t border-white/10 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-[11px] text-white/40 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => handleScheduleChange({ startTime: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white bg-white/5 border border-white/10 
                        rounded-lg focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="pt-6 text-white/30">→</div>
                  <div className="flex-1">
                    <label className="block text-[11px] text-white/40 mb-2">End Time</label>
                    <input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => handleScheduleChange({ endTime: e.target.value })}
                      className="w-full px-3 py-2 text-sm text-white bg-white/5 border border-white/10 
                        rounded-lg focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-white/30 text-center">
                  Dark mode active from {schedule.startTime} to {schedule.endTime}
                </p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 
            border border-violet-500/20 p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-violet-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Pro Tip</p>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Schedule dark mode for evening hours to reduce eye strain and improve sleep quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


