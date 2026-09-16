import React, { useEffect, useRef, useState } from 'react';
import { characterSprite, mushroomSprite } from '../game/assets';
import { V_WIDTH, V_HEIGHT, type Game, type Drop } from '../game/engine';
import { MAP_IMAGE } from '../game/world';
import { MAPLE_DROPPABLE_ITEMS } from '../data/mapleItems';
// Crop inside the soil so the footer meets terrain rather than the blue image margin.
const VISIBLE_MAP_HEIGHT = 438;
const ICONS: Record<string, string> = { 'scroll-gold': 'scroll.png', 'cap-emerald': 'leaf.png',
  'book-blue': 'book.png', 'medal-maple': 'maple.png', 'orb-purple': 'salon.png',
  'chip-cyan': 'screw.png', 'potion-red': 'chair.png', 'diploma-blue': 'scroll.png' };

export function GameWorld({ game, onAttack, onPickup, toastMessage, tutorialVisible }: {
  game: Game; onAttack: () => void; onPickup: (drop: Drop) => void; toastMessage: string | null; tutorialVisible: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setScale({
      x: entry.contentRect.width / V_WIDTH,
      y: entry.contentRect.height / VISIBLE_MAP_HEIGHT,
    }));
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  // Fill both viewport axes; compensate entity art so wider screens do not
  // stretch characters, monsters, or item icons. World coordinates stay shared.
  const entityScale = Math.min(scale.x, scale.y);
  const entityTransform = `scale(${entityScale / scale.x}, ${entityScale / scale.y})`;
  const p = game.player;
  const sprite = characterSprite(p.action, p.facing, p.elapsed);
  return <main ref={container} className="flex-1 min-h-0 relative overflow-hidden bg-[#3266cb]" aria-label="Henesys Hunting Ground game">
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', width: V_WIDTH, height: V_HEIGHT,
      transform: `scale(${scale.x}, ${scale.y})`, transformOrigin: 'top left', imageRendering: 'pixelated' }}>
      <img src={MAP_IMAGE} alt="Henesys platforms, ropes and ladders" draggable={false} width={V_WIDTH} height={V_HEIGHT} className="absolute inset-0 pointer-events-none" />
      {game.monsters.filter(m => m.respawn <= 0).map(m => <div key={m.id} style={{ position: 'absolute', left: m.x, top: m.y, transform: entityTransform, transformOrigin: '0 0' }}>
        <button onClick={onAttack} title="Attack from your current position [X]" aria-label="Attack Orange Mushroom"
          style={{ position: 'absolute', bottom: 0, left: -17, width: 34, height: 33, cursor: 'pointer' }}>
          <img src={mushroomSprite(m.action, m.elapsed)} alt="Orange Mushroom" draggable={false}
            style={{ position: 'absolute', bottom: 0, left: '50%', maxWidth: 'none', transform: `translateX(-50%) scale(${m.direction > 0 ? -0.5 : 0.5}, 0.5)`, transformOrigin: 'bottom center' }} />
        </button>
        {m.hp > 0 && <div style={{ position: 'absolute', left: -13, top: -37, width: 26, height: 3, background: '#292524', border: '1px solid #fff9' }}>
          <div style={{ width: `${m.hp}%`, height: '100%', background: '#ef4444' }} />
        </div>}
      </div>)}
      {game.drops.map(d => {
        const item = MAPLE_DROPPABLE_ITEMS[d.reward];
        return <button key={d.id} onClick={() => onPickup(d)} title={`Pick up ${item.name} [Z]`} aria-label={`Pick up ${item.name}`}
          style={{ position: 'absolute', left: d.x - 8, top: d.y - 8, width: 16, height: 16, fontSize: 11, transform: entityTransform, transformOrigin: 'center' }}
          className="cursor-pointer hover:scale-125">
          <img src={`/items/${item.icon.endsWith('.png') ? item.icon : (ICONS[item.icon] ?? 'leaf.png')}`} alt="" className="w-full h-full object-contain" />
        </button>;
      })}
      {game.arrows.map(a => <div key={a.id} style={{ position: 'absolute', left: a.x, top: a.y, transform: `${entityTransform} scaleX(${a.vx > 0 ? 1 : -1})`, transformOrigin: '0 0', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', right: 0, top: -1, width: 17, height: 2, background: '#8c5a2b', borderBottom: '1px solid #4a2e12' }}>
          <div style={{ position: 'absolute', right: -2, top: -2, borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '4px solid #d6d3d1' }} />
          <div style={{ position: 'absolute', left: 0, top: -1, width: 3, height: 4, background: '#ef4444' }} />
        </div>
      </div>)}
      <div style={{ position: 'absolute', left: p.x, top: p.y, transform: entityTransform, transformOrigin: '0 0', pointerEvents: 'none' }}>
        <div className={`maple-tutorial-bubble ${tutorialVisible ? 'is-visible' : 'is-hidden'}`}>
          Defeat mobs and pick up loot to learn more about me!
        </div>
        <div style={{ transform: sprite.flip ? 'scaleX(-1)' : undefined }}>
          <img src={sprite.src} alt={`Player ${p.action}`} draggable={false} style={{ position: 'absolute', maxWidth: 'none',
            left: -sprite.anchorX * sprite.scale, top: -sprite.anchorY * sprite.scale, transform: `scale(${sprite.scale})`, transformOrigin: 'top left' }} />
        </div>
        <div style={{ position: 'absolute', top: 3, left: 0, transform: 'translateX(-50%)', fontSize: 6, whiteSpace: 'nowrap' }}
          className="bg-black/75 text-amber-200 rounded px-1">Sean</div>
      </div>
      {game.damage.map(d => <div key={d.id} style={{ position: 'absolute', left: d.x, top: d.y, opacity: d.life / 45, fontSize: 13, transform: entityTransform, transformOrigin: '0 0',
        fontWeight: 900, color: '#f97316', textShadow: '1px 1px white, -1px -1px white', pointerEvents: 'none' }}>{d.value}</div>)}
    </div>
    </div>
    {toastMessage && <div role="status" className="absolute top-24 left-1/2 -translate-x-1/2 rounded-lg bg-slate-950/95 text-amber-200 px-4 py-2 text-xs shadow-lg max-w-[90%]">{toastMessage}</div>}
  </main>;
}
