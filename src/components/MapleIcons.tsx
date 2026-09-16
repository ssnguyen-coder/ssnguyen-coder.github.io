import React from 'react';

export const MapleLeafIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-amber-600" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Stylized Maple Leaf */}
    <path d="M12 2C11.5 4 10.5 5.5 9 6.5C8 5 6.5 4.5 5 5C5.8 7 5.2 8.5 4 9.5C2.5 9 1 10 1.5 12C3 12.2 4 13.5 4 15C3 16 3.5 17.5 5 17.5C6 16.5 7.5 16.5 8.5 17.5C8.8 19 9.5 20 11 20.5V23H13V20.5C14.5 20 15.2 19 15.5 17.5C16.5 16.5 18 16.5 19 17.5C20.5 17.5 21 16 20 15C20 13.5 21 12.2 22.5 12C23 10 21.5 9 20 9.5C18.8 8.5 18.2 7 19 5C17.5 4.5 16 5 15 6.5C13.5 5.5 12.5 4 12 2Z" />
  </svg>
);

export const MushroomCapIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5 text-amber-700" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Cozy mushroom cap */}
    <path d="M12 3C6 3 2 7.5 2 13C2 14.5 3 15 4.5 15C6 15 8 13.5 12 13.5C16 13.5 18 15 19.5 15C21 15 22 14.5 22 13C22 7.5 18 3 12 3Z" />
    <circle cx="8" cy="8" r="1.5" fill="white" fillOpacity="0.8" />
    <circle cx="15" cy="7" r="1.2" fill="white" fillOpacity="0.8" />
    <circle cx="12" cy="10" r="1" fill="white" fillOpacity="0.8" />
    <path d="M9 14.5V19C9 20.5 10.5 21.5 12 21.5C13.5 21.5 15 20.5 15 19V14.5C13.5 14 10.5 14 9 14.5Z" fill="#D4A373" />
  </svg>
);

export const FloatingLeaves: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 opacity-40 select-none" aria-hidden="true">
      <div className="absolute top-[8%] left-[5%] animate-leaf-fall-1 text-amber-500/60">
        <MapleLeafIcon className="w-5 h-5 transform -rotate-12" />
      </div>
      <div className="absolute top-[25%] right-[7%] animate-leaf-fall-2 text-orange-500/50">
        <MapleLeafIcon className="w-6 h-6 transform rotate-45" />
      </div>
      <div className="absolute top-[55%] left-[12%] animate-leaf-fall-3 text-red-500/40">
        <MapleLeafIcon className="w-4 h-4 transform rotate-18" />
      </div>
      <div className="absolute top-[75%] right-[10%] animate-leaf-fall-1 text-amber-600/50">
        <MapleLeafIcon className="w-5 h-5 transform -rotate-45" />
      </div>
    </div>
  );
};
