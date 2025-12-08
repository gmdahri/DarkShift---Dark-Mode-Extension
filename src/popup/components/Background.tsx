export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#08080c]">
      {/* Ambient gradient orbs */}
      <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full 
        bg-gradient-to-br from-rose-500/20 via-orange-500/15 to-transparent 
        blur-3xl animate-float" />
      <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full 
        bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-transparent 
        blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full 
        bg-gradient-to-br from-purple-500/10 to-pink-500/10 
        blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(at 40% 20%, rgba(255, 107, 107, 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 0%, rgba(254, 202, 87, 0.08) 0px, transparent 50%),
            radial-gradient(at 0% 50%, rgba(72, 219, 251, 0.08) 0px, transparent 50%),
            radial-gradient(at 80% 50%, rgba(162, 155, 254, 0.06) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(253, 121, 168, 0.08) 0px, transparent 50%)
          `
        }}
      />
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Top edge glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r 
        from-transparent via-rose-500/50 to-transparent" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
