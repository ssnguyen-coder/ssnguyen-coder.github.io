import React, { useState } from 'react';
import { X, Sparkles, Coins, Info } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'Equip' | 'Use' | 'Etc' | 'Setup'>('Equip');
  const [hoveredItem, setHoveredItem] = useState<MapleItem | null>(null);

  if (!isOpen) return null;

  const tabs: Array<'Equip' | 'Use' | 'Etc' | 'Setup'> = ['Equip', 'Use', 'Etc', 'Setup'];

  const filteredItems = inventory.filter((item) => item.type === activeTab);
  // Total 24 slots (4 cols x 6 rows) like classic MapleStory
  const totalSlots = 24;
  const slots = Array.from({ length: totalSlots }).map((_, idx) => filteredItems[idx] || null);

  const activeTooltipItem = hoveredItem || selectedItem;

  const renderItemGraphic = (icon: string, color: string) => {
    switch (icon) {
      case 'scroll-gold':
        return (
          <div className="w-8 h-8 rounded bg-amber-100 border border-amber-400 flex items-center justify-center text-amber-800 font-serif font-bold text-xs shadow-inner">
            📜
          </div>
        );
      case 'cap-emerald':
        return (
          <div className="w-8 h-8 rounded bg-emerald-100 border border-emerald-400 flex items-center justify-center text-emerald-800 text-sm shadow-inner">
            🍄
          </div>
        );
      case 'book-blue':
        return (
          <div className="w-8 h-8 rounded bg-sky-100 border border-sky-400 flex items-center justify-center text-sky-800 text-sm shadow-inner">
            📘
          </div>
        );
      case 'medal-maple':
        return (
          <div className="w-8 h-8 rounded bg-orange-100 border border-orange-400 flex items-center justify-center text-orange-700 text-sm shadow-inner">
            🍁
          </div>
        );
      case 'orb-purple':
        return (
          <div className="w-8 h-8 rounded bg-purple-100 border border-purple-400 flex items-center justify-center text-purple-700 text-sm shadow-inner">
            🔮
          </div>
        );
      case 'chip-cyan':
        return (
          <div className="w-8 h-8 rounded bg-cyan-100 border border-cyan-400 flex items-center justify-center text-cyan-800 text-sm shadow-inner">
            💾
          </div>
        );
      case 'potion-red':
        return (
          <div className="w-8 h-8 rounded bg-red-100 border border-red-400 flex items-center justify-center text-red-700 text-sm shadow-inner">
            🧪
          </div>
        );
      case 'diploma-blue':
        return (
          <div className="w-8 h-8 rounded bg-blue-100 border border-blue-400 flex items-center justify-center text-blue-900 text-sm shadow-inner">
            🎓
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700 text-sm">
            ⭐
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col md:flex-row items-start gap-4 max-w-4xl w-full justify-center"
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
              title="Close (I or Esc)"
            >
              ×
            </button>
          </div>

          {/* Navigation Tabs (Equip, Use, Etc, Setup) */}
          <div className="grid grid-cols-4 bg-[#c8beab] p-1 gap-1 border-b border-[#a89b87]">
            {tabs.map((tab) => {
              const count = inventory.filter((item) => item.type === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    bgmPlayer.playInventoryToggle();
                    setActiveTab(tab);
                  }}
                  className={`py-1 text-center text-xs font-mono font-bold rounded cursor-pointer transition-colors relative ${
                    activeTab === tab
                      ? 'bg-[#f4efe4] text-[#2c4060] shadow-xs border border-[#8a7a63]'
                      : 'bg-[#b6aa95] hover:bg-[#c2b6a1] text-stone-700'
                  }`}
                >
                  <span>{tab}</span>
                  {count > 0 && (
                    <span className="ml-1 text-[10px] px-1 py-0.2 rounded-full bg-amber-500 text-white font-mono">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Slots Area (4 cols x 6 rows) */}
          <div className="p-3 bg-[#ece4d6]">
            <div className="text-[11px] font-mono text-stone-600 mb-1.5 flex justify-between items-center">
              <span>{activeTab} Inventory ({filteredItems.length} items collected)</span>
              <span className="text-amber-800 font-bold">Hover item for lore</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#dfd4c2] rounded-lg border border-[#a89982] shadow-inner">
              {slots.map((item, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredItem(item)}
                  onClick={() => {
                    if (item) {
                      bgmPlayer.playInventoryToggle();
                      onSelectItem(item);
                    }
                  }}
                  className={`w-14 h-14 rounded-md border-2 flex items-center justify-center relative cursor-pointer transition-all ${
                    item
                      ? 'bg-white hover:bg-amber-50 border-[#8d7c65] shadow-xs hover:border-amber-600'
                      : 'bg-[#cfc3af]/50 border-dashed border-[#b3a58e]/60'
                  } ${selectedItem?.id === item?.id && item ? 'ring-2 ring-amber-500 bg-amber-100/50' : ''}`}
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

            {/* Bottom Bar: Mesos Counter (Showing $40,000 annual savings at RBC!) */}
            <div className="mt-3 p-2 bg-[#f4efe4] rounded-lg border border-[#b3a58e] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-1.5 text-stone-700 font-bold">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>Mesos Saved:</span>
              </div>
              <div className="text-amber-700 font-extrabold flex items-center gap-1">
                <span>40,000</span>
                <span className="text-[10px] text-stone-500">Meso ($USD saved/yr)</span>
              </div>
            </div>
          </div>

          {/* Quick Help Footer */}
          <div className="bg-[#bdae98] px-3 py-1.5 text-[11px] font-mono text-stone-800 border-t border-[#8e7e68] flex items-center justify-between">
            <span>Press [I] to toggle</span>
            <span className="text-amber-900 font-bold">Defeat monsters for more!</span>
          </div>
        </div>

        {/* Authentic MapleStory Item Tooltip (shows when hovering or selecting an item) */}
        {activeTooltipItem ? (
          <div className="w-full max-w-[340px] bg-[#0c1527]/95 border-2 border-amber-400 rounded-xl p-4 shadow-2xl text-white font-sans space-y-3 animate-in fade-in duration-150 backdrop-blur-md">
            {/* Title & Icon Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-amber-400/40">
              <div className="p-1 rounded-lg bg-black/50 border border-amber-400/60 shrink-0">
                {renderItemGraphic(activeTooltipItem.icon, activeTooltipItem.color)}
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-amber-300 leading-tight">
                  {activeTooltipItem.name}
                </h4>
                <div className="text-[11px] font-mono text-stone-300">
                  {activeTooltipItem.categoryName}
                </div>
                <div className="inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {activeTooltipItem.rarity}
                </div>
              </div>
            </div>

            {/* Requirement Matrix */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-black/30 p-2 rounded-lg border border-white/10">
              <div>
                <span className="text-stone-400">REQ LEV : </span>
                <span className="text-amber-300 font-bold">{activeTooltipItem.reqLevel}</span>
              </div>
              <div>
                <span className="text-stone-400">REQ JOB : </span>
                <span className="text-emerald-400 font-bold">Engineer</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-400">QUALIFICATION : </span>
                <span className="text-sky-300">{activeTooltipItem.reqJob}</span>
              </div>
            </div>

            {/* In-Game / Real Resume Stats */}
            <div className="space-y-1.5 text-xs font-mono bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                ITEM STAT ATTRIBUTES:
              </div>
              {Object.entries(activeTooltipItem.stats).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-0.5">
                  <span className="text-stone-300">{k}:</span>
                  <span className="font-bold text-emerald-300">{v}</span>
                </div>
              ))}
            </div>

            {/* Real World Impact Description */}
            <div className="text-xs space-y-1 text-stone-200 leading-relaxed font-sans">
              <div className="font-bold text-amber-300 text-[11px] font-mono">
                ENGINEERING REAL-WORLD RECORD:
              </div>
              <p className="text-xs bg-black/40 p-2 rounded border border-white/10 text-stone-300">
                {activeTooltipItem.realWorldImpact}
              </p>
            </div>

            {/* Flavor Lore */}
            <div className="pt-1 text-[11px] italic text-amber-200/80 font-sans border-t border-amber-400/20">
              "{activeTooltipItem.flavorText}"
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[340px] bg-[#0c1527]/90 border-2 border-stone-600 rounded-xl p-5 shadow-2xl text-stone-400 font-sans space-y-2 text-center backdrop-blur-md">
            <Info className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
            <h4 className="text-xs font-mono font-bold text-stone-200">No Item Selected</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Hover over any collected item slot in your inventory, or attack monsters on the map to discover more resume drops!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
