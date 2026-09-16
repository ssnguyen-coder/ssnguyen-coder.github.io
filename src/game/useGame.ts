import { useCallback, useEffect, useRef, useState } from 'react';
import { MAPLE_DROPPABLE_ITEMS, type MapleItem } from '../data/mapleItems';
import { bgmPlayer } from '../utils/audioSynth';
import { attack, initialGame, jump, MAX_TICKS_PER_FRAME, TICK_MS, tickGame, type Drop, type Input } from './engine';

export function useGame(paused: boolean, onAddItem: (item: MapleItem) => void, onOpenInventory: () => void) {
  const game = useRef(initialGame());
  const keys = useRef<Record<string, boolean>>({});
  const [snapshot, setSnapshot] = useState(() => structuredClone(game.current));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const callbacks = useRef({ paused, onAddItem, onOpenInventory });
  callbacks.current = { paused, onAddItem, onOpenInventory };
  const input = (): Input => ({ left: !!(keys.current.a || keys.current.arrowleft), right: !!(keys.current.d || keys.current.arrowright),
    up: !!(keys.current.w || keys.current.arrowup), down: !!(keys.current.s || keys.current.arrowdown) });
  const performAttack = useCallback(() => { if (!callbacks.current.paused) attack(game.current); }, []);
  const performJump = useCallback(() => {
    if (!callbacks.current.paused && jump(game.current, input())) bgmPlayer.playJumpSound();
  }, []);
  const performJumpDown = useCallback(() => {
    if (!callbacks.current.paused && jump(game.current, { ...input(), down: true })) bgmPlayer.playJumpSound();
  }, []);
  const setVirtualKey = useCallback((key: string, pressed: boolean) => { keys.current[key] = pressed; }, []);
  const pickupItem = useCallback((drop: Drop) => {
    if (callbacks.current.paused || !game.current.drops.some(d => d.id === drop.id)) return;
    const item = MAPLE_DROPPABLE_ITEMS[drop.reward];
    game.current.drops = game.current.drops.filter(d => d.id !== drop.id);
    callbacks.current.onAddItem(item); bgmPlayer.playItemPickup();
    setToastMessage(`Obtained [${item.name}]! Press [I] to inspect`);
    clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToastMessage(null), 3500);
  }, []);
  const pickupNearby = useCallback(() => {
    const p = game.current.player;
    const drop = game.current.drops.find(d => Math.abs(d.x - p.x) < 30 && Math.abs(d.y - p.y) < 35);
    if (drop) pickupItem(drop);
  }, [pickupItem]);
  const handleDemoDrop = () => {
    const g = game.current;
    g.drops.push({ id: g.nextId++, reward: Math.floor(Math.random() * MAPLE_DROPPABLE_ITEMS.length),
      x: g.player.x + 15, y: g.player.y - 15, vy: -2, floor: g.player.y - 8 });
  };
  useEffect(() => { if (paused) keys.current = {}; }, [paused]);
  useEffect(() => {
    const clearKeys = () => { keys.current = {}; };
    const down = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && (e.target.closest('input, textarea, select') || e.target.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (k === 'i') { e.preventDefault(); if (!e.repeat) { callbacks.current.onOpenInventory(); bgmPlayer.playInventoryToggle(); } return; }
      if (callbacks.current.paused) return;
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'alt', 'control', 'a', 'd', 'w', 's', 'c', 'x', 'z'].includes(k)) e.preventDefault();
      keys.current[k] = true;
      if (e.repeat) return;
      if (k === 'x' || k === 'control') performAttack();
      if (k === 'c' || k === ' ' || k === 'alt') performJump();
      if (k === 'z') pickupNearby();
    };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', clearKeys);
    document.addEventListener('visibilitychange', clearKeys);
    let previous = performance.now(), accumulator = 0, frame = 0;
    const loop = (now: number) => {
      accumulator += Math.min(now - previous, TICK_MS * MAX_TICKS_PER_FRAME); previous = now;
      if (callbacks.current.paused || document.hidden) accumulator = 0;
      let changed = false;
      while (accumulator >= TICK_MS) {
        const events = tickGame(game.current, input());
        for (const event of events) {
          if (event === 'shoot') bgmPlayer.playBowShoot();
          if (event === 'hit') bgmPlayer.playHitSound();
          if (event === 'defeat') bgmPlayer.playMonsterDefeat();
          if (event === 'defeat') setTutorialVisible(false);
          if (event === 'drop') bgmPlayer.playItemDrop();
        }
        accumulator -= TICK_MS; changed = true;
      }
      if (changed) setSnapshot(structuredClone(game.current));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame); clearTimeout(toastTimer.current);
      window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); window.removeEventListener('blur', clearKeys);
      document.removeEventListener('visibilitychange', clearKeys);
    };
  }, [performAttack, performJump, pickupNearby]);
  return { game: snapshot, toastMessage, tutorialVisible, performAttack, performJump, performJumpDown, pickupItem, pickupNearby, setVirtualKey, handleDemoDrop };
}
