import React, { useMemo } from 'react';
import { MapleLeafIcon } from './MapleIcons';

interface LeafParticle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  animationClass: string;
  opacity: number;
}

export const FloatingLeaves: React.FC = () => {
  const leaves: LeafParticle[] = useMemo(() => {
    const animations = ['animate-leaf-fall-1', 'animate-leaf-fall-2', 'animate-leaf-fall-3'];
    return Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      left: Math.round(5 + (i * 10.5) + (Math.random() * 5)),
      delay: Number((i * 1.8).toFixed(1)),
      duration: Math.round(14 + Math.random() * 8),
      size: Math.round(16 + Math.random() * 12),
      rotation: Math.round(Math.random() * 360),
      animationClass: animations[i % 3],
      opacity: Number((0.25 + Math.random() * 0.25).toFixed(2)),
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className={`absolute text-amber-600/40 ${leaf.animationClass}`}
          style={{
            left: `${leaf.left}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            opacity: leaf.opacity,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            transform: `rotate(${leaf.rotation}deg)`,
          }}
        >
          <MapleLeafIcon className="w-full h-full" />
        </div>
      ))}
    </div>
  );
};
