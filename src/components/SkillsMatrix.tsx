import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { Wand2, Shield, Database, Cloud, Sparkles, BookOpen, Check } from 'lucide-react';
import { MapleLeafIcon, MushroomCapIcon } from './MapleIcons';

export const SkillsMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wand2':
        return <Wand2 className="w-4 h-4 text-amber-600" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-orange-600" />;
      case 'Database':
        return <Database className="w-4 h-4 text-sky-600" />;
      case 'Cloud':
        return <Cloud className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  const displayedCategories = activeTab === 'all'
    ? SKILL_CATEGORIES
    : SKILL_CATEGORIES.filter((c) => c.title.toLowerCase().includes(activeTab));

  return (
    <section id="skills" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 border-t border-amber-900/10">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Adventurer Skill Tree & Equipment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Technical Stack & Mastery</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Every spell, enchanted framework, and cloud relic honed across enterprise banking and full-stack projects.
            </p>
          </div>

          {/* Quick Filter */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-amber-900/15 shadow-2xs self-start sm:self-auto text-xs font-mono">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('language')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'language' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Spells
            </button>
            <button
              onClick={() => setActiveTab('framework')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'framework' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Armor
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'database' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Tomes
            </button>
            <button
              onClick={() => setActiveTab('devops')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'devops' ? 'bg-amber-600 text-white font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              DevOps
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayedCategories.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border-2 border-amber-900/15 bg-white p-5 sm:p-6 shadow-xs hover:border-amber-400/60 transition-all space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 shadow-2xs">
                  {getIcon(group.iconName)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 tracking-tight">
                    {group.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    {group.flavor}
                  </p>
                </div>
              </div>

              {/* Skills Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      skill.highlighted
                        ? 'bg-amber-50 text-amber-950 border border-amber-300 shadow-2xs font-semibold'
                        : 'bg-stone-50 text-stone-700 border border-stone-200/80 hover:bg-stone-100'
                    }`}
                  >
                    {skill.highlighted && (
                      <MapleLeafIcon className="w-3 h-3 text-orange-600 shrink-0" />
                    )}
                    <span>{skill.name}</span>
                    {skill.tag && (
                      <span className="text-[10px] text-amber-700 font-semibold ml-0.5 px-1.5 py-0.2 rounded bg-amber-100/80">
                        {skill.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Core Principles & Guild Standards */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50/70 to-orange-50/50 border-2 border-amber-900/15 text-xs text-stone-700 space-y-3 shadow-2xs">
          <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <MushroomCapIcon className="w-4 h-4 text-amber-700" />
            <span>Core Engineering Standards at Scale</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="space-y-1 p-3 bg-white/80 rounded-xl border border-amber-900/10">
              <div className="font-bold text-amber-900">0% ➔ 80% Test Coverage</div>
              <p className="text-stone-600 leading-relaxed font-sans text-xs">
                Comprehensive automated testing with JUnit and Mockito to guarantee production reliability under heavy batch processing.
              </p>
            </div>
            <div className="space-y-1 p-3 bg-white/80 rounded-xl border border-amber-900/10">
              <div className="font-bold text-amber-900">90% Fewer Vulnerabilities</div>
              <p className="text-stone-600 leading-relaxed font-sans text-xs">
                Automated security gates using GitHub Actions, SonarQube, and Snyk protecting 15+ distributed microservices.
              </p>
            </div>
            <div className="space-y-1 p-3 bg-white/80 rounded-xl border border-amber-900/10">
              <div className="font-bold text-amber-900">20% Database Latency Cut</div>
              <p className="text-stone-600 leading-relaxed font-sans text-xs">
                Optimized relational schemas and query paths during high-stakes MySQL to Oracle production migrations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
