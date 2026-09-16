import { Download } from 'lucide-react';
import { MapleModal } from './MapleModal';

const RESUME_PATH = '/Nguyen_Resume.pdf';
const RESUME_VIEW_PATH = `${RESUME_PATH}#toolbar=0&navpanes=0&view=FitH`;

export function ResumeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <MapleModal isOpen={isOpen} onClose={onClose} title="Resume" className="resume-modal"
      actions={<a href={RESUME_PATH} download="Nguyen_Resume.pdf" className="maple-hud-button maple-hud-primary">
        <Download size={14} aria-hidden="true" /> Download
      </a>}
    >
      <div className="resume-preview">
        <iframe src={RESUME_VIEW_PATH} title="Resume PDF preview" />
      </div>
    </MapleModal>
  );
}
