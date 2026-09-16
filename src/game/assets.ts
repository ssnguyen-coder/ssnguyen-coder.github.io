// Copy of the extracted metadata; public assets cannot be imported as JS by Vite dev.
import metadata from './characterMetadata.json';

export type Action = 'stand' | 'walk' | 'jump' | 'shoot' | 'climb';
export type Facing = 'left' | 'right';
export function characterSequence(action: Action, facing: Facing) {
  const folder = action === 'climb' ? 'ladder_movement' : action === 'shoot' ? 'shoot_left'
    : action === 'jump' && facing === 'left' ? 'jumo_left' : `${action}_${facing}`;
  return { folder, metadata: metadata[folder as keyof typeof metadata] };
}

export function frameAt(delays: number[], elapsed: number, loop = true) {
  const duration = delays.reduce((a, b) => a + b, 0);
  let time = loop ? elapsed % duration : Math.min(elapsed, duration - 0.001);
  for (let i = 0; i < delays.length; i++) {
    if (time < delays[i]) return i;
    time -= delays[i];
  }
  return delays.length - 1;
}

export const SHOT_RELEASE_MS = metadata.shoot_left.delays_ms[0];
export const SHOT_DURATION_MS = metadata.shoot_left.delays_ms.reduce((a, b) => a + b, 0);

export function characterSprite(action: Action, facing: Facing, elapsed: number) {
  const { folder, metadata: data } = characterSequence(action, facing);
  const frame = frameAt(data.delays_ms, elapsed, action !== 'shoot');
  // Exported frames have no origins. These hand-set anchors follow the feet,
  // excluding the bow below the feet in the jumping pose.
  const anchors: Record<Action, [number, number]> = {
    stand: [59, 130], walk: [64, 132], jump: [40, 126], shoot: [65, 132], climb: [42, 124],
  };
  const [anchorX, anchorY] = anchors[action];
  return { src: `/character/${folder}/frame_${String(frame).padStart(3, '0')}.png`,
    anchorX, anchorY, scale: 0.5 / data.scale, flip: action === 'shoot' && facing === 'right' };
}

// Mushroom exports have no timing metadata; these are prototype timings.
export const MOB_DELAYS = { stand: [300, 300], move: [180, 180, 180], jump: [200], hit1: [240], die1: [180, 180, 240] };
export type MobAction = keyof typeof MOB_DELAYS;
export function mushroomSprite(action: MobAction, elapsed: number) {
  const frame = frameAt(MOB_DELAYS[action], elapsed, action === 'stand' || action === 'move');
  return `/orange_mushroom/${action}/${frame}.png`;
}
