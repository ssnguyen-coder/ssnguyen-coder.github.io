import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { attack, EMPTY_INPUT, firstArrowHit, initialGame, jump, tickGame, type Input } from './engine';
import { characterSequence, characterSprite, frameAt, mushroomSprite, MOB_DELAYS, type Action, type Facing } from './assets';
import { CLIMBS, HAYBALE_PLATFORMS, platformById } from './world';
const run = (g: ReturnType<typeof initialGame>, n: number, keys: Input = EMPTY_INPUT) => {
  for (let i = 0; i < n; i++) tickGame(g, keys);
};

test('all character and mushroom frames resolve to extracted files', () => {
  for (const action of ['stand', 'walk', 'jump', 'shoot', 'climb'] as Action[]) {
    for (const facing of ['left', 'right'] as Facing[]) {
      const { folder, metadata } = characterSequence(action, facing);
      assert.deepEqual(metadata, JSON.parse(readFileSync(`public/character/${folder}/metadata.json`, 'utf8')));
      let elapsed = 0;
      for (const delay of metadata.delays_ms) {
        assert.ok(existsSync(`public${characterSprite(action, facing, elapsed).src}`)); elapsed += delay;
      }
    }
  }
  for (const [action, delays] of Object.entries(MOB_DELAYS)) {
    let elapsed = 0;
    for (const delay of delays) {
      assert.ok(existsSync(`public${mushroomSprite(action as keyof typeof MOB_DELAYS, elapsed)}`)); elapsed += delay;
    }
  }
  assert.equal(frameAt([300, 150, 350], 300, false), 1);
  assert.equal(frameAt([300, 150, 350], 900, false), 2);
});

test('a shot releases once after windup and cannot overlap another attack', () => {
  const g = initialGame(); g.monsters = [];
  assert.equal(attack(g), true); assert.equal(attack(g), false);
  run(g, 17); assert.equal(g.arrows.length, 0);
  run(g, 2); assert.equal(g.arrows.length, 1);
  run(g, 31); assert.notEqual(g.player.action, 'shoot'); assert.equal(g.arrows.length, 1);
});

test('arrows hit the closest intersected monster only in either direction', () => {
  for (const direction of [1, -1]) {
    const g = initialGame();
    g.monsters = g.monsters.slice(0, 2);
    Object.assign(g.monsters[0], { x: direction > 0 ? 150 : 170, y: 375, phaseTime: 100 });
    Object.assign(g.monsters[1], { x: direction > 0 ? 170 : 150, y: 375, phaseTime: 100 });
    const arrow = { id: 1, x: direction > 0 ? 100 : 220, y: 357, vx: direction * 100, life: 10 };
    assert.equal(firstArrowHit(arrow, [...g.monsters].reverse())?.id, g.monsters[0].id);
    g.arrows = [arrow]; tickGame(g, EMPTY_INPUT);
    assert.equal(g.monsters[0].hp, 50); assert.equal(g.monsters[1].hp, 100); assert.equal(g.arrows.length, 0);
  }
});

test('death animation finishes before one drop appears, then the mushroom respawns', () => {
  const g = initialGame(); g.monsters = g.monsters.slice(0, 1);
  const m = g.monsters[0]; m.hp = 0; m.action = 'die1'; m.elapsed = 0;
  run(g, 30); assert.equal(g.drops.length, 0);
  run(g, 10); assert.equal(g.drops.length, 1); assert.ok(m.respawn > 0);
  run(g, 310); assert.equal(m.hp, 100); assert.equal(g.drops.length, 1);
});

test('each rope supports ascent, a stationary pose, and descent without falling through the world', () => {
  for (const rope of CLIMBS) {
    const g = initialGame();
    Object.assign(g.player, { x: rope.x, y: rope.bottom, platformId: null });
    run(g, 1, { ...EMPTY_INPUT, up: true }); assert.equal(g.player.climbId, rope.id);
    const y = g.player.y, elapsed = g.player.elapsed;
    run(g, 10); assert.equal(g.player.y, y); assert.equal(g.player.elapsed, elapsed);
    run(g, 150, { ...EMPTY_INPUT, up: true });
    assert.equal(g.player.platformId, rope.platformId); assert.equal(g.player.y, rope.top);
    run(g, 15);
    run(g, 200, { ...EMPTY_INPUT, down: true });
    assert.ok(g.player.y <= 375); assert.equal(g.player.climbId, null); assert.notEqual(g.player.platformId, null);
  }
});

test('jumping lands and dropping ignores the current platform', () => {
  const g = initialGame();
  assert.ok(jump(g, EMPTY_INPUT)); run(g, 90); assert.equal(g.player.platformId, 1);
  Object.assign(g.player, { x: 270, y: platformById(2)!.y, platformId: 2 });
  assert.ok(jump(g, { ...EMPTY_INPUT, down: true })); run(g, 90);
  assert.equal(g.player.platformId, 1); assert.equal(g.player.y, 375);
});

test('jumping off a rope does not immediately reattach', () => {
  const g = initialGame(); Object.assign(g.player, { x: 302, y: 330, platformId: null, climbId: 2, action: 'climb' });
  assert.ok(jump(g, { ...EMPTY_INPUT, right: true })); run(g, 10, { ...EMPTY_INPUT, right: true, up: true });
  assert.equal(g.player.climbId, null); assert.ok(g.player.x > 302);
});

test('player jump keeps the shorter airtime with another 20% higher apex', () => {
  const g = initialGame();
  const startY = g.player.y;
  jump(g, EMPTY_INPUT);
  let ticks = 0, apex = startY;
  while (g.player.platformId === null && ticks < 120) {
    tickGame(g, EMPTY_INPUT); ticks++; apex = Math.min(apex, g.player.y);
  }
  // Previous jump: about 28 ticks and 37 world pixels high.
  assert.ok(ticks >= 27 && ticks <= 30, `airtime: ${ticks} ticks`);
  assert.ok(startY - apex >= 43 && startY - apex <= 46, `height: ${startY - apex}`);
});


test('player lands on every haybale top, stays supported, and can drop through', () => {
  for (const bale of HAYBALE_PLATFORMS) {
    const g = initialGame();
    Object.assign(g.player, { x: (bale.left + bale.right) / 2, y: bale.y - 2,
      vy: 2, platformId: null, action: 'jump' });
    run(g, 3);
    assert.equal(g.player.platformId, bale.id);
    run(g, 15);
    assert.equal(g.player.y, bale.y);
    assert.ok(jump(g, { ...EMPTY_INPUT, down: true }));
    run(g, 60);
    assert.ok(g.player.y > bale.y);
    assert.notEqual(g.player.platformId, null);
  }
});
