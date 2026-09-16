import React, { useState, useEffect } from 'react';
import { ArrowUp, Heart } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { MapleLeafIcon, MushroomCapIcon } from './MapleIcons';

export const Footer: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/Toronto',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' ET'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-amber-900/30 text-xs py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 border border-amber-400 text-white flex items-center justify-center font-bold text-xs shadow-inner">
              HN
            </div>
            <div>
              <div className="font-bold text-stone-100 flex items-center gap-1.5">
                <span>{PERSONAL_INFO.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Lv.99
                </span>
              </div>
              <div className="text-stone-400 font-mono text-[11px]">
                {PERSONAL_INFO.role} @ RBC • Toronto, Canada
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 text-stone-400">
            <a href="#about" className="hover:text-amber-400 transition-colors">Character</a>
            <a href="#experience" className="hover:text-amber-400 transition-colors">Quests</a>
            <a href="#projects" className="hover:text-amber-400 transition-colors">Bounties</a>
            <a href="#skills" className="hover:text-amber-400 transition-colors">Skills</a>
            <a href="#contact" className="hover:text-amber-400 transition-colors">Whisper</a>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <MapleLeafIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>© {new Date().getFullYear()} Hung Nguyen. Built with cozy Maple warmth & TypeScript.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Toronto Realm Time: {timeStr || 'ET'}</span>
          </div>

          <div>
            <span>Toronto, ON • RBC Credit Risk Core</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
