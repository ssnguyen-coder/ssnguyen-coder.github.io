import React, { useState } from 'react';
import { MapleItem } from '../data/mapleItems';
import { MapleLeafIcon } from './MapleIcons';
import { bgmPlayer } from '../utils/audioSynth';

interface MapleInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: MapleItem[];
  selectedItem: MapleItem | null;
  onSelectItem: (item: MapleItem | null) => void;
}

export const MapleInventoryModal: React.FC<MapleInventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  selectedItem,
  onSelectItem,
}) => {
  const [hoveredItem, setHoveredItem] = useState<MapleItem | null>(null);

  if (!isOpen) return null;

  const totalSlots = 12;
  const slots = Array.from({ length: totalSlots }, (_, idx) => inventory[idx] || null);

  // Details are transient: hovering a loot slot is the only way to show them.
  const activeTooltipItem = hoveredItem;

  const renderItemGraphic = (icon: string, color: string) => {
    const iconFile: Record<string, string> = {
      'scroll-gold': 'scroll.png', 'cap-emerald': 'leaf.png',
      'book-blue': 'book.png', 'medal-maple': 'maple.png',
      'orb-purple': 'salon.png', 'chip-cyan': 'screw.png',
      'potion-red': 'chair.png', 'diploma-blue': 'scroll.png',
    };
    const file = icon.endsWith('.png') ? icon : (iconFile[icon] ?? 'leaf.png');
    return (
      <div className="w-8 h-8 flex items-center justify-center">
        <img src={`/items/${file}`} alt="" className="w-7 h-7 object-contain" />
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="relative w-[340px] max-w-full max-h-[90dvh] overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Classic MapleStory Inventory Window */}
        <div className="w-full max-w-[340px] bg-[#d7cfbd] rounded-t-xl rounded-b-lg border-2 border-[#5c4a38] shadow-2xl overflow-hidden font-sans text-stone-900">
          {/* Classic Blue-Grey Title Bar */}
          <div className="bg-gradient-to-r from-[#2c4060] to-[#1e2c44] text-white px-3 py-1.5 flex items-center justify-between border-b-2 border-[#162132]">
            <div className="flex items-center gap-2">
              <MapleLeafIcon className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold font-mono tracking-wider">Item Inventory</span>
            </div>
            <button
              onClick={() => {
                bgmPlayer.playInventoryToggle();
                onClose();
              }}
              className="w-4 h-4 bg-red-600 hover:bg-red-500 text-white rounded flex items-center justify-center text-xs font-bold leading-none cursor-pointer"
              title="Close inventory (I)" aria-label="Close inventory"
            >
              ×
            </button>
          </div>

          <div className="bg-[#c8beab] p-1 border-b border-[#a89b87]">
            <div className="py-1.5 text-center text-xs font-mono font-bold rounded bg-[#f4efe4] text-[#2c4060] border border-[#8a7a63]">
              {inventory.length}/12 items collected
            </div>
          </div>

          {/* All collected loot */}
          <div className="p-3 bg-[#ece4d6]">
            <p className="text-[11px] text-stone-600 mb-2">Hover over loot to inspect its resume details.</p>

            <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#dfd4c2] rounded-lg border border-[#a89982] shadow-inner">
              {slots.map((item, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => item && bgmPlayer.playInventoryToggle()}
                  className={`w-14 h-14 rounded-md border-2 flex items-center justify-center relative cursor-pointer transition-all ${
                    item
                      ? 'bg-white hover:bg-amber-50 border-[#8d7c65] shadow-xs hover:border-amber-600'
                      : 'bg-[#cfc3af]/50 border-dashed border-[#b3a58e]/60'
                  }`}
                >
                  {item ? (
                    <>
                      {renderItemGraphic(item.icon, item.color)}
                      <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold text-stone-700 bg-white/80 px-1 rounded-xs">
                        1
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] text-stone-400 font-mono select-none">{idx + 1}</span>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Quick Help Footer */}
          <div className="bg-[#bdae98] px-3 py-1.5 text-[11px] font-mono text-stone-800 border-t border-[#8e7e68] flex items-center justify-between">
            <span>Press [I] to toggle</span>
            <span className="text-amber-900 font-bold">Defeat monsters for more!</span>
          </div>
        </div>

        {/* Authentic MapleStory Item Tooltip (shows when hovering or selecting an item) */}
        <div
          className={`inventory-tooltip absolute left-[calc(100%+16px)] top-0 w-[340px] max-w-[calc(100vw-32px)] bg-[#0c1527]/95 border-2 border-amber-400 rounded-xl p-4 shadow-2xl text-white font-sans space-y-3 backdrop-blur-md transition-opacity duration-150 ${activeTooltipItem ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={!activeTooltipItem}
        >
          {activeTooltipItem && <>
            {/* Title & Icon Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-amber-400/40">
              <div className="p-1 rounded-lg bg-black/50 border border-amber-400/60 shrink-0">
                {renderItemGraphic(activeTooltipItem.icon, activeTooltipItem.color)}
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-amber-300 leading-tight">
                  {activeTooltipItem.name}
                </h4>
              </div>
            </div>

            {/* In-Game / Real Resume Stats */}
            <div className="space-y-1.5 text-xs font-mono bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                HIGHLIGHTS
              </div>
              {Object.entries(activeTooltipItem.stats).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-0.5">
                  <span className="text-stone-300">{k}:</span>
                  <span className="font-bold text-emerald-300">{v}</span>
                </div>
              ))}
            </div>

            <p className="text-xs leading-relaxed text-stone-300 bg-black/30 rounded border border-white/10 p-2">
              {activeTooltipItem.description}
            </p>

            {/* Real World Impact Description */}
            <div className="text-xs space-y-1 text-stone-200 leading-relaxed font-sans">
              <div className="font-bold text-amber-300 text-[11px] font-mono">
                REAL-WORLD IMPACT
              </div>
              <p className="text-xs bg-black/40 p-2 rounded border border-white/10 text-stone-300">
                {activeTooltipItem.realWorldImpact}
              </p>
            </div>

          </>}
        </div>
      </div>
    </div>
  );
};
