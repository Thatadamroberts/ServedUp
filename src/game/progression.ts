import { CUISINE_BY_ID, INGREDIENT_BY_ID, INGREDIENTS, RECIPE_BY_ID, RECIPES, STARTER_PACKS } from './data.ts';
import type { Completion, CuisineId, GameState, Ingredient, Recipe } from './types.ts';

export const MAX_LEVEL = 30;
export const STARTING_COINS = 50;
export const PHOTO_BONUS_COINS = 10;
export const FIRST_COOK_XP_MULTIPLIER = 1.5;

/** XP needed to go from `level` to `level + 1`. */
export function xpToNext(level: number): number {
  return 80 + 40 * (level - 1);
}

/** Total XP needed to *reach* `level` from level 1. */
export function xpForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) total += xpToNext(l);
  return total;
}

export interface LevelInfo {
  level: number;
  /** XP earned inside the current level. */
  into: number;
  /** XP span of the current level (0 at max level). */
  span: number;
  progress: number;
}

export function levelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = totalXp;
  while (level < MAX_LEVEL && remaining >= xpToNext(level)) {
    remaining -= xpToNext(level);
    level++;
  }
  if (level >= MAX_LEVEL) return { level: MAX_LEVEL, into: 0, span: 0, progress: 1 };
  const span = xpToNext(level);
  return { level, into: remaining, span, progress: remaining / span };
}

export interface Title {
  minLevel: number;
  name: string;
  /** Neckerchief colour on the avatar. */
  scarf: string;
  scarfShade: string;
}

export const TITLES: Title[] = [
  { minLevel: 1, name: 'Dishwasher', scarf: '#9aa3ad', scarfShade: '#6e7781' },
  { minLevel: 2, name: 'Kitchen Porter', scarf: '#c0763b', scarfShade: '#8e5222' },
  { minLevel: 3, name: 'Prep Cook', scarf: '#e0b43a', scarfShade: '#a9821c' },
  { minLevel: 4, name: 'Line Cook', scarf: '#4caf50', scarfShade: '#2e7d32' },
  { minLevel: 5, name: 'Commis Chef', scarf: '#2fa6c9', scarfShade: '#1b7290' },
  { minLevel: 6, name: 'Chef de Partie', scarf: '#3d6fd9', scarfShade: '#2549a0' },
  { minLevel: 8, name: 'Sous Chef', scarf: '#8e4fd6', scarfShade: '#5f2f9c' },
  { minLevel: 10, name: 'Head Chef', scarf: '#d94a3d', scarfShade: '#9c2b21' },
  { minLevel: 13, name: 'Executive Chef', scarf: '#1d1d2b', scarfShade: '#000000' },
  { minLevel: 16, name: 'Master Chef', scarf: '#ffcc33', scarfShade: '#d69a00' },
  { minLevel: 20, name: 'Grand Gourmand', scarf: '#ff6fb5', scarfShade: '#c53e85' },
  { minLevel: 25, name: 'Culinary Legend', scarf: '#ffffff', scarfShade: '#ffcc33' },
];

export function titleFor(level: number): Title {
  let t = TITLES[0];
  for (const title of TITLES) if (level >= title.minLevel) t = title;
  return t;
}

export function nextTitle(level: number): Title | undefined {
  return TITLES.find((t) => t.minLevel > level);
}

export function newGame(chefName: string, cuisine: CuisineId, now = Date.now()): GameState {
  return {
    version: 1,
    chefName: chefName.trim() || 'Chef',
    activeCuisine: cuisine,
    unlockedCuisines: [cuisine],
    ownedIngredients: [...STARTER_PACKS[cuisine]],
    coins: STARTING_COINS,
    totalXp: 0,
    completions: [],
    createdAt: now,
  };
}

export function currentLevel(state: GameState): number {
  return levelInfo(state.totalXp).level;
}

export function missingIngredients(state: GameState, recipe: Recipe): Ingredient[] {
  const owned = new Set(state.ownedIngredients);
  return recipe.ingredients.filter((id) => !owned.has(id)).map((id) => INGREDIENT_BY_ID[id]);
}

export type RecipeStatus = 'ready' | 'needs-ingredients' | 'level-locked';

export function recipeStatus(state: GameState, recipe: Recipe): RecipeStatus {
  if (currentLevel(state) < recipe.level) return 'level-locked';
  if (missingIngredients(state, recipe).length > 0) return 'needs-ingredients';
  return 'ready';
}

export function recipesFor(cuisine: CuisineId): Recipe[] {
  return RECIPES.filter((r) => r.cuisine === cuisine).sort((a, b) => a.level - b.level || a.difficulty - b.difficulty);
}

export function timesCooked(state: GameState, recipeId: string): number {
  return state.completions.filter((c) => c.recipeId === recipeId).length;
}

export function rewardFor(state: GameState, recipe: Recipe): { xp: number; coins: number; firstTime: boolean } {
  const firstTime = timesCooked(state, recipe.id) === 0;
  return {
    xp: Math.round(recipe.xp * (firstTime ? FIRST_COOK_XP_MULTIPLIER : 1)),
    coins: recipe.coins,
    firstTime,
  };
}

/** Ingredients shown in the market for the active cuisine: its own, plus common ones its recipes use. */
export function marketFor(state: GameState): Ingredient[] {
  const cuisine = state.activeCuisine;
  if (!cuisine) return [];
  const used = new Set(RECIPES.filter((r) => r.cuisine === cuisine).flatMap((r) => r.ingredients));
  return INGREDIENTS.filter((i) => i.cuisine === cuisine || (i.cuisine === 'common' && used.has(i.id))).sort(
    (a, b) => a.minLevel - b.minLevel || a.price - b.price,
  );
}

/** How many unlocked-level recipes in the active cuisine an ingredient helps with. */
export function recipesUsing(ingredientId: string, cuisine: CuisineId | null): Recipe[] {
  return RECIPES.filter((r) => (!cuisine || r.cuisine === cuisine) && r.ingredients.includes(ingredientId));
}

// ───────────── State transitions (pure) ─────────────

export type GameError = 'insufficient-coins' | 'level-locked' | 'already-owned' | 'missing-ingredients' | 'unknown';

export type Result = { ok: true; state: GameState } | { ok: false; error: GameError };

export function buyIngredient(state: GameState, ingredientId: string): Result {
  const ing = INGREDIENT_BY_ID[ingredientId];
  if (!ing) return { ok: false, error: 'unknown' };
  if (state.ownedIngredients.includes(ingredientId)) return { ok: false, error: 'already-owned' };
  if (currentLevel(state) < ing.minLevel) return { ok: false, error: 'level-locked' };
  if (state.coins < ing.price) return { ok: false, error: 'insufficient-coins' };
  return {
    ok: true,
    state: { ...state, coins: state.coins - ing.price, ownedIngredients: [...state.ownedIngredients, ingredientId] },
  };
}

export function unlockCuisine(state: GameState, cuisine: CuisineId): Result {
  if (state.unlockedCuisines.includes(cuisine)) return { ok: false, error: 'already-owned' };
  const cost = CUISINE_BY_ID[cuisine].unlockCost;
  if (state.coins < cost) return { ok: false, error: 'insufficient-coins' };
  const owned = new Set([...state.ownedIngredients, ...STARTER_PACKS[cuisine]]);
  return {
    ok: true,
    state: {
      ...state,
      coins: state.coins - cost,
      unlockedCuisines: [...state.unlockedCuisines, cuisine],
      ownedIngredients: [...owned],
      activeCuisine: cuisine,
    },
  };
}

export interface CookOutcome {
  state: GameState;
  completion: Completion;
  leveledUp: boolean;
  newLevel: number;
  newTitle?: Title;
}

export function completeRecipe(
  state: GameState,
  recipeId: string,
  now = Date.now(),
  id = `${now.toString(36)}${Math.random().toString(36).slice(2, 7)}`,
): { ok: true; outcome: CookOutcome } | { ok: false; error: GameError } {
  const recipe = RECIPE_BY_ID[recipeId];
  if (!recipe) return { ok: false, error: 'unknown' };
  const status = recipeStatus(state, recipe);
  if (status === 'level-locked') return { ok: false, error: 'level-locked' };
  if (status === 'needs-ingredients') return { ok: false, error: 'missing-ingredients' };

  const reward = rewardFor(state, recipe);
  const before = currentLevel(state);
  const completion: Completion = {
    id,
    recipeId,
    completedAt: now,
    xpEarned: reward.xp,
    coinsEarned: reward.coins,
    firstTime: reward.firstTime,
  };
  const next: GameState = {
    ...state,
    totalXp: state.totalXp + reward.xp,
    coins: state.coins + reward.coins,
    completions: [completion, ...state.completions],
  };
  const after = currentLevel(next);
  const titleBefore = titleFor(before);
  const titleAfter = titleFor(after);
  return {
    ok: true,
    outcome: {
      state: next,
      completion,
      leveledUp: after > before,
      newLevel: after,
      newTitle: titleAfter.name !== titleBefore.name ? titleAfter : undefined,
    },
  };
}

/** Attach (or replace) a photo. The first photo on a completion pays a small coin bonus. */
export function attachPhoto(state: GameState, completionId: string, photoUri: string): GameState {
  let bonus = 0;
  const completions = state.completions.map((c) => {
    if (c.id !== completionId) return c;
    if (!c.photoBonusClaimed) bonus = PHOTO_BONUS_COINS;
    return { ...c, photoUri, photoBonusClaimed: true };
  });
  return { ...state, completions, coins: state.coins + bonus };
}

export function removePhoto(state: GameState, completionId: string): GameState {
  return {
    ...state,
    completions: state.completions.map((c) => (c.id === completionId ? { ...c, photoUri: undefined } : c)),
  };
}

export function setNote(state: GameState, completionId: string, note: string): GameState {
  return {
    ...state,
    completions: state.completions.map((c) => (c.id === completionId ? { ...c, note } : c)),
  };
}

export function setActiveCuisine(state: GameState, cuisine: CuisineId): GameState {
  if (!state.unlockedCuisines.includes(cuisine)) return state;
  return { ...state, activeCuisine: cuisine };
}
