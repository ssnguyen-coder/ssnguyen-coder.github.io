import { useState } from 'react';
import { MAPLE_DROPPABLE_ITEMS, type MapleItem } from '../data/mapleItems';
import { bgmPlayer } from '../utils/audioSynth';
import { MapleModal } from './MapleModal';

export function MapleInventoryModal({ isOpen, onClose, inventory }: {
  isOpen: boolean;
  onClose: () => void;
  inventory: MapleItem[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const collectedIds = new Set(inventory.map(item => item.id));
  const activeItem = MAPLE_DROPPABLE_ITEMS.find(item => item.id === (hoveredId ?? selectedId));

  return (
    <MapleModal isOpen={isOpen} onClose={onClose} title="Inventory" shortcut="i">
      <div className="inventory-content">
        <div>
          <p className="inventory-progress">{inventory.length} / {MAPLE_DROPPABLE_ITEMS.length} items collected</p>
          <p className="inventory-hint">Select an item to read its story.</p>
          <div className="inventory-grid">
            {MAPLE_DROPPABLE_ITEMS.map((item, index) => {
              const collected = collectedIds.has(item.id);
              return <button
                key={item.id}
                type="button"
                className={`inventory-slot ${collected ? 'is-collected' : ''}`}
                disabled={!collected}
                aria-label={collected ? item.name : `Item ${index + 1}: not collected`}
                aria-pressed={collected ? selectedId === item.id : undefined}
                aria-controls="inventory-story"
                onPointerEnter={event => { if (event.pointerType === 'mouse' && collected) setHoveredId(item.id); }}
                onPointerLeave={() => setHoveredId(null)}
                onFocus={() => { if (collected) setSelectedId(item.id); }}
                onClick={() => { setSelectedId(item.id); setHoveredId(null); bgmPlayer.playInventoryToggle(); }}
              >
                {collected ? <img src={`/items/${item.icon}`} alt="" /> : <span>{index + 1}</span>}
              </button>;
            })}
          </div>
        </div>
        <section id="inventory-story" className="inventory-story" aria-live="polite" aria-atomic="true">
          {activeItem ? <>
            <div className="inventory-story-heading">
              <img src={`/items/${activeItem.icon}`} alt="" />
              <h3>{activeItem.name}</h3>
            </div>
            <p>{activeItem.description}</p>
          </> : <p>Defeat monsters and collect their drops to learn a little more about me.</p>}
        </section>
      </div>
    </MapleModal>
  );
}
