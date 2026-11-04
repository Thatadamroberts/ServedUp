import type { CookAction } from '../game/cookActions';
import type { Layer } from './PixelSprite';
import { FLAME, PAN, STEAM } from './sprites';

/** Extra palette entries used by the cooking props. */
export const PROP_PALETTE = {
  L: '#e3e9f0', // knife blade / whisk
  l: '#9aa3ad',
  Q: '#5fa8e0', // water
  q: '#bfe6ff', // bubbles
  U: '#f1e6cc', // bowl / plate / rolling pin
  u: '#c9b48f',
  D: '#f2d49b', // dough
  d: '#d9b26f',
  N: '#7a7f8c', // oven body
  n: '#5b606c',
};

// Knife rocks over a chopping board; bits pile up on the down stroke.
const CHOP = [
  [
    '.......LL...',
    '.....LLL....',
    '..LLLl......',
    'KKLl........',
    '....GG..T...',
    'hhhhhhhhhhhh',
    'KKKKKKKKKKKK',
  ],
  [
    '............',
    '............',
    '............',
    'KKLLLLLLLl..',
    '..GG.G.TT.G.',
    'hhhhhhhhhhhh',
    'KKKKKKKKKKKK',
  ],
];

// Pot of water with bubbles rising and a flame underneath.
const POT = [
  [
    'KKKKKKKKKKKK',
    '.KQQqQQQqQK.',
    '.KFFFFFFFFK.',
    '.KFFFFFFFFK.',
    '.KfFFFFFFfK.',
    '..KKKKKKKK..',
  ],
  [
    'KKKKKKKKKKKK',
    '.KQqQQqQQQK.',
    '.KFFFFFFFFK.',
    '.KFFFFFFFFK.',
    '.KfFFFFFFfK.',
    '..KKKKKKKK..',
  ],
];
const BUBBLES = [
  ['...q....q...', '.....q......', '..q.....q...'],
  ['.....q......', '..q.....q...', '....q.....q.'],
];

// Oven with a flickering glow in the window.
const OVEN = [
  [
    'KKKKKKKKKKKK',
    'KNNNNNNNNNNK',
    'KNYNYNNnnNNK',
    'KKKKKKKKKKKK',
    'KNKKKKKKKKNK',
    'KNKAAAAAAKNK',
    'KNKAYAAYAKNK',
    'KNKAAAAAAKNK',
    'KNKKKKKKKKNK',
    'KNNNNNNNNNNK',
    'KnnnnnnnnnnK',
    'KKKKKKKKKKKK',
  ],
  [
    'KKKKKKKKKKKK',
    'KNNNNNNNNNNK',
    'KNYNYNNnnNNK',
    'KKKKKKKKKKKK',
    'KNKKKKKKKKNK',
    'KNKAYAAAYKNK',
    'KNKAAYYAAKNK',
    'KNKYAAAAYKNK',
    'KNKKKKKKKKNK',
    'KNNNNNNNNNNK',
    'KnnnnnnnnnnK',
    'KKKKKKKKKKKK',
  ],
];

// Whisk sweeping back and forth in a bowl.
const BOWL = [
  [
    '....L.......',
    '.....L......',
    '....LLL..Y..',
    'KKKKKKKKKKK.',
    '.KUUUUUUUK..',
    '..KuuuuuK...',
    '...KKKKK....',
  ],
  [
    '.......L....',
    '......L.....',
    '.Y...LLL....',
    'KKKKKKKKKKK.',
    '.KUUUUUUUK..',
    '..KuuuuuK...',
    '...KKKKK....',
  ],
];

// Rolling pin pushing dough flat.
const ROLL = [
  [
    '.hhUUUUUUhh.',
    '...DDDDDD...',
    '..DDdDDdDD..',
    'hhhhhhhhhhhh',
    'KKKKKKKKKKKK',
  ],
  [
    '..hhUUUUUUhh',
    '..DDDDDDDD..',
    '.DDdDDDDdDD.',
    'hhhhhhhhhhhh',
    'KKKKKKKKKKKK',
  ],
];

// A finished plate with sparkles.
const PLATE = [
  [
    '..Y.........',
    '.YYY..G.....',
    '..Y..TGGT...',
    '....TTTGGT..',
    '.UUUUUUUUUU.',
    '..uuuuuuuu..',
  ],
  [
    '.........Y..',
    '......G.YYY.',
    '.....TGGTY..',
    '....TTTGGT..',
    '.UUUUUUUUUU.',
    '..uuuuuuuu..',
  ],
];

/** Props drawn next to the chef for a cooking action, at animation tick `t`. `x` is the prop column. */
export function propLayers(action: CookAction, t: number, x: number): Layer[] {
  const a = Math.floor(t / 2) % 2; // ~3 fps beat
  const fast = t % 2;
  switch (action) {
    case 'chop':
      return [{ rows: CHOP[fast], x, y: 14 }];
    case 'boil':
      return [
        { rows: STEAM[a], x: x + 1, y: 6 },
        { rows: BUBBLES[fast], x, y: 11 },
        { rows: POT[fast], x, y: 14 },
        { rows: FLAME[fast], x: x + 1, y: 20 },
      ];
    case 'bake':
      return [
        { rows: STEAM[a], x: x + 1, y: 7 },
        { rows: OVEN[a], x, y: 13 },
      ];
    case 'mix':
      return [{ rows: BOWL[fast], x, y: 15 }];
    case 'roll':
      return [{ rows: ROLL[a], x, y: 16 }];
    case 'plate':
      return [{ rows: PLATE[a], x, y: 15 }];
    case 'fry':
    default: {
      const toss = Math.floor(t / 2) % 4 === 3 ? 1 : 0;
      return [
        { rows: STEAM[Math.floor(t / 3) % 2], x: x + 2, y: 7 + (toss ? 0 : 1) },
        { rows: PAN[toss], x, y: 14 - toss },
        { rows: FLAME[fast], x, y: 20 },
      ];
    }
  }
}
