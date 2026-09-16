import { MapleModal } from './MapleModal';
import { ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';

const projects = [
  {
    title: 'aibattle.ai',
    category: 'Slopsquatting scanner',
    description: 'A free security scanner that helps developers uncover supply chain threats in AI-generated code. Scan any GitHub repository to identify hallucinated npm and PyPI package names registered by attackers.',
    url: 'https://aibattle.ai/',
    Icon: ShieldCheck,
  },
  {
    title: 'GradeTracker',
    category: 'Student dashboard',
    description: 'An academic planning dashboard that turns grade tracking into a clear path toward GPA goals. Bring courses, grades, and school events into one place, monitor academic progress, and calculate the results needed to reach a target GPA.',
    url: 'https://gradetracker-eight.vercel.app/',
    Icon: GraduationCap,
  },
];

export function ProjectsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <MapleModal isOpen={isOpen} onClose={onClose} title="Projects">
        <div className="projects-list">
          {projects.map(({ title, category, description, url, Icon }) => (
            <article className="project-card" key={url}>
              <div className="project-card-heading">
                <span className="project-card-icon"><Icon size={24} aria-hidden="true" /></span>
                <div><p className="project-category">{category}</p><h3>{title}</h3></div>
              </div>
              <p className="project-description">{description}</p>
              <div className="project-card-footer">
                <a className="maple-hud-button maple-hud-primary" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${title} (opens in a new tab)`}>Visit site <ExternalLink size={13} aria-hidden="true" /></a>
              </div>
            </article>
          ))}
        </div>
    </MapleModal>
  );
}
