// The new 2317 × 1832 export is displayed at one quarter size in simulation
// coordinates. Rendering maps these coordinates to the available viewport.
export const MAP_IMAGE = '/henesys_map.png';
export const V_WIDTH = 2317 / 4;
export const V_HEIGHT = 1832 / 4;
export interface Platform { id: number; left: number; right: number; y: number; droppable: boolean }
// Haybale tops measured from henesys_map.png. Stacked bales expose each tier;
// like the grass shelves, they can be jumped through and dropped through.
export const HAYBALE_PLATFORMS: Platform[] = [
  // Highest meadow: single bale on the left, two-tier stack on the right.
  { id: 11, left: 162, right: 187, y: 162, droppable: true },
  { id: 12, left: 371, right: 422, y: 162, droppable: true },
  { id: 13, left: 380, right: 412, y: 147, droppable: true },
  // Middle meadow.
  { id: 14, left: 142, right: 167, y: 222, droppable: true },
  { id: 15, left: 397, right: 446, y: 222, droppable: true },
  { id: 16, left: 404, right: 436, y: 207, droppable: true },
  // Lowest meadow.
  { id: 17, left: 123, right: 149, y: 282, droppable: true },
  { id: 18, left: 418, right: 466, y: 282, droppable: true },
  { id: 19, left: 425, right: 457, y: 268, droppable: true },
  // Ground-level bales beside the hut.
  { id: 20, left: 432, right: 472, y: 357, droppable: true },
  { id: 21, left: 439, right: 463, y: 343, droppable: true },
  // Bundled hay on the ground: left, center, and far right.
  { id: 22, left: 99, right: 176, y: 350, droppable: true },
  { id: 23, left: 319, right: 385, y: 350, droppable: true },
  { id: 24, left: 486, right: 504, y: 350, droppable: true },
  { id: 25, left: 526, right: 549, y: 350, droppable: true },
];
// Surface positions measured from henesys_map.png.
export const PLATFORMS: Platform[] = [
  { id: 1, left: 14, right: 566, y: 375, droppable: false },
  { id: 2, left: 104, right: 475, y: 299, droppable: true },
  { id: 3, left: 126, right: 452, y: 240, droppable: true },
  { id: 4, left: 149, right: 430, y: 180, droppable: true },
  { id: 5, left: 351, right: 386, y: 46, droppable: true },
  { id: 6, left: 81, right: 116, y: 271, droppable: true },
  { id: 7, left: 81, right: 116, y: 255, droppable: true },
  { id: 8, left: 103, right: 139, y: 210, droppable: true },
  { id: 9, left: 103, right: 139, y: 195, droppable: true },
  { id: 10, left: 126, right: 161, y: 150, droppable: true },
  ...HAYBALE_PLATFORMS,
];
// Include the short right-hand ladders visible in the new export. Some ladders
// end above the platform below and must be grabbed during a jump.
export const CLIMBS = [
  { id: 1, x: 115, top: 299, bottom: 340, platformId: 2 },
  { id: 2, x: 302, top: 299, bottom: 350, platformId: 2 },
  { id: 3, x: 453, top: 299, bottom: 328, platformId: 2 },
  { id: 4, x: 217, top: 240, bottom: 288, platformId: 3 },
  { id: 5, x: 310, top: 180, bottom: 222, platformId: 4 },
  { id: 6, x: 372, top: 46, bottom: 153, platformId: 5 },
  { id: 7, x: 442, top: 240, bottom: 255, platformId: 3 },
  { id: 8, x: 422, top: 180, bottom: 200, platformId: 4 },
];
export const platformById = (id: number | null) => PLATFORMS.find(p => p.id === id);
export function landing(x: number, before: number, after: number, ignore: number | null = null) {
  return PLATFORMS.filter(p => p.id !== ignore && x >= p.left && x <= p.right && before <= p.y && after >= p.y)
    .sort((a, b) => a.y - b.y)[0];
}
