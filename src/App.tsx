import { useState } from 'react';
import { ResumeModal } from './components/ResumeModal';
import { ProjectsModal } from './components/ProjectsModal';
import { FloatingLeaves } from './components/FloatingLeaves';
import { MapleGameStage } from './components/MapleGameStage';
import { MapleInventoryModal } from './components/MapleInventoryModal';
import type { MapleItem } from './data/mapleItems';

type Modal = 'resume' | 'projects' | 'inventory' | null;

export default function App() {
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [inventory, setInventory] = useState<MapleItem[]>([]);

  const handleAddItem = (newItem: MapleItem) => {
    setInventory(previous => previous.some(item => item.id === newItem.id) ? previous : [...previous, newItem]);
  };
  const closeModal = () => setActiveModal(null);

  return (
    <div className="portfolio-app">
      <FloatingLeaves />
      <MapleGameStage
        onOpenInventory={() => setActiveModal('inventory')}
        onOpenResume={() => setActiveModal('resume')}
        onOpenProjects={() => setActiveModal('projects')}
        inventory={inventory}
        onAddItem={handleAddItem}
        paused={activeModal !== null}
      />
      {activeModal === 'resume' && <ResumeModal isOpen onClose={closeModal} />}
      {activeModal === 'projects' && <ProjectsModal isOpen onClose={closeModal} />}
      {activeModal === 'inventory' && <MapleInventoryModal isOpen onClose={closeModal} inventory={inventory} />}
    </div>
  );
}
