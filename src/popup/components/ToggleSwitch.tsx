interface ToggleSwitchProps {
  enabled: boolean;
  disabled?: boolean;
  onChange: (enabled: boolean) => void;
}

export function ToggleSwitch({ enabled, disabled = false, onChange }: ToggleSwitchProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange(!enabled);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-500 ease-out
        ${enabled 
          ? 'bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400' 
          : 'bg-white/5 border border-white/10'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50
      `}
      aria-label={enabled ? 'Disable dark mode' : 'Enable dark mode'}
      aria-pressed={enabled}
    >
      {/* Glow effect when enabled */}
      {enabled && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400 
          blur-md opacity-50 animate-pulse-glow" />
      )}
      
      {/* Track inner shadow */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-300
        ${enabled ? 'opacity-0' : 'opacity-100'}`}
        style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
      />
      
      {/* Thumb */}
      <span
        className={`
          relative inline-flex items-center justify-center h-6 w-6 transform rounded-full 
          transition-all duration-500 ease-out shadow-lg
          ${enabled 
            ? 'translate-x-9 bg-white' 
            : 'translate-x-1 bg-gradient-to-br from-white/20 to-white/5'}
        `}
      >
        {/* Sun/Moon icon */}
        {enabled ? (
          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-white/40" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </span>
      
      {/* Disabled lock icon */}
      {disabled && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="h-4 w-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </span>
      )}
    </button>
  );
}
