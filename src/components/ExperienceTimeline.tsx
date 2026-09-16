import React from 'react';
import { Calendar, MapPin, CheckCircle2, GraduationCap, Sparkles, Scroll, Award, ShieldCheck, ChevronRight } from 'lucide-react';
import { EXPERIENCES, PERSONAL_INFO } from '../data/portfolioData';
import { MapleLeafIcon, MushroomCapIcon } from './MapleIcons';

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="experience" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 border-t border-amber-900/10">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
              <Scroll className="w-3.5 h-3.5 text-amber-700" />
              <span>Adventurer Quest Log</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
              <span>Work Experience & Completed Raids</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Real-world engineering campaigns at RBC (Royal Bank of Canada) delivering high-throughput financial scale.
            </p>
          </div>

          <div className="text-xs font-mono text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-amber-900/10 shadow-2xs self-start sm:self-auto">
            <span>Server: </span>
            <span className="font-bold text-stone-800">Toronto, ON</span>
          </div>
        </div>

        {/* Quest List */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 sm:before:left-3.5 before:w-0.5 before:bg-amber-900/15">
          {EXPERIENCES.map((exp) => {
            const isActive = exp.questStatus === 'Active';

            return (
              <div key={exp.id} className="relative pl-8 sm:pl-9 group">
                {/* Timeline node badge */}
                <div
                  className={`absolute left-1.5 sm:left-1.5 top-2.5 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    isActive
                      ? 'bg-amber-500 border-amber-200 text-white animate-pulse'
                      : 'bg-emerald-600 border-emerald-100 text-white'
                  } shadow-xs`}
                >
                  <MapleLeafIcon className="w-2.5 h-2.5" />
                </div>

                {/* Quest Card */}
                <div className="p-5 sm:p-6 rounded-2xl border-2 border-amber-900/15 bg-white shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all space-y-4 relative overflow-hidden">
                  {/* Quest Banner Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-amber-900/10">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          {exp.questRank}
                        </span>
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                            isActive
                              ? 'bg-orange-100 text-orange-900 border-orange-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          {isActive ? '⚔️ Current Raid' : '★ Quest Clear'}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-stone-900 pt-1">
                        {exp.role}{' '}
                        <span className="text-stone-400 font-normal">at</span>{' '}
                        <span className="text-amber-800 font-extrabold">{exp.company}</span>
                      </h3>

                      <div className="text-xs font-mono text-stone-500 flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {exp.period}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Quest Title / EXP Tag */}
                    <div className="text-right self-start sm:self-auto">
                      <div className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                        {exp.expEarned}
                      </div>
                    </div>
                  </div>

                  {/* Narrative description */}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                    {exp.description}
                  </p>

                  {/* Key Quest Deliverables & Metrics */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900">
                      Core Raid Achievements & Deliverables:
                    </div>
                    {exp.achievements.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-normal">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Inventory Tech Used */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-stone-400 mr-1">Equipped Tech:</span>
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 text-stone-700 border border-stone-200 hover:bg-amber-100 hover:border-amber-300 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Education & Origin Story (University of Toronto) */}
          <div className="relative pl-8 sm:pl-9">
            <div className="absolute left-1.5 sm:left-1.5 top-2.5 -translate-x-1/2 w-5 h-5 rounded-full bg-stone-800 border-2 border-stone-100 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-2.5 h-2.5 text-white" />
            </div>

            <div className="p-5 rounded-2xl border-2 border-amber-900/15 bg-gradient-to-r from-stone-50 to-amber-50/40 text-xs sm:text-sm space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-base">
                  <span>{PERSONAL_INFO.education.degree}</span>
                </div>
                <div className="text-xs font-mono text-stone-600 font-semibold">
                  {PERSONAL_INFO.education.school} • {PERSONAL_INFO.education.period}
                </div>
              </div>
              <p className="text-stone-600 text-xs leading-relaxed">
                {PERSONAL_INFO.education.details}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
