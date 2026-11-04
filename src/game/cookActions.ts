export type CookAction = 'chop' | 'boil' | 'fry' | 'bake' | 'mix' | 'roll' | 'plate';

export const ACTION_LABELS: Record<CookAction, string> = {
  chop: 'CHOPPING',
  boil: 'BOILING',
  fry: 'FRYING',
  bake: 'BAKING',
  mix: 'MIXING',
  roll: 'ROLLING',
  plate: 'PLATING UP',
};

export const ACTION_ICONS: Record<CookAction, string> = {
  chop: '🔪',
  boil: '♨️',
  fry: '🍳',
  bake: '🥧',
  mix: '🥣',
  roll: '🫓',
  plate: '🍽️',
};

/**
 * Keywords for each action, matched as whole words (plus -s / -ing), so "chopped tomatoes" (an ingredient
 * description) and "chopsticks" don't count as chopping. A trailing * matches any word ending.
 */
const KEYWORDS: Record<CookAction, string[]> = {
  chop: ['chop', 'dice', 'slice', 'grate', 'cut', 'shred', 'peel', 'halve', 'quarter', 'pound', 'trim', 'finely chop'],
  boil: ['boil', 'simmer', 'poach', 'blanch', 'steam', 'braise', 'par-boil', 'cook spaghetti', 'cook noodles', 'cook the noodles', 'heat 500 ml dashi'],
  fry: ['fry', 'fries', 'sear', 'brown', 'sauté', 'saute', 'toast', 'griddle', 'grill', 'char', 'render', 'sizzl*', 'melt', 'soften', 'sweat', 'caramelis*'],
  bake: ['bake', 'blind-bake', 'oven', 'roast', 'broil'],
  mix: ['whisk', 'beat', 'mix', 'stir', 'fold', 'combine', 'marinate', 'mash', 'blend', 'season', 'toss', 'dredge', 'rinse', 'soak', 'dip', 'whip'],
  roll: ['roll', 'knead', 'shape', 'press', 'stuff', 'fill', 'layer', 'thread', 'spread', 'wrap', 'line'],
  plate: ['serve', 'garnish', 'plate', 'top', 'scatter', 'sprinkle', 'drizzle', 'dust', 'decorate', 'pile', 'spoon', 'invert', 'rest', 'chill', 'slide'],
};

const escape = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PATTERNS = (Object.entries(KEYWORDS) as [CookAction, string[]][]).flatMap(([action, words]) =>
  words.map((w) => ({
    action,
    re: w.endsWith('*')
      ? new RegExp(`(^|[^a-zà-ÿ])${escape(w.slice(0, -1))}`)
      : new RegExp(`(^|[^a-zà-ÿ])${escape(w)}(s|es|ing)?(?![a-zà-ÿ])`),
  })),
);

/**
 * Works out what the chef should be animating for a recipe step, from the first cooking verb in the text.
 * "Meanwhile, gently fry the sliced garlic" → fry.
 */
export function stepAction(step: string): CookAction {
  const text = step.toLowerCase();
  let best: { action: CookAction; at: number } | null = null;
  for (const { action, re } of PATTERNS) {
    const m = re.exec(text);
    if (m && (!best || m.index < best.at)) best = { action, at: m.index };
  }
  return best?.action ?? 'fry';
}
