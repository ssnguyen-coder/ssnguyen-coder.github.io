export type ProjectCategory = 'all' | 'fullstack' | 'cloud' | 'devtools' | 'mobile';

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: 'fullstack' | 'cloud' | 'devtools' | 'mobile';
  featured: boolean;
  tags: string[];
  metrics: ProjectMetric[];
  githubUrl: string;
  liveDemoUrl?: string;
  architectureHighlights: string[];
  keyFeatures: string[];
  demoSimulatorType?: 'eventStream' | 'restApi' | 'cacheMetrics';
  badge: string;
  year: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface SkillItem {
  name: string;
  level: number; // 1-100
  category: string;
  highlighted?: boolean;
}

export interface SkillGroup {
  category: string;
  description: string;
  skills: SkillItem[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  handle: string;
}
