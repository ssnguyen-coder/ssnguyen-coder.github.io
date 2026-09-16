import React, { useState } from 'react';
import { Check, Copy, FileText, Github, Linkedin, Mail, MapPin, Sparkles, Shield, Dices, Award, Zap } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { MapleLeafIcon, MushroomCapIcon } from './MapleIcons';

interface HeroProps {
  onOpenResume: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume }) => {
  const [copied, setCopied] = useState(false);
  const [diceRolling, setDiceRolling] = useState(false);
  const [rollStats, setRollStats] = useState({
    str: 18,
    dex: 18,
    int: 18,
    luk: 18,
    rollCount: 1
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRollDice = () => {
    setDiceRolling(true);
    let iterations = 0;
    const interval = setInterval(() => {
      setRollStats({
        str: Math.floor(Math.random() * 6) + 13,
        dex: Math.floor(Math.random() * 6) + 13,
        int: Math.floor(Math.random() * 6) + 13,
        luk: Math.floor(Math.random() * 6) + 13,
        rollCount: rollStats.rollCount + 1
      });
      iterations++;
      if (iterations > 6) {
        clearInterval(interval);
        // Guarantee 18s for senior engineer!
        setRollStats({
          str: 18,
          dex: 18,
          int: 18,
          luk: 18,
          rollCount: rollStats.rollCount + 1
        });
        setDiceRolling(false);
      }
    }, 60);
  };

  return (
    <section id="about" className="pt-28 pb-14 max-w-4xl mx-auto px-4 sm:px-6 relative">
      <div className="space-y-8">
        {/* Maple Town Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-mono shadow-2xs">
          <MapleLeafIcon className="w-4 h-4 text-orange-600 animate-gentle-bob" />
          <span className="font-semibold">Henesys Town Square • Toronto Realm</span>
          <span className="text-amber-400">•</span>
          <span className="text-stone-600">Senior Software Engineer @ RBC</span>
        </div>

        {/* Character Bio Header */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] flex flex-wrap items-center gap-3">
            <span>Hi, I'm</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800">
              {PERSONAL_INFO.name}
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-amber-200/90 text-amber-950 border border-amber-400 self-center">
              Lv. 99 4th Job
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-700 font-medium tracking-tight max-w-2xl">
            Senior Software Engineer at <span className="font-bold text-stone-900">RBC</span> crafting high-throughput credit risk platforms, resilient Java Spring Boot microservices, and modern React/TypeScript applications.
          </p>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
            University of Toronto Computer Science alumnus (2016–2021). I turn complex financial datasets into real-time decision telemetry for 30,000+ enterprise clients, with a focus on clean systems, tight security gates, and sub-100ms response times.
          </p>
        </div>

        {/* MapleStory Style Character Stat Window */}
        <div className="rounded-2xl border-2 border-amber-900/20 bg-gradient-to-b from-[#fffdfa] to-[#f9f4ec] p-5 sm:p-6 shadow-sm relative overflow-hidden">
          {/* Subtle wooden header accent */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-900/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-inner relative overflow-hidden">
                <span>HN</span>
                <MushroomCapIcon className="w-5 h-5 absolute -bottom-1 -right-1 text-white/40" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-base">Hung Nguyen</span>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Online in Toronto
                  </span>
                </div>
                <div className="text-xs text-stone-600 font-mono">
                  Job: 4th Job • Platform Architect & Senior Software Engineer
                </div>
              </div>
            </div>

            {/* Guild & Fame Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="px-2.5 py-1 rounded-lg bg-amber-100/70 border border-amber-300 text-xs font-mono text-amber-900">
                Guild: <span className="font-bold">RBC Credit Risk</span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-orange-100/70 border border-orange-300 text-xs font-mono text-orange-900">
                Fame: <span className="font-bold">1,337 ★</span>
              </div>
            </div>
          </div>

          {/* HP / MP / EXP Bars (MapleStory classic style!) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-b border-amber-900/10 text-xs font-mono">
            {/* HP Bar (Clients monitored) */}
            <div className="space-y-1">
              <div className="flex justify-between text-stone-600">
                <span className="font-bold text-red-600">HP (Scale)</span>
                <span className="text-stone-800 font-semibold">{PERSONAL_INFO.stats.hp}</span>
              </div>
              <div className="w-full h-3 bg-red-100 rounded-full overflow-hidden border border-red-200">
                <div className="h-full bg-gradient-to-r from-red-500 to-rose-400 w-full rounded-full" />
              </div>
              <div className="text-[10px] text-stone-500">30k+ Client Companies Monitored</div>
            </div>

            {/* MP Bar (Officers empowered) */}
            <div className="space-y-1">
              <div className="flex justify-between text-stone-600">
                <span className="font-bold text-sky-600">MP (Officers)</span>
                <span className="text-stone-800 font-semibold">{PERSONAL_INFO.stats.mp}</span>
              </div>
              <div className="w-full h-3 bg-sky-100 rounded-full overflow-hidden border border-sky-200">
                <div className="h-full bg-gradient-to-r from-sky-500 to-blue-400 w-full rounded-full" />
              </div>
              <div className="text-[10px] text-stone-500">400+ Active Credit Officers</div>
            </div>

            {/* EXP Bar (Career experience) */}
            <div className="space-y-1">
              <div className="flex justify-between text-stone-600">
                <span className="font-bold text-amber-600">EXP</span>
                <span className="text-stone-800 font-semibold">99.9%</span>
              </div>
              <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden border border-amber-300">
                <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 w-[99.9%] rounded-full shadow-inner" />
              </div>
              <div className="text-[10px] text-stone-500">Ready for Next Job Advancement</div>
            </div>
          </div>

          {/* Stats Sheet with Whimsical Interactive Stat Dice Roller */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold font-mono uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Primary Attributes & Production Impact</span>
              </div>

              {/* Dice roll button - iconic MapleStory character creation nostalgia */}
              <button
                onClick={handleRollDice}
                disabled={diceRolling}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-all active:scale-95 cursor-pointer shadow-2xs"
                title="Roll stat dice (just like MapleStory character creation!)"
              >
                <Dices className={`w-3.5 h-3.5 ${diceRolling ? 'animate-spin' : ''}`} />
                <span>Roll Stats</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-amber-900/10 shadow-2xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-red-700 font-bold">STR</span>
                  <span className="font-bold text-stone-900 px-1.5 py-0.2 rounded bg-stone-100">{rollStats.str}</span>
                </div>
                <div className="text-[11px] font-semibold text-stone-800">{PERSONAL_INFO.stats.str}</div>
                <div className="text-[10px] text-stone-500">{PERSONAL_INFO.stats.strLabel}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-amber-900/10 shadow-2xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-700 font-bold">DEX</span>
                  <span className="font-bold text-stone-900 px-1.5 py-0.2 rounded bg-stone-100">{rollStats.dex}</span>
                </div>
                <div className="text-[11px] font-semibold text-stone-800">{PERSONAL_INFO.stats.dex}</div>
                <div className="text-[10px] text-stone-500">{PERSONAL_INFO.stats.dexLabel}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-amber-900/10 shadow-2xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-bold">INT</span>
                  <span className="font-bold text-stone-900 px-1.5 py-0.2 rounded bg-stone-100">{rollStats.int}</span>
                </div>
                <div className="text-[11px] font-semibold text-stone-800">{PERSONAL_INFO.stats.int}</div>
                <div className="text-[10px] text-stone-500">{PERSONAL_INFO.stats.intLabel}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-amber-900/10 shadow-2xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700 font-bold">LUK</span>
                  <span className="font-bold text-stone-900 px-1.5 py-0.2 rounded bg-stone-100">{rollStats.luk}</span>
                </div>
                <div className="text-[11px] font-semibold text-stone-800">{PERSONAL_INFO.stats.luk}</div>
                <div className="text-[10px] text-stone-500">{PERSONAL_INFO.stats.lukLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Direct Copy Email */}
          <button
            id="hero-copy-email-btn"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all shadow-xs active:scale-98 cursor-pointer"
            title="Click to copy email address"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span className="font-mono">Email Copied!</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5" />
                <span className="font-mono">{PERSONAL_INFO.email}</span>
              </>
            )}
          </button>

          {/* View Official Resume Button */}
          <button
            id="hero-resume-btn"
            onClick={onOpenResume}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50/80 border border-amber-900/20 text-stone-800 text-xs font-semibold transition-all shadow-2xs active:scale-98 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>View Official Resume</span>
          </button>

          {/* LinkedIn Profile */}
          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-amber-900/20 text-stone-700 text-xs font-medium transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5 text-sky-700" />
            <span>LinkedIn</span>
          </a>

          {/* Direct Phone / Location */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>Toronto, ON • {PERSONAL_INFO.phone}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
