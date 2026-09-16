import React, { useState, useEffect } from 'react';
import { X, Github, ExternalLink, Activity, Server, Layers, Play, Pause, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  // Simulator state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedEvents, setSimulatedEvents] = useState<Array<{ id: string; time: string; topic: string; size: string; latency: number }>>([]);
  const [cacheHits, setCacheHits] = useState(42);
  const [cacheMisses, setCacheMisses] = useState(3);
  const [activeTab, setActiveTab] = useState<'architecture' | 'simulator' | 'features'>('architecture');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Event stream simulator timer
  useEffect(() => {
    if (!isSimulating) return;

    const topics = ['orders.checkout.v1', 'telemetry.metrics.p99', 'auth.token.refresh', 'inventory.sync'];
    const interval = setInterval(() => {
      const newEvent = {
        id: 'evt_' + Math.random().toString(36).substring(2, 8),
        time: new Date().toLocaleTimeString(),
        topic: topics[Math.floor(Math.random() * topics.length)],
        size: (Math.random() * 2.4 + 0.4).toFixed(2) + ' KB',
        latency: Math.floor(Math.random() * 22) + 8
      };
      setSimulatedEvents(prev => [newEvent, ...prev.slice(0, 7)]);
    }, 900);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const testCacheGet = () => {
    const isHit = Math.random() > 0.15;
    if (isHit) {
      setCacheHits(prev => prev + 1);
    } else {
      setCacheMisses(prev => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl border border-stone-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-stone-50 border-b border-stone-200">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-900 text-stone-100 font-mono">
                  {project.badge}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-200 text-stone-700 font-mono">
                  {project.year}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                {project.title}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 font-medium">
                {project.tagline}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Metrics strip */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-stone-200/80">
            {project.metrics.map((m) => (
              <div key={m.label} className="p-2.5 rounded-lg bg-white border border-stone-200/80 shadow-2xs">
                <div className="text-xs text-stone-500 font-medium">{m.label}</div>
                <div className="text-base sm:text-lg font-bold text-stone-900 font-mono">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-stone-200 bg-white px-6 sm:px-8 text-xs font-medium">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'architecture'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Architecture & Deep Dive
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'simulator'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === 'features'
                ? 'border-stone-900 text-stone-900 font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Features & Capabilities
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Project Overview</h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {project.longDescription}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">Key Technical Challenges & Solutions</h3>
                <div className="space-y-2.5">
                  {project.architectureHighlights.map((arch, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-800">
                      <Layers className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                      <span>{arch}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Technology Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-mono bg-stone-100 text-stone-800 border border-stone-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'simulator' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-950 text-stone-200 border border-stone-800 font-mono text-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-stone-300 font-bold">{project.title} Telemetry Sandbox</span>
                  </div>
                  <span className="text-[11px] text-stone-500">Live Client Mock</span>
                </div>

                {project.demoSimulatorType === 'cacheMetrics' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                        <div className="text-[11px] text-stone-400">Cache Hits</div>
                        <div className="text-xl font-bold text-emerald-400">{cacheHits}</div>
                      </div>
                      <div className="p-3 bg-stone-900 rounded-lg border border-stone-800">
                        <div className="text-[11px] text-stone-400">Cache Misses</div>
                        <div className="text-xl font-bold text-amber-400">{cacheMisses}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-stone-400">
                        Hit Ratio: <span className="text-stone-100 font-bold">{((cacheHits / (cacheHits + cacheMisses)) * 100).toFixed(1)}%</span>
                      </div>
                      <button
                        onClick={testCacheGet}
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold active:scale-95 transition-all"
                      >
                        Simulate GET Key
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-stone-400 text-xs">
                        Streaming event buffer: {simulatedEvents.length} events logged
                      </div>
                      <button
                        onClick={() => setIsSimulating(!isSimulating)}
                        className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isSimulating
                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isSimulating ? 'Pause Stream' : 'Start Streaming'}</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-44 overflow-y-auto pt-1">
                      {simulatedEvents.length === 0 ? (
                        <div className="text-stone-500 text-center py-6 text-xs">
                          Click "Start Streaming" to simulate live event ingestion through {project.title}
                        </div>
                      ) : (
                        simulatedEvents.map((evt) => (
                          <div key={evt.id} className="flex items-center justify-between px-2.5 py-1.5 bg-stone-900/90 rounded border border-stone-800 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400 font-bold">200 OK</span>
                              <span className="text-stone-300">{evt.topic}</span>
                            </div>
                            <div className="flex items-center gap-3 text-stone-400">
                              <span>{evt.size}</span>
                              <span className="text-sky-400 font-semibold">{evt.latency}ms</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Core Implemented Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.keyFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-stone-50 border border-stone-200/80 text-xs text-stone-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold transition-all shadow-xs"
            >
              <Github className="w-4 h-4" />
              <span>View Source on GitHub</span>
            </a>
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-medium transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Demo</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
