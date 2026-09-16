import React, { useState, useEffect } from 'react';
import { MapleItem } from '../data/mapleItems';
import { bgmPlayer } from '../utils/audioSynth';
import { MapleLeafIcon } from './MapleIcons';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Sword,
  Backpack,
  FileText,
  MessageCircle,
  HelpCircle,
  Linkedin,
  Github,
  Mail,
  Copy,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useGame } from '../game/useGame';
import { GameWorld } from './GameWorld';

interface MapleGameStageProps {
  onOpenInventory: () => void;
  onOpenResume: () => void;
  inventory: MapleItem[];
  onAddItem: (item: MapleItem) => void;
  paused: boolean;
}

export const MapleGameStage: React.FC<MapleGameStageProps> = ({
  onOpenInventory,
  onOpenResume,
  inventory,
  onAddItem,
  paused,
}) => {
  const [isPlayingBgm, setIsPlayingBgm] = useState(() => bgmPlayer.getIsPlaying());
  const [isWhisperOpen, setIsWhisperOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { game, toastMessage, tutorialVisible, performAttack, performJump, performJumpDown, pickupItem, pickupNearby, setVirtualKey, handleDemoDrop } =
    useGame(paused || isWhisperOpen || isHelpOpen, onAddItem, onOpenInventory);
  useEffect(() => {
    const unsubscribe = bgmPlayer.subscribe(setIsPlayingBgm);
    const cleanup = bgmPlayer.initialize();
    return () => { unsubscribe(); cleanup(); };
  }, []);
  const handleToggleBgm = () => bgmPlayer.toggle();
  const heldButton = (key: string) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      setVirtualKey(key, true);
    },
    onPointerUp: () => setVirtualKey(key, false),
    onPointerCancel: () => setVirtualKey(key, false),
    onLostPointerCapture: () => setVirtualKey(key, false),
    style: { touchAction: 'none' } as React.CSSProperties,
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };


  return (
    <div className="maple-screen w-screen h-dvh overflow-hidden flex flex-col text-stone-100 select-none relative font-sans">
      {/* 1. HEADER */}
      <header className="maple-header">
        <div className="maple-panel maple-identity">
          <div className="maple-emblem"><MapleLeafIcon className="w-6 h-6" /></div>
          <div>
            <div className="maple-location">TORONTO · CANADA</div>
            <div className="maple-name">Sean Nguyen <span>* Software Engineer</span></div>
          </div>
        </div>

        <div className="maple-panel maple-menu">
          <button
            onClick={handleToggleBgm}
            className={`maple-hud-button ${isPlayingBgm ? 'is-enabled' : ''}`}
            aria-pressed={isPlayingBgm}
            title={isPlayingBgm ? 'Mute Cozy Henesys BGM' : 'Play Cozy Henesys BGM'}
          >
            {isPlayingBgm ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-current" />
                <span className="hidden sm:inline font-mono">BGM: On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#b37540]" />
                <span className="hidden sm:inline font-mono">BGM: Off</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              bgmPlayer.playInventoryToggle();
              onOpenInventory();
            }}
            className="maple-hud-button"
            title="Open Item Inventory (I)"
          >
            <Backpack className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="font-mono">[I] Bag</span>
            {inventory.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#e0580c] text-current text-[10px] font-bold font-mono">
                {inventory.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenResume}
            className="maple-hud-button maple-hud-primary"
            title="View Full Official Resume (PDF)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Resume</span>
          </button>

          <button
            onClick={() => setIsWhisperOpen(true)}
            className="maple-hud-button"
            title="Whisper / Contact Sean"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="hidden md:inline font-semibold">Whisper</span>
          </button>

          <button
            onClick={() => setIsHelpOpen(true)}
            className="maple-hud-button"
            title="Controls & Lore Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noreferrer"
            className="maple-hud-button"
            title="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noreferrer"
            className="maple-hud-button"
            title="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>

      <GameWorld game={game} onAttack={performAttack} onPickup={pickupItem} toastMessage={toastMessage} tutorialVisible={tutorialVisible} />

      {/* 3. FOOTER */}
      <footer className="maple-footer maple-panel">
        <div className="maple-controls">
          <button
            {...heldButton('arrowleft')}
            className="maple-hud-button maple-key-button"
            title="Walk Left [←]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="font-mono text-[11px]">Left</span>
          </button>

          <button
            {...heldButton('arrowright')}
            className="maple-hud-button maple-key-button"
            title="Walk Right [→]"
          >
            <span className="font-mono text-[11px]">Right</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#e0580c]" />
          </button>

          <button {...heldButton('arrowup')}
            className="maple-hud-button maple-key-button"
            title="Climb Up [↑]" aria-label="Climb up">
            <ArrowUp className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="text-[11px]">Climb up</span>
          </button>
          {/* Climb down / hold for drop-through */}
          <button
            {...heldButton('arrowdown')}
            className="maple-hud-button maple-key-button"
            title="Climb Down [↓] / Drop Through [↓ + Space]"
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="text-[11px]">Climb down</span>
          </button>

          <button
            onClick={performJump}
            className="maple-hud-button maple-key-button"
            title="Jump [Space] / Drop Through [↓ + Space]"
          >
            <kbd>Space</kbd><span>Jump</span>
          </button>

          <button onClick={performJumpDown} className="maple-hud-button maple-key-button"
            title="Hold ↓ and press Space to jump down through a platform">
            <kbd>↓ + Space</kbd><span>Jump down</span>
          </button>

          <button
            onClick={performAttack}
            className="maple-hud-button maple-key-button maple-hud-primary"
            title="Attack [X]"
          >
            <Sword className="w-3.5 h-3.5 text-white" />
            <kbd>X</kbd><span>Attack</span>
          </button>

          <button onClick={pickupNearby} className="maple-hud-button maple-key-button" title="Pick up nearby loot [Z]">
            <kbd>Z</kbd><span>Pick up loot</span>
          </button>

          <button
            onClick={() => {
              bgmPlayer.playInventoryToggle();
              onOpenInventory();
            }}
            className="maple-hud-button maple-key-button"
            title="Open Bag [I]"
          >
            <Backpack className="w-3.5 h-3.5 text-[#e0580c]" />
            <kbd>I</kbd><span>Open inventory</span>
          </button>
          <span className="maple-control-hint">You can also click monsters to attack and pick up loots.</span>
        </div>
      </footer>

      {/* WHISPER MODAL */}
      {isWhisperOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsWhisperOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#d7cfbd] rounded-t-xl rounded-b-lg border-2 border-[#5c4a38] shadow-2xl overflow-hidden font-sans text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#2c4060] to-[#1e2c44] text-white px-3 py-2 flex items-center justify-between border-b-2 border-[#162132]">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold font-mono">Whisper to Hung Nguyen</span>
              </div>
              <button
                onClick={() => setIsWhisperOpen(false)}
                className="w-4 h-4 bg-red-600 hover:bg-red-500 text-white rounded flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-4 space-y-3 bg-[#ece4d6] text-xs font-mono">
              <p className="text-stone-700 leading-relaxed">
                Send a direct transmission to Hung Nguyen (Senior Software Engineer @ RBC). Available for high-impact software engineering opportunities!
              </p>

              <div className="bg-white p-3 rounded-lg border border-[#a89982] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Email:</span>
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <span>{PERSONAL_INFO.email}</span>
                    <button
                      onClick={handleCopyEmail}
                      className="p-1 rounded hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer"
                      title="Copy Email"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Phone:</span>
                  <span className="font-bold text-stone-900">{PERSONAL_INFO.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Location:</span>
                  <span className="font-bold text-stone-900">{PERSONAL_INFO.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-500">LinkedIn:</span>
                  <a
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-sky-700 hover:underline"
                  >
                    linkedin.com/in/nguyensdev
                  </a>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {isHelpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#d7cfbd] rounded-t-xl rounded-b-lg border-2 border-[#5c4a38] shadow-2xl overflow-hidden font-sans text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#2c4060] to-[#1e2c44] text-white px-3 py-2 flex items-center justify-between border-b-2 border-[#162132]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold font-mono">Adventurer Controls & Game Lore</span>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-4 h-4 bg-red-600 hover:bg-red-500 text-white rounded flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="p-4 space-y-3 bg-[#ece4d6] text-xs font-mono">
              <div className="bg-white p-3 rounded-lg border border-[#a89982] space-y-2">
                <h4 className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">
                  Game Controls
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="font-bold text-amber-700">[A] / [D]</span> or{' '}
                    <span className="font-bold text-amber-700">[←] / [→]</span> : Walk
                  </div>
                  <div>
                    <span className="font-bold text-amber-700">[W/S] / [↑/↓]</span> : Climb ropes/ladders
                  </div>
                  <div>
                    <span className="font-bold text-amber-700">[C]</span> : Jump / Jump off rope
                  </div>
                  <div>
                    <span className="font-bold text-amber-700">[Down]+[C]</span> : Drop Through
                  </div>
                  <div>
                    <span className="font-bold text-amber-700">[X]</span> or{' '}
                    <span className="font-bold text-amber-700">Click</span> : Attack
                  </div>
                  <div>
                    <span className="font-bold text-amber-700">[Z]</span> : Pick up Item
                  </div>
                  <div className="col-span-2">
                    <span className="font-bold text-amber-700">[I]</span> : Toggle Item Inventory Bag
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-[#a89982] space-y-1.5">
                <h4 className="font-bold text-amber-900 text-[11px] uppercase tracking-wider">
                  How to Explore Resume
                </h4>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  1. Attack roaming monsters on the map to defeat them.
                </p>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  2. Monsters drop enchanted resume relics, scrolls, and armor.
                </p>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  3. Walk over items and press <span className="font-bold text-amber-800">[Z]</span> or click them to
                  store in your bag.
                </p>
                <p className="text-stone-700 leading-relaxed text-[11px]">
                  4. Press <span className="font-bold text-amber-800">[I]</span> to open your inventory and hover over
                  any item to inspect its real-world engineering stats and metrics!
                </p>
              </div>

              <div className="flex justify-between items-center pt-1">
                <button
                  onClick={handleDemoDrop}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Spawn Random Drop</span>
                </button>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="px-4 py-1.5 bg-stone-700 hover:bg-stone-600 text-white font-bold rounded-lg transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
