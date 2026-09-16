import { SHOT_DURATION_MS, SHOT_RELEASE_MS, type Action, type Facing, type MobAction } from './assets';
import { CLIMBS, V_WIDTH, landing, platformById } from './world';
import { MAPLE_DROPPABLE_ITEMS } from '../data/mapleItems';
export { V_WIDTH, V_HEIGHT } from './world';
export const TICK_MS = 1000 / 60;
export const MAX_TICKS_PER_FRAME = 4;
// Scale impulse and gravity together for 20% more height at the same airtime.
const PLAYER_GRAVITY = 0.4608;
const MONSTER_GRAVITY = 0.16;
const JUMP_SPEED = -6.624;
const MOVE_SPEED = 1.35 * 0.75;
const MOVE_ACCEL = 0.2 * 0.75;
export interface Input { left: boolean; right: boolean; up: boolean; down: boolean }
export const EMPTY_INPUT: Input = { left: false, right: false, up: false, down: false };
export interface Player {
  x: number; y: number; vx: number; vy: number; facing: Facing;
  platformId: number | null; climbId: number | null; climbLock: number;
  ignorePlatform: number | null; dropTime: number; action: Action; elapsed: number; fired: boolean;
}
export interface Monster {
  id: number; x: number; y: number; vy: number; direction: number; platformId: number;
  hp: number; action: MobAction; elapsed: number; phaseTime: number;
  respawn: number; reward: number; spawnX: number;
}
export interface Arrow { id: number; x: number; y: number; vx: number; life: number }
export interface Drop { id: number; reward: number; x: number; y: number; vy: number; floor: number }
export interface Damage { id: number; x: number; y: number; life: number; value: number }
export type GameEvent = 'shoot' | 'hit' | 'defeat' | 'drop';
export interface Game {
  player: Player; monsters: Monster[]; arrows: Arrow[]; drops: Drop[]; damage: Damage[]; nextId: number; nextLootIndex: number;
}
export function initialGame(): Game {
  const spawns = [[210, 1], [375, 1], [190, 2], [350, 2], [205, 3], [380, 3], [235, 4], [395, 4]];
  return { player: { x: 143, y: platformById(10)!.y, vx: 0, vy: 0, facing: 'right', platformId: 10,
    climbId: null, climbLock: 0, ignorePlatform: null, dropTime: 0, action: 'stand', elapsed: 0, fired: false },
    monsters: spawns.map(([x, platformId], id) => ({ id, x, spawnX: x, platformId,
      y: platformById(platformId)!.y, vy: 0, direction: id % 2 ? -1 : 1,
      hp: 100, action: 'stand', elapsed: 0, phaseTime: 35 + id * 13, respawn: 0, reward: id })),
    arrows: [], drops: [], damage: [], nextId: 1, nextLootIndex: 0 };
}
function setAction(p: Player, action: Action) {
  if (p.action !== action) { p.action = action; p.elapsed = 0; }
}
export function attack(g: Game) {
  const p = g.player;
  if (p.action === 'shoot' || p.climbId !== null) return false;
  setAction(p, 'shoot'); p.fired = false; p.vx = 0;
  return true;
}
export function jump(g: Game, keys: Input) {
  const p = g.player;
  if (p.action === 'shoot') return false;
  if (p.climbId !== null) {
    p.climbId = null; p.climbLock = 350; p.vy = JUMP_SPEED;
    p.vx = keys.left ? -MOVE_SPEED : keys.right ? MOVE_SPEED : 0;
  } else if (p.platformId !== null) {
    if (keys.down && platformById(p.platformId)?.droppable) {
      p.ignorePlatform = p.platformId; p.dropTime = 250; p.climbLock = 350; p.vy = 1;
    } else p.vy = JUMP_SPEED;
  } else return false;
  p.platformId = null; setAction(p, 'jump'); return true;
}
function tickPlayer(g: Game, keys: Input, events: GameEvent[]) {
  const p = g.player;
  p.climbLock = Math.max(0, p.climbLock - TICK_MS);
  p.dropTime -= TICK_MS;
  if (p.dropTime <= 0) p.ignorePlatform = null;
  if (p.action === 'shoot') {
    p.elapsed += TICK_MS;
    if (!p.fired && p.elapsed >= SHOT_RELEASE_MS) {
      p.fired = true;
      g.arrows.push({ id: g.nextId++, x: p.x + (p.facing === 'right' ? 7 : -7), y: p.y - 17,
        vx: p.facing === 'right' ? 5 : -5, life: 65 });
      events.push('shoot');
    }
    if (p.elapsed >= SHOT_DURATION_MS) setAction(p, p.platformId === null ? 'jump' : 'stand');
  }
  if (p.climbId === null && p.climbLock === 0 && p.action !== 'shoot' && (keys.up || keys.down)) {
    const rope = CLIMBS.find(r => Math.abs(p.x - r.x) < 10 && p.y >= r.top - 2 && p.y - 25 <= r.bottom
      && (keys.down || p.y > r.top + 1) && (keys.up || p.y < r.bottom));
    if (rope) { p.climbId = rope.id; p.platformId = null; p.x = rope.x; p.vx = p.vy = 0; setAction(p, 'climb'); }
  }
  if (p.climbId !== null) {
    const rope = CLIMBS.find(r => r.id === p.climbId)!;
    const direction = Number(keys.down) - Number(keys.up);
    p.y += direction * 1.1;
    if (direction) p.elapsed += TICK_MS;
    if (p.y <= rope.top && direction < 0) {
      p.y = rope.top; p.platformId = rope.platformId; p.climbId = null; p.climbLock = 200; setAction(p, 'stand');
    } else if (p.y >= rope.bottom && direction > 0) {
      p.climbId = null; p.climbLock = 300; setAction(p, 'jump');
    }
    return;
  }
  const moving = Number(keys.right) - Number(keys.left);
  if (p.action !== 'shoot') {
    p.vx = moving ? Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, p.vx + moving * MOVE_ACCEL)) : p.vx * 0.7;
    if (moving) p.facing = moving < 0 ? 'left' : 'right';
  }
  p.x = Math.max(20, Math.min(V_WIDTH - 20, p.x + p.vx));
  const platform = platformById(p.platformId);
  if (platform && (p.x < platform.left || p.x > platform.right)) p.platformId = null;
  if (p.platformId === null) {
    const before = p.y;
    p.vy = Math.min(7.2, p.vy + PLAYER_GRAVITY); p.y += p.vy;
    const floor = p.vy >= 0 ? landing(p.x, before, p.y, p.ignorePlatform) : undefined;
    if (floor) { p.y = floor.y; p.vy = 0; p.platformId = floor.id; }
  }
  if (p.action !== 'shoot') {
    setAction(p, p.platformId === null ? 'jump' : Math.abs(p.vx) > 0.1 ? 'walk' : 'stand');
    p.elapsed += TICK_MS;
  }
}
function tickMonster(g: Game, m: Monster, events: GameEvent[]) {
  const floor = platformById(m.platformId)!;
  if (m.respawn > 0) {
    m.respawn -= TICK_MS;
    if (m.respawn <= 0) { m.hp = 100; m.x = m.spawnX; m.y = floor.y; m.vy = 0; m.action = 'stand'; m.elapsed = 0; m.phaseTime = 50; }
    return;
  }
  m.elapsed += TICK_MS;
  if (m.action === 'die1') {
    if (m.elapsed >= 600) {
      const reward = g.nextLootIndex < MAPLE_DROPPABLE_ITEMS.length
        ? g.nextLootIndex++
        : Math.floor(Math.random() * MAPLE_DROPPABLE_ITEMS.length);
      g.drops.push({ id: g.nextId++, reward, x: m.x, y: floor.y - 15, vy: -2, floor: floor.y - 8 });
      m.respawn = 5000; events.push('drop');
    }
    return;
  }
  if (m.vy || m.y < floor.y) {
    m.vy += MONSTER_GRAVITY; m.y = Math.min(floor.y, m.y + m.vy);
    if (m.y === floor.y) m.vy = 0;
  }
  if (m.action === 'hit1') {
    if (m.elapsed < 240) return;
    m.action = 'move'; m.elapsed = 0;
  }
  m.phaseTime--;
  if (m.phaseTime <= 0) {
    m.action = m.action === 'stand' ? 'move' : 'stand'; m.elapsed = 0;
    m.phaseTime = m.action === 'move' ? 150 : 60;
  }
  if (m.action !== 'stand') {
    m.x += m.direction * 0.35;
    if (m.x <= floor.left + 17 || m.x >= floor.right - 17) {
      m.x = Math.max(floor.left + 17, Math.min(floor.right - 17, m.x)); m.direction *= -1;
    }
    if (m.y === floor.y && m.phaseTime === 75) m.vy = -2.5;
    const action = m.vy || m.y < floor.y ? 'jump' : 'move';
    if (m.action !== action) { m.action = action; m.elapsed = 0; }
  }
}
// Swept collision avoids skipping a close monster between projectile ticks.
export function firstArrowHit(arrow: Arrow, monsters: Monster[]) {
  const next = arrow.x + arrow.vx;
  return monsters.filter(m => m.hp > 0 && m.respawn <= 0 && arrow.y >= m.y - 29 && arrow.y <= m.y
    && Math.max(arrow.x, next) >= m.x - 14 && Math.min(arrow.x, next) <= m.x + 14)
    .sort((a, b) => arrow.vx > 0 ? a.x - b.x : b.x - a.x)[0];
}
export function tickGame(g: Game, keys: Input): GameEvent[] {
  const events: GameEvent[] = [];
  tickPlayer(g, keys, events);
  g.monsters.forEach(m => tickMonster(g, m, events));
  g.arrows = g.arrows.filter(a => {
    const hit = firstArrowHit(a, g.monsters);
    if (hit) {
      hit.hp = Math.max(0, hit.hp - 50); hit.action = hit.hp ? 'hit1' : 'die1'; hit.elapsed = 0;
      g.damage.push({ id: g.nextId++, x: hit.x, y: hit.y - 35, life: 45, value: 50 });
      events.push(hit.hp ? 'hit' : 'defeat'); return false;
    }
    a.x += a.vx; a.life--; return a.life > 0 && a.x >= 0 && a.x <= V_WIDTH;
  });
  for (const d of g.drops) { d.vy += 0.12; d.y += d.vy; if (d.y >= d.floor) { d.y = d.floor; d.vy = Math.abs(d.vy) > 0.4 ? -d.vy * 0.35 : 0; } }
  g.damage = g.damage.filter(d => { d.y -= 0.4; return --d.life > 0; });
  return events;
}
