import { CompatibilityResult } from '../../types/compatibility';

interface SiteCardProps {
  domain: string;
  compatibility: CompatibilityResult | null;
  loading: boolean;
}

export function SiteCard({ domain, compatibility, loading }: SiteCardProps) {
  const getFavicon = (domain: string) => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  };

  const getStatusColor = () => {
    if (!compatibility) return 'bg-white/20';
    if (compatibility.compatible) return 'bg-emerald-500';
    return 'bg-rose-500';
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl glass card-hover p-4 animate-fade-up stagger-1">
      {/* Animated border gradient on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(254,202,87,0.1), rgba(72,219,251,0.1))',
        }}
      />
      
      {/* Content */}
      <div className="relative flex items-center gap-4">
        {/* Favicon container */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 
            flex items-center justify-center border border-white/10 overflow-hidden
            group-hover:border-white/20 transition-colors duration-300">
            {domain ? (
              <img 
                src={getFavicon(domain)} 
                alt="" 
                className="w-7 h-7 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <svg className={`w-6 h-6 text-white/30 ${domain ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          
          {/* Status indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor()} 
            border-2 border-[#08080c] flex items-center justify-center`}>
            {loading ? (
              <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
            ) : compatibility?.compatible ? (
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate tracking-tight">
            {domain || 'Unknown site'}
          </p>
          {!loading && compatibility && (
            <p className="text-xs text-white/40 mt-1 truncate font-medium">
              {compatibility.message}
            </p>
          )}
          {loading && (
            <div className="mt-2 h-2 w-24 rounded-full bg-white/10 animate-shimmer" />
          )}
        </div>
        
        {/* Arrow indicator */}
        <div className="text-white/20 group-hover:text-white/40 group-hover:translate-x-1 transition-all duration-300">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
