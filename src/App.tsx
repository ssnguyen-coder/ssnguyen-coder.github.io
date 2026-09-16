import React, { useState } from 'react';
import { ResumeModal } from './components/ResumeModal';
import { FloatingLeaves } from './components/FloatingLeaves';
import { MapleGameStage } from './components/MapleGameStage';
import { MapleInventoryModal } from './components/MapleInventoryModal';
import { MapleItem, MAPLE_DROPPABLE_ITEMS } from './data/mapleItems';

export default function App() {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  // Initial starter item in bag (UofT Diploma), more drop from attacking monsters!
  const [inventory, setInventory] = useState<MapleItem[]>([
    MAPLE_DROPPABLE_ITEMS[7], // University of Toronto B.S. Diploma
    MAPLE_DROPPABLE_ITEMS[1], // Enchanted Cap of Spring Boot Microservices
  ]);

  const [selectedInventoryItem, setSelectedInventoryItem] = useState<MapleItem | null>(null);

  const handleAddItem = (newItem: MapleItem) => {
    setInventory((prev) => {
      if (prev.some((item) => item.id === newItem.id)) {
        return prev;
      }
      return [newItem, ...prev];
    });
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#162132] text-stone-900 selection:bg-amber-300 selection:text-amber-950 font-sans relative select-none">
      {/* Whimsical Falling Maple Leaves Ambience */}
      <FloatingLeaves />

      {/* FULL-SCREEN MAPLESTORY MAP APP: Header at top of map, 2D interactive canvas in center, Footer HUD at bottom of map */}
      <MapleGameStage
        onOpenInventory={() => setInventoryOpen(open => !open)}
        onOpenResume={() => setResumeModalOpen(true)}
        inventory={inventory}
        onAddItem={handleAddItem}
        paused={inventoryOpen || resumeModalOpen}
      />

      {/* Printable / Viewable Resume Modal (Exact real resume from PDF) */}
      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />

      {/* Classic MapleStory Item Inventory Window (Toggled via [I] or on-screen button) */}
      <MapleInventoryModal
        isOpen={inventoryOpen}
        onClose={() => setInventoryOpen(false)}
        inventory={inventory}
        selectedItem={selectedInventoryItem}
        onSelectItem={(item) => setSelectedInventoryItem(item)}
      />
    </div>
  );
}
