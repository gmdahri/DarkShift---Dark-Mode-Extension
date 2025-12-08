import { CompatibilityState } from '../../types/compatibility';

interface StatusIndicatorProps {
  state: CompatibilityState;
}

export function StatusIndicator({ state }: StatusIndicatorProps) {
  const getConfig = () => {
    switch (state) {
      case 'compatible':
        return {
          color: 'bg-emerald-500',
          glow: 'shadow-emerald-500/50',
          text: 'Active',
          textColor: 'text-emerald-400',
          pulse: true,
        };
      case 'checking':
        return {
          color: 'bg-amber-500',
          glow: 'shadow-amber-500/50',
          text: 'Checking...',
          textColor: 'text-amber-400',
          pulse: true,
        };
      case 'incompatible':
        return {
          color: 'bg-rose-500',
          glow: 'shadow-rose-500/50',
          text: 'Incompatible',
          textColor: 'text-rose-400',
          pulse: false,
        };
      case 'partial':
        return {
          color: 'bg-amber-500',
          glow: 'shadow-amber-500/50',
          text: 'Partial support',
          textColor: 'text-amber-400',
          pulse: false,
        };
      default:
        return {
          color: 'bg-white/30',
          glow: '',
          text: 'Unknown',
          textColor: 'text-white/40',
          pulse: false,
        };
    }
  };

  const config = getConfig();

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="relative flex items-center justify-center">
        <div className={`w-2 h-2 rounded-full ${config.color} ${config.glow} shadow-lg`} />
        {config.pulse && (
          <div className={`absolute w-2 h-2 rounded-full ${config.color} animate-ping opacity-75`} />
        )}
      </div>
      <span className={`text-xs font-medium ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
}
