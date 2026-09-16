import React, { useState, useEffect } from 'react';
import { MapleItem } from '../data/mapleItems';
import { bgmPlayer } from '../utils/audioSynth';
import { MapleLeafIcon } from './MapleIcons';
import {
  Volume2,
  VolumeX,
  Sword,
  Backpack,
  FileText,
  Linkedin,
  Github,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/personalInfo';
import { useGame } from '../game/useGame';
import { GameWorld } from './GameWorld';

interface MapleGameStageProps {
  onOpenInventory: () => void;
  onOpenResume: () => void;
  onOpenProjects: () => void;
  inventory: MapleItem[];
  onAddItem: (item: MapleItem) => void;
  paused: boolean;
}

export const MapleGameStage: React.FC<MapleGameStageProps> = ({
  onOpenInventory,
  onOpenResume,
  onOpenProjects,
  inventory,
  onAddItem,
  paused,
}) => {
  const [isPlayingBgm, setIsPlayingBgm] = useState(() => bgmPlayer.getIsPlaying());
  const { game, toastMessage, tutorialVisible, performAttack, performJump, performJumpDown, pickupItem, pickupNearby, setVirtualKey } =
    useGame(paused, onAddItem, onOpenInventory);
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

  return (
    <div className="maple-screen w-screen h-dvh overflow-hidden flex flex-col text-stone-100 select-none relative font-sans">
      {/* Navigation */}
      <header className="maple-header">
        <div className="maple-panel maple-identity">
          <div className="maple-emblem"><MapleLeafIcon className="w-6 h-6" /></div>
          <div>
            <div className="maple-location">TORONTO · CANADA</div>
            <div className="maple-name">{PERSONAL_INFO.name}</div>
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
            <span><span className="keyboard-hint">[I] </span>Bag</span>
            {inventory.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#e0580c] text-current text-[10px] font-bold font-mono">
                {inventory.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenResume}
            className="maple-hud-button maple-hud-primary"
            title="View resume (PDF)"
          >
            <FileText className="resume-nav-icon w-3.5 h-3.5" />
            <span>Resume</span>
          </button>

          <button
            type="button"
            className="maple-hud-button"
            onClick={onOpenProjects}
            title="View projects"
          >
            <span className="font-semibold">Projects</span>
          </button>

          <a
            href={PERSONAL_INFO.linkedin}
            target="_blank"
            rel="noreferrer"
            className="maple-hud-button"
            title="LinkedIn Profile" aria-label="LinkedIn profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={PERSONAL_INFO.github}
            target="_blank"
            rel="noreferrer"
            className="maple-hud-button"
            title="GitHub Profile" aria-label="GitHub profile"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </header>

      <GameWorld game={game} onAttack={performAttack} onPickup={pickupItem} toastMessage={toastMessage} tutorialVisible={tutorialVisible} />

      {/* Game controls */}
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
            <span className="text-[11px]">Up</span>
          </button>
          {/* Climb down / hold for drop-through */}
          <button
            {...heldButton('arrowdown')}
            className="maple-hud-button maple-key-button"
            title="Climb Down [↓] / Drop Through [↓ + Space]"
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#e0580c]" />
            <span className="text-[11px]">Down</span>
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
            <kbd>Z</kbd><span>Pick up</span>
          </button>

          <button
            onClick={() => {
              bgmPlayer.playInventoryToggle();
              onOpenInventory();
            }}
            className="maple-hud-button maple-key-button footer-inventory"
            title="Open Bag [I]"
          >
            <Backpack className="w-3.5 h-3.5 text-[#e0580c]" />
            <kbd>I</kbd><span>Open inventory</span>
          </button>
          <span className="maple-control-hint">Click monsters to attack; click drops to collect them.</span>
        </div>
      </footer>

    </div>
  );
};
