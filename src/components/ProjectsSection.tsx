import React, { useState, useMemo } from 'react';
import { ExternalLink, Github, ChevronDown, ChevronUp, Copy, Check, Terminal, Layers, Sparkles } from 'lucide-react';
import { Project } from '../data/portfolioData';
import { PROJECTS } from '../data/portfolioData';
import { MapleLeafIcon, MushroomCapIcon } from './MapleIcons';

interface ProjectsSectionProps {
  onSelectProject?: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>('shelter-movers');
  const [copiedCloneId, setCopiedCloneId] = useState<string | null>(null);

  const categories = [
    { label: 'All Expeditions', value: 'all' },
    { label: 'Full-Stack Apps', value: 'fullstack' },
    { label: 'Cloud & Algorithms', value: 'cloud' }
  ];

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  const handleCopyClone = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    const cloneCmd = `git clone ${project.githubUrl}.git`;
    navigator.clipboard.writeText(cloneCmd);
    setCopiedCloneId(project.id);
    setTimeout(() => setCopiedCloneId(null), 2000);
  };

  return (
    <section id="projects" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 border-t border-amber-900/10">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
              <MushroomCapIcon className="w-3.5 h-3.5" />
              <span>Town Bounty Board</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Featured Projects & Built Artifacts</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Production volunteer platforms, competitive LLM arenas, and automated trading algorithms.
            </p>
          </div>

          <div className="text-xs font-mono text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-amber-900/10 shadow-2xs self-start sm:self-auto">
            <span>3 Active Artifacts</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat.value
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'bg-white hover:bg-amber-50 text-stone-700 border-amber-900/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Cards List */}
        <div className="space-y-6">
          {filteredProjects.map((project) => {
            const isExpanded = expandedProjectId === project.id;
            const isCloneCopied = copiedCloneId === project.id;

            return (
              <article
                key={project.id}
                className={`rounded-2xl border-2 bg-white transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-amber-500/60 shadow-md ring-2 ring-amber-500/10'
                    : 'border-amber-900/15 hover:border-amber-400/50 shadow-xs'
                }`}
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top Row: Bounty Title, Rank & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {project.questRank}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200">
                          {project.expReward}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-stone-900 tracking-tight pt-0.5">
                        {project.title}
                      </h3>
                      <div className="text-xs font-medium text-amber-800 font-mono">
                        {project.subtitle}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-2 pt-1 sm:pt-0">
                      <button
                        onClick={(e) => handleCopyClone(e, project)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-stone-600 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-all active:scale-95 cursor-pointer"
                        title="Copy git clone command"
                      >
                        {isCloneCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Terminal className="w-3 h-3 text-stone-400" />
                            <span>clone</span>
                          </>
                        )}
                      </button>

                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>

                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs transition-colors"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Tagline & Resume Description */}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 text-stone-700 border border-stone-200 hover:bg-amber-100 hover:border-amber-300 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Accordion Trigger for Deep Dive */}
                  <div className="pt-2 border-t border-stone-100">
                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer py-1"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isExpanded ? 'Hide Architecture & Deployment Notes' : 'View Architecture & Deployment Notes'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Expandable Deep Dive */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-dashed border-stone-200 space-y-4 text-xs">
                      <div>
                        <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Mission Context & Problem Solved</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed text-xs sm:text-sm">
                          {project.longDescription}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        {/* Architectural Highlights */}
                        <div className="p-4 rounded-xl bg-stone-50 border border-amber-900/10 space-y-2">
                          <div className="font-bold text-stone-900">
                            Engineering Architecture
                          </div>
                          <ul className="space-y-1.5 text-stone-600">
                            {project.architectureHighlights.map((hl, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Impact & Key Capabilities */}
                        <div className="p-4 rounded-xl bg-stone-50 border border-amber-900/10 space-y-2">
                          <div className="font-bold text-stone-900">
                            Key Outcomes & Features
                          </div>
                          <div className="flex flex-wrap gap-2 pb-1.5">
                            {project.metrics.map((m) => (
                              <div key={m.label} className="px-2 py-1 rounded-md bg-white border border-stone-200 text-[11px]">
                                <span className="text-stone-500 font-mono">{m.label}: </span>
                                <span className="font-bold text-amber-900 font-mono">{m.value}</span>
                              </div>
                            ))}
                          </div>
                          <ul className="space-y-1.5 text-stone-600">
                            {project.keyFeatures.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
