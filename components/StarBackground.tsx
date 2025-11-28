import React, { useEffect, useState } from 'react';

const StarBackground: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; left: number; top: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    // Generate static stars to avoid re-rendering flickering
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 3 + 1,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-celestial-dark via-slate-900 to-deep-teal opacity-90"></div>
      
      {/* Generated Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white opacity-0 animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
          }}
        />
      ))}
      
      {/* Nebula/Fog Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
    </div>
  );
};

export default StarBackground;
