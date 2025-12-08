interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  icon: React.ReactNode;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step = 1, unit = '%', icon, onChange }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="group space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-rose-400/80 group-hover:text-rose-400 transition-colors">{icon}</span>
          <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono text-sm font-semibold text-transparent bg-clip-text 
            bg-gradient-to-r from-rose-400 to-amber-400">
            {value}
          </span>
          <span className="text-xs text-white/40">{unit}</span>
        </div>
      </div>
      
      <div className="relative h-6 flex items-center">
        {/* Track background */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/5" />
        
        {/* Filled track */}
        <div 
          className="absolute left-0 h-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-400"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Glow effect */}
        <div 
          className="absolute left-0 h-1.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 blur-sm opacity-50"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full h-6 bg-transparent cursor-pointer appearance-none z-10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(255,107,107,0.6)]
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-rose-400/50
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-200
            [&::-webkit-slider-thumb]:hover:scale-125
            [&::-webkit-slider-thumb]:hover:shadow-[0_0_25px_rgba(255,107,107,0.8)]
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-rose-400/50
            [&::-moz-range-thumb]:shadow-[0_0_15px_rgba(255,107,107,0.6)]"
        />
      </div>
    </div>
  );
}
