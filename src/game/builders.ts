import type { Ingredient, Recipe } from './types.ts';

export const ing = (
  id: string,
  name: string,
  emoji: string,
  cuisine: Ingredient['cuisine'],
  price: number,
  minLevel = 1,
): Ingredient => ({ id, name, emoji, cuisine, price, minLevel });

/** Rewards scale with difficulty so tougher dishes are worth more. */
export const REWARDS: Record<Recipe['difficulty'], { xp: number; coins: number }> = {
  1: { xp: 40, coins: 25 },
  2: { xp: 70, coins: 40 },
  3: { xp: 110, coins: 60 },
  4: { xp: 160, coins: 85 },
  5: { xp: 230, coins: 120 },
};

type RecipeInput = Omit<Recipe, 'xp' | 'coins'> & { xp?: number; coins?: number };
export const recipe = (r: RecipeInput): Recipe => ({ ...REWARDS[r.difficulty], ...r });
