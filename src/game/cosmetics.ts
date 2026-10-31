import type { Cosmetic } from './types.ts';

const c = (id: string, name: string, slot: Cosmetic['slot'], price: number, minLevel: number, description: string): Cosmetic => ({
  id,
  name,
  slot,
  price,
  minLevel,
  description,
});

/** Price 0 = owned from the start. */
export const COSMETICS: Cosmetic[] = [
  // Hats
  c('toque', 'Classic toque', 'hat', 0, 1, 'The tall white hat of the brigade.'),
  c('bandana', 'Line-cook bandana', 'hat', 60, 1, 'Keeps the sweat off during a rush.'),
  c('cap', 'Diner cap', 'hat', 80, 2, 'Short-order swagger.'),
  c('beret', 'Red beret', 'hat', 120, 4, 'Très chic.'),
  c('crown', 'Golden crown', 'hat', 600, 12, 'For royalty of the kitchen.'),
  // Outfits (coat colour)
  c('whites', 'Chef whites', 'outfit', 0, 1, 'Crisp, classic, impossible to keep clean.'),
  c('charcoal', 'Charcoal coat', 'outfit', 90, 2, 'Hides the sauce stains.'),
  c('sakura', 'Sakura coat', 'outfit', 120, 3, 'Cherry-blossom pink.'),
  c('forest', 'Forest coat', 'outfit', 150, 5, 'Herb-garden green.'),
  c('royal', 'Royal purple coat', 'outfit', 250, 8, 'Fit for a head chef.'),
  c('gilded', 'Gilded coat', 'outfit', 700, 14, 'Gold thread. Ridiculous. Perfect.'),
  // Face
  c('none', 'Bare face', 'face', 0, 1, 'Just you.'),
  c('mustache', 'Grand mustache', 'face', 70, 2, 'Twirl it while you stir.'),
  c('glasses', 'Round glasses', 'face', 70, 3, 'For reading the fine print in recipes.'),
  // Kitchen walls
  c('blue_tiles', 'Blue tiles', 'wall', 0, 1, 'The starter kitchen.'),
  c('terracotta', 'Terracotta tiles', 'wall', 100, 3, 'Warm, Mediterranean.'),
  c('mint', 'Mint tiles', 'wall', 100, 4, 'Retro diner vibes.'),
  c('night', 'Midnight tiles', 'wall', 200, 7, 'Late-night service.'),
  // Decor (multiple can be shown)
  c('plant', 'Potted basil', 'decor', 40, 1, 'A little green on the counter.'),
  c('copper', 'Copper pans', 'decor', 120, 3, 'Gleaming pans on the rack.'),
  c('cat', 'Kitchen cat', 'decor', 200, 5, 'Supervises. Never helps.'),
  c('neon', 'Neon "OPEN" sign', 'decor', 250, 6, 'Lets the neighbourhood know.'),
];

export const COSMETIC_BY_ID: Record<string, Cosmetic> = Object.fromEntries(COSMETICS.map((x) => [x.id, x]));

export const DEFAULT_COSMETICS = COSMETICS.filter((x) => x.price === 0).map((x) => x.id);

export const SLOT_LABELS: Record<Cosmetic['slot'], string> = {
  hat: 'Hats',
  outfit: 'Coats',
  face: 'Face',
  wall: 'Kitchen walls',
  decor: 'Kitchen decor',
};
