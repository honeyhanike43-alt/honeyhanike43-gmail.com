import React from 'react';

interface LotteryContainerProps {
  onDraw: () => void;
  isShaking: boolean;
}

const LotteryContainer: React.FC<LotteryContainerProps> = ({ onDraw, isShaking }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] z-10 relative">
      <div className="relative group cursor-pointer" onClick={onDraw}>
        {/* Glow Effect behind the container */}
        <div className="absolute inset-0 bg-mystic-gold rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>

        {/* The Container SVG */}
        <div className={`relative w-64 h-80 transition-transform duration-300 ${isShaking ? 'animate-shake' : 'animate-float group-hover:scale-105'}`}>
          <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
            {/* Cylinder Body */}
            <path d="M40 50 C40 30, 160 30, 160 50 L150 250 C150 280, 50 280, 50 250 Z" 
              className="fill-slate-800 stroke-mystic-gold stroke-2" />
            
            {/* Lid/Rim Inner */}
            <ellipse cx="100" cy="50" rx="60" ry="15" className="fill-slate-900 stroke-mystic-gold stroke-2 opacity-80" />
            
            {/* Decorative Patterns */}
            <path d="M60 100 Q100 130 140 100" className="stroke-mystic-gold stroke-1 fill-none opacity-50" />
            <path d="M55 150 Q100 180 145 150" className="stroke-mystic-gold stroke-1 fill-none opacity-50" />
            <path d="M52 200 Q100 230 148 200" className="stroke-mystic-gold stroke-1 fill-none opacity-50" />

            {/* Sticks protruding */}
            <g className="transition-transform duration-500 origin-bottom" style={{ transform: isShaking ? 'translateY(-10px)' : 'translateY(0)' }}>
              <rect x="90" y="20" width="6" height="60" className="fill-amber-700 stroke-amber-900" transform="rotate(-10 93 80)" />
              <rect x="104" y="15" width="6" height="70" className="fill-amber-600 stroke-amber-900" transform="rotate(5 107 85)" />
              <rect x="95" y="25" width="6" height="55" className="fill-amber-800 stroke-amber-900" transform="rotate(15 98 80)" />
            </g>

            {/* Chinese Character for 'Divination' */}
            <text x="100" y="160" textAnchor="middle" className="fill-mystic-gold font-serif text-4xl opacity-90 select-none" style={{ filter: 'drop-shadow(0px 0px 5px rgba(212, 175, 55, 0.5))' }}>
              簽
            </text>
          </svg>
        </div>
      </div>

      <div className="mt-12 text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-display text-mystic-gold tracking-widest uppercase">
          {isShaking ? "The Stars Align..." : "Consult the Stars"}
        </h2>
        <p className="text-slate-400 font-serif italic max-w-md">
          {isShaking 
            ? "Focus on your question as the heavens shift." 
            : "Click the sacred vessel to reveal your celestial guardian."}
        </p>
      </div>
      
      {/* Interaction Button (Alternative to clicking the pot) */}
      {!isShaking && (
        <button 
          onClick={onDraw}
          className="mt-8 px-8 py-3 bg-transparent border border-mystic-gold text-mystic-gold hover:bg-mystic-gold hover:text-slate-900 transition-all duration-300 font-display tracking-widest rounded-sm uppercase text-sm"
        >
          Draw Fate
        </button>
      )}
    </div>
  );
};

export default LotteryContainer;
