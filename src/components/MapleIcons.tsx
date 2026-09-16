import React from 'react';

export const MapleLeafIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-amber-600" }) => (
  <img src="/items/maple.png" alt="" aria-hidden="true" className={className} style={{ objectFit: 'contain', imageRendering: 'pixelated' }} />
);
