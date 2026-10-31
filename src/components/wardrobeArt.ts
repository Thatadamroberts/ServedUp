import type { Equipped } from '../game/types';
import type { Palette } from './sprites';

/**
 * Pixel art for wardrobe items. Hats replace the top 7 rows of the chef sprite (hat + band);
 * coats are palette swaps; face items are overlays where '.' keeps the pixel underneath.
 */

const HAT_ROWS = 7;

export const HATS: Record<string, { rows: string[]; palette: Palette }> = {
  toque: {
    rows: [
      '....KKKKKKKK....',
      '...KWWWWWWWWK...',
      '..KWWWWWWWWWWK..',
      '..KWWWWWWWWwWK..',
      '..KWWWWWWWwwWK..',
      '...KWWWWWWWWK...',
      '...KwwwwwwwwK...',
    ],
    palette: { W: '#fbfbf7', w: '#c9d0da' },
  },
  bandana: {
    rows: [
      '................',
      '................',
      '................',
      '....KKKKKKKK....',
      '...KWWWWWWWWK...',
      '...KWwWWWwWWKK..',
      '...KwwwwwwwwKWK.',
    ],
    palette: { W: '#3fa34d', w: '#2b7a37' },
  },
  cap: {
    rows: [
      '................',
      '................',
      '....KKKKKKKK....',
      '...KWWWWWWWWK...',
      '..KWWWWWWWWWWK..',
      '..KWWWWWWWWWWK..',
      '...KwwwwwwwwwwwK',
    ],
    palette: { W: '#3d6fd9', w: '#2549a0' },
  },
  beret: {
    rows: [
      '................',
      '................',
      '........KK......',
      '....KKKKWWKK....',
      '..KKWWWWWWWWKK..',
      '.KWWWWWWWWWWwwK.',
      '..KKwwwwwwwwKK..',
    ],
    palette: { W: '#d94a3d', w: '#9c2b21' },
  },
  crown: {
    rows: [
      '................',
      '................',
      '...K...KK...K...',
      '...KK.KWWK.KK...',
      '...KWKKWWKKWK...',
      '...KWWWTTWWWK...',
      '...KwwwwwwwwK...',
    ],
    palette: { W: '#ffcc33', w: '#c58f00', T: '#e8443a' },
  },
};

export const COATS: Record<string, Palette> = {
  whites: {},
  charcoal: { C: '#4a4f5c', c: '#343843', B: '#ffcc33' },
  sakura: { C: '#ffb7d0', c: '#e58aab', B: '#ffffff' },
  forest: { C: '#4f9a5a', c: '#357a40', B: '#ffcc33' },
  royal: { C: '#7a4fc9', c: '#563296', B: '#ffcc33' },
  gilded: { C: '#ffd75e', c: '#d6a520', B: '#ffffff', P: '#2b1d14', p: '#1a120c' },
};

export const FACES: Record<string, Record<number, string>> = {
  none: {},
  mustache: { 11: '.....HHHHHH.....' },
  glasses: { 9: '...KK..KK..KK...' },
};

export const WALLS: Record<string, { a: string; b: string }> = {
  blue_tiles: { a: '#3f5d78', b: '#37526b' },
  terracotta: { a: '#b8623e', b: '#a55435' },
  mint: { a: '#7fc9b0', b: '#6cb89f' },
  night: { a: '#2a2a4a', b: '#22223d' },
};

function overlay(row: string, over: string): string {
  let out = '';
  for (let i = 0; i < row.length; i++) out += over[i] && over[i] !== '.' ? over[i] : row[i];
  return out;
}

/** Applies hat, face items to a full chef frame. `cheer` frames keep the raised hands. */
export function dressFrame(frame: string[], look: Equipped | undefined, cheer: boolean): string[] {
  if (!look) return frame;
  const hat = HATS[look.hat] ?? HATS.toque;
  const face = FACES[look.face] ?? {};
  return frame.map((row, i) => {
    let r = row;
    if (i < HAT_ROWS) {
      const h = hat.rows[i];
      // Keep the raised hands (outside the head columns) on cheer frames.
      r = cheer ? [...row].map((ch, x) => (x < 4 || x > 11) && ch !== '.' ? ch : h[x]).join('') : h;
    }
    if (face[i]) r = overlay(r, face[i]);
    return r;
  });
}

export function lookPalette(look: Equipped | undefined): Palette {
  if (!look) return {};
  return { ...(HATS[look.hat] ?? HATS.toque).palette, ...(COATS[look.outfit] ?? {}) };
}
