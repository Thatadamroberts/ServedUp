/**
 * 16-bit style pixel art for the chef avatar.
 * Each sprite is an array of equal-length strings; each char is a palette key ('.' = transparent).
 */

export type Palette = Record<string, string>;

export const BASE_PALETTE: Palette = {
  K: '#2b1d14', // outline
  W: '#fbfbf7', // hat
  w: '#c9d0da', // hat shade
  H: '#6b3e1f', // hair
  S: '#f5c9a0', // skin
  s: '#d99a6c', // skin shade
  E: '#2b1d14', // eye
  e: '#ffffff', // eye glint
  O: '#f39a9a', // blush
  M: '#a83d3d', // mouth
  C: '#ffffff', // coat
  c: '#cfd6e0', // coat shade
  B: '#ffcc33', // buttons
  P: '#3a3f5c', // trousers
  p: '#262a40', // trousers shade
  Z: '#1d1d2b', // shoes
  // scarf colours are injected per title: R / r
  F: '#4d5260', // pan
  f: '#2e313a', // pan shade
  h: '#8a5a32', // handle
  Y: '#ffd23f', // flame / sparkle
  A: '#ff7b25', // flame orange
  T: '#e8443a', // tomato
  G: '#6cc24a', // herb
  V: '#e6eef5', // steam
};

// Head + hat (rows 0-12) shared by most frames.
const HEAD = [
  '....KKKKKKKK....',
  '...KWWWWWWWWK...',
  '..KWWWWWWWWWWK..',
  '..KWWWWWWWWwWK..',
  '..KWWWWWWWwwWK..',
  '...KWWWWWWWWK...',
  '...KwwwwwwwwK...',
  '...KHHSSSSHHK...',
  '...KSSSSSSSSK...',
  '...KSEeSSEeSK...',
  '...KOSSSSSSOK...',
  '...KSSSMMSSsK...',
  '....KsSSSSsK....',
];

const HEAD_BLINK = HEAD.map((row, i) => (i === 9 ? '...KSssSSssSK...' : row));
const HEAD_HAPPY = HEAD.map((row, i) => {
  if (i === 9) return '...KSKKSSKKSK...';
  if (i === 11) return '...KSSMMMMSsK...';
  return row;
});

const BODY_IDLE = [
  '...KKRRRRRRKK...',
  '..KCCCRrrRCCCK..',
  '.KCCCCCRRCCCCcK.',
  '.KCKCCCBCCCCKcK.',
  '.KCKCCCCCCCCKcK.',
  '.KSKCCCBCCCCKSK.',
  '..K.KCCCCCcK.K..',
  '....KPPPPPpK....',
  '....KPPKKPpK....',
  '...KZZZK.KZZZK..',
];

// Right arm reaches forward to hold the pan handle (pan drawn as separate prop).
const BODY_COOK = [
  '...KKRRRRRRKK...',
  '..KCCCRrrRCCCK..',
  '.KCCCCCRRCCCCCKK',
  '.KCKCCCBCCCCCCSK',
  '.KCKCCCCCCCKKKK.',
  '.KSKCCCBCCCK....',
  '..K.KCCCCCcK....',
  '....KPPPPPpK....',
  '....KPPKKPpK....',
  '...KZZZK.KZZZK..',
];

const CHEER_TOP = [
  '....KKKKKKKK....',
  '...KWWWWWWWWK...',
  '..KWWWWWWWWWWK..',
  '..KWWWWWWWWwWK..',
  '..KWWWWWWWwwWK..',
  '...KWWWWWWWWK...',
  '.KK.KwwwwwwK.KK.',
  'KSSKKHSSSSHKKSSK',
  'KSSKKSSSSSSKKSSK',
  '.KCKKSKSSKSKKCK.',
  '.KCKKOSSSSOKKCK.',
  '.KCKKSMMMMsKKCK.',
  '.KCCKKsSSsKKCCK.',
];

const BODY_CHEER = [
  '..KCKKRRRRRRKCK.',
  '..KCCCRrrRCCCK..',
  '...KCCCRRCCCK...',
  '...KCCCBCCCcK...',
  '...KCCCCCCCcK...',
  '...KCCCBCCCcK...',
  '....KCCCCCcK....',
  '....KPPPPPpK....',
  '....KPPKKPpK....',
  '...KZZZK.KZZZK..',
];

export const CHEF = {
  idle: [...HEAD, ...BODY_IDLE],
  blink: [...HEAD_BLINK, ...BODY_IDLE],
  cook: [...HEAD, ...BODY_COOK],
  cookBlink: [...HEAD_BLINK, ...BODY_COOK],
  happy: [...HEAD_HAPPY, ...BODY_IDLE],
  cheer: [...CHEER_TOP, ...BODY_CHEER],
};

/** Frying pan held out to the right; two frames for a "toss". */
export const PAN = [
  [
    '...TG.T...',
    '..KKKKKKK.',
    'hhKFFFFFFK',
    '..KfFFFFfK',
    '...KKKKKK.',
  ],
  [
    '..T..G.T..',
    '....G.....',
    '..KKKKKKK.',
    'hhKFFFFFFK',
    '...KfffKK.',
  ],
];

export const FLAME = [
  ['..Y..A..Y.', '.YAY.AYAY.'],
  ['.A..Y..A..', '.AYAYAYAY.'],
];

export const STEAM = [
  ['....V.....', '.....V....', '....V..V..'],
  ['.....V....', '....V..V..', '.......V..'],
];

export const SPARKLE = [
  ['.Y.', 'YYY', '.Y.'],
  ['...', '.Y.', '...'],
];

export const COIN = [
  '..KKKK..',
  '.KYYYYK.',
  'KYWYYYAK',
  'KYWYYYAK',
  'KYYYYYAK',
  'KYYYYAAK',
  '.KAAAAK.',
  '..KKKK..',
];

export const STAR = ['...Y...', '..YYY..', 'YYYYYYY', '.YYYYY.', '..YYY..', '.YY.YY.', '.Y...Y.'];
