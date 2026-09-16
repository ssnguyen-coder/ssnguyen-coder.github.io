import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Menu, X, Volume2, VolumeX, Sparkles, FileText, Backpack } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { MapleLeafIcon } from './MapleIcons';
import { bgmPlayer } from '../utils/audioSynth';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenInventory?: () => void;
  inventoryCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenInventory, inventoryCount = 0 }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPlayingBgm, setIsPlayingBgm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    bgmPlayer.subscribe((playing) => {
      setIsPlayingBgm(playing);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleToggleBgm = () => {
    bgmPlayer.toggle();
  };

  const navLinks = [
    { label: 'Character', href: '#about' },
    { label: 'Quests (Exp)', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills & Gear', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled
          ? 'bg-[#faf7f2]/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs'
          : 'bg-[#faf7f2]/80 backdrop-blur-xs'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Personal Maple Identity */}
          <a
            href="#about"
            className="flex items-center gap-2.5 group focus:outline-hidden focus:ring-2 focus:ring-amber-500 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-90"
            aria-label="Hung Nguyen - Senior Software Engineer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-xs relative overflow-hidden group-hover:scale-105 transition-transform">
              <span className="font-mono">HN</span>
              <div className="absolute -bottom-1 -right-1 text-white/40">
                <MapleLeafIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 text-sm tracking-tight leading-tight">
                  {PERSONAL_INFO.name}
                </span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Lv.99
                </span>
              </div>
              <span className="text-xs text-stone-500 font-mono leading-tight">
                Senior Software Engineer @ RBC
              </span>
            </div>
          </a>

          {/* Desktop Navigation & Whimsical BGM toggle */}
          <div className="hidden sm:flex items-center gap-5">
            <nav className="flex items-center gap-4 text-xs font-medium text-stone-600">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="hover:text-amber-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="h-3.5 w-px bg-stone-300/80" />

            {/* Item Inventory Shortcut button */}
            {onOpenInventory && (
              <button
                onClick={() => {
                  bgmPlayer.playInventoryToggle();
                  onOpenInventory();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs"
                title="Open Item Inventory (Press I)"
              >
                <Backpack className="w-3.5 h-3.5 text-amber-700" />
                <span>[I] Bag</span>
                {inventoryCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                    {inventoryCount}
                  </span>
                )}
              </button>
            )}

            {/* Cozy Relaxing Maple BGM Button */}
            <button
              onClick={handleToggleBgm}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                isPlayingBgm
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs animate-pulse'
                  : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-stone-100 border-stone-200'
              }`}
              title={isPlayingBgm ? 'Mute Relaxing Maple Chime' : 'Play Relaxing Maple Chime'}
            >
              {isPlayingBgm ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span className="text-[11px] font-semibold">BGM: On ♫</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span className="text-[11px]">BGM: Off</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <button
                id="nav-resume-btn"
                onClick={onOpenResume}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all shadow-2xs active:scale-95 cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Resume</span>
              </button>

              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-stone-500 hover:text-sky-700 transition-colors p-1"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                className="text-stone-500 hover:text-stone-900 transition-colors p-1"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-2">
            {onOpenInventory && (
              <button
                onClick={() => {
                  bgmPlayer.playInventoryToggle();
                  onOpenInventory();
                }}
                className="p-1.5 rounded-lg border bg-amber-50 text-amber-900 border-amber-300 relative"
                title="Bag (I)"
              >
                <Backpack className="w-4 h-4 text-amber-700" />
                {inventoryCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                    {inventoryCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={handleToggleBgm}
              className={`p-1.5 rounded-lg border text-xs ${
                isPlayingBgm ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-stone-600 border-stone-200'
              }`}
              title="Toggle Music"
            >
              {isPlayingBgm ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-stone-700 hover:text-stone-950 rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#faf7f2] border-b border-amber-900/10 px-4 py-4 space-y-3 shadow-md">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-stone-700 hover:text-amber-800 py-1.5"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-amber-900/10 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-amber-500 text-white rounded-lg"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official Resume PDF</span>
            </button>

            {onOpenInventory && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  bgmPlayer.playInventoryToggle();
                  onOpenInventory();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#2c4060] text-white rounded-lg"
              >
                <Backpack className="w-3.5 h-3.5" />
                <span>Open Bag [I]</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
