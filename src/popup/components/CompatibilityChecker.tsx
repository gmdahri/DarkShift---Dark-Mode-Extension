import { CompatibilityResult } from '../../types/compatibility';

interface CompatibilityCheckerProps {
  compatibility: CompatibilityResult | null;
  loading: boolean;
}

export function CompatibilityChecker({ compatibility, loading }: CompatibilityCheckerProps) {
  if (loading || !compatibility) {
    return null;
  }

  if (compatibility.compatible && !compatibility.disableToggle) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 
      border border-rose-500/20 p-4 animate-fade-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-rose-500/20 
          flex items-center justify-center">
          <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-rose-300">
            {compatibility.disableToggle ? 'Not Available' : 'Limited Support'}
          </p>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            {compatibility.message}
          </p>
          {compatibility.reason && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/30 px-2 py-0.5 rounded-md bg-white/5">
                {compatibility.reason}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
