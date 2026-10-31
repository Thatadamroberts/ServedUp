import { ACHIEVEMENTS, type Achievement, type PlayerStats } from './achievements.ts';
import { COSMETIC_BY_ID, DEFAULT_COSMETICS } from './cosmetics.ts';
import { CUISINE_BY_ID, CUISINES, INGREDIENT_BY_ID, INGREDIENTS, RECIPE_BY_ID, RECIPES, STARTER_PACKS } from './data.ts';
import type { Bonus, Completion, CuisineId, DailySpecial, Equipped, GameState, Ingredient, Recipe } from './types.ts';

export const MAX_LEVEL = 30;
export const STARTING_COINS = 50;
export const PHOTO_BONUS_COINS = 10;
export const FIRST_COOK_XP_MULTIPLIER = 1.5;
export const DAILY_XP_MULTIPLIER = 2;

/** Coins paid when a streak reaches these lengths. */
export const STREAK_MILESTONES: Record<number, number> = { 3: 30, 7: 75, 14: 150, 30: 300 };

export type MasteryTier = 0 | 1 | 2 | 3;
export const MASTERY_NAMES = ['', 'Bronze', 'Silver', 'Gold'] as const;
export const MASTERY_COLORS = ['', '#c0763b', '#c9d0da', '#ffcc33'] as const;
/** Cooks needed for bronze / silver / gold. */
export const MASTERY_THRESHOLDS = [1, 3, 5] as const;
/** Coins paid on reaching silver and gold. */
export const MASTERY_REWARDS: Record<number, number> = { 2: 20, 3: 50 };

export const DEFAULT_EQUIPPED: Equipped = { hat: 'toque', outfit: 'whites', face: 'none', wall: 'blue_tiles', decor: [] };

// ───────────── Dates ─────────────

/** Local calendar day, e.g. "2026-10-31". */
export function dayKey(ts: number): string {
  const d = new Date(ts);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function previousDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d - 1, 12).getTime());
}

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
    ownedCosmetics: [...DEFAULT_COSMETICS],
    equipped: { ...DEFAULT_EQUIPPED, decor: [] },
    streak: { current: 0, best: 0, lastDay: null },
    daily: null,
    achievements: {},
  };
}

/** Fills in fields added after a save was created, so older saves keep working. */
export function normalizeState(raw: GameState): GameState {
  const s = raw as Partial<GameState> & GameState;
  return {
    ...s,
    ownedCosmetics: Array.from(new Set([...(s.ownedCosmetics ?? []), ...DEFAULT_COSMETICS])),
    equipped: { ...DEFAULT_EQUIPPED, ...(s.equipped ?? {}), decor: s.equipped?.decor ?? [] },
    streak: s.streak ?? { current: 0, best: 0, lastDay: null },
    daily: s.daily ?? null,
    achievements: s.achievements ?? {},
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

export function masteryTier(cooks: number): MasteryTier {
  let tier: MasteryTier = 0;
  MASTERY_THRESHOLDS.forEach((t, i) => {
    if (cooks >= t) tier = (i + 1) as MasteryTier;
  });
  return tier;
}

/** Cooks still needed to reach the next tier, or null at gold. */
export function cooksToNextTier(cooks: number): number | null {
  const next = MASTERY_THRESHOLDS.find((t) => t > cooks);
  return next === undefined ? null : next - cooks;
}

export function isDailySpecial(state: GameState, recipeId: string, now = Date.now()): boolean {
  return !!state.daily && state.daily.day === dayKey(now) && state.daily.recipeId === recipeId && !state.daily.claimed;
}

/** Days in a row, counting today or yesterday as still alive. */
export function activeStreak(state: GameState, now = Date.now()): number {
  const { lastDay, current } = state.streak;
  if (!lastDay) return 0;
  const today = dayKey(now);
  return lastDay === today || lastDay === previousDay(today) ? current : 0;
}

export function cookedToday(state: GameState, now = Date.now()): boolean {
  return state.streak.lastDay === dayKey(now);
}

export function nextStreakMilestone(streak: number): { days: number; coins: number } | null {
  const days = Object.keys(STREAK_MILESTONES)
    .map(Number)
    .find((d) => d > streak);
  return days ? { days, coins: STREAK_MILESTONES[days] } : null;
}

export interface Reward {
  xp: number;
  coins: number;
  firstTime: boolean;
  daily: boolean;
  bonuses: Bonus[];
}

/** XP and coins a cook would earn right now, including first-cook and Chef's Special bonuses. */
export function rewardFor(state: GameState, recipe: Recipe, now = Date.now()): Reward {
  const firstTime = timesCooked(state, recipe.id) === 0;
  const daily = isDailySpecial(state, recipe.id, now);
  const bonuses: Bonus[] = [];
  if (firstTime) bonuses.push({ label: 'First cook', xp: Math.round(recipe.xp * (FIRST_COOK_XP_MULTIPLIER - 1)) });
  if (daily) bonuses.push({ label: "Chef's Special", xp: Math.round(recipe.xp * (DAILY_XP_MULTIPLIER - 1)) });
  return {
    xp: recipe.xp + bonuses.reduce((n, b) => n + (b.xp ?? 0), 0),
    coins: recipe.coins,
    firstTime,
    daily,
    bonuses,
  };
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Picks today's Chef's Special: a dish you can cook now in your active cuisine, favouring ones not yet at gold. */
export function pickDailySpecial(state: GameState, now = Date.now()): DailySpecial | null {
  const day = dayKey(now);
  const pools = [
    RECIPES.filter((r) => r.cuisine === state.activeCuisine && recipeStatus(state, r) === 'ready' && masteryTier(timesCooked(state, r.id)) < 3),
    RECIPES.filter((r) => r.cuisine === state.activeCuisine && recipeStatus(state, r) === 'ready'),
    RECIPES.filter((r) => state.unlockedCuisines.includes(r.cuisine) && recipeStatus(state, r) === 'ready'),
  ];
  const pool = pools.find((p) => p.length > 0);
  if (!pool) return null;
  const pick = pool[hash(`${day}:${state.createdAt}`) % pool.length];
  return { day, recipeId: pick.id, claimed: false };
}

/** Rolls a new Chef's Special when the day changes. Returns the same object when nothing changes. */
export function ensureDailySpecial(state: GameState, now = Date.now()): GameState {
  if (state.daily?.day === dayKey(now)) return state;
  const daily = pickDailySpecial(state, now);
  if (!daily) return state;
  return { ...state, daily };
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
  streak: number;
  mastery: MasteryTier;
  masteryUp: boolean;
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

  const reward = rewardFor(state, recipe, now);
  const bonuses = [...reward.bonuses];
  const before = currentLevel(state);

  // Streak: cooking on consecutive days extends it; the first cook of a day counts once.
  const today = dayKey(now);
  let streak = state.streak;
  if (streak.lastDay !== today) {
    const current = streak.lastDay === previousDay(today) ? streak.current + 1 : 1;
    streak = { current, best: Math.max(streak.best, current), lastDay: today };
    const milestone = STREAK_MILESTONES[current];
    if (milestone) bonuses.push({ label: `${current}-day streak`, coins: milestone });
  }

  // Mastery: reaching silver or gold pays out once.
  const cooksBefore = timesCooked(state, recipeId);
  const tierBefore = masteryTier(cooksBefore);
  const tierAfter = masteryTier(cooksBefore + 1);
  if (tierAfter > tierBefore && MASTERY_REWARDS[tierAfter]) {
    bonuses.push({ label: `${MASTERY_NAMES[tierAfter]} mastery`, coins: MASTERY_REWARDS[tierAfter] });
  }

  const xp = recipe.xp + bonuses.reduce((n, b) => n + (b.xp ?? 0), 0);
  const coins = recipe.coins + bonuses.reduce((n, b) => n + (b.coins ?? 0), 0);
  const completion: Completion = {
    id,
    recipeId,
    completedAt: now,
    xpEarned: xp,
    coinsEarned: coins,
    firstTime: reward.firstTime,
    daily: reward.daily || undefined,
    bonuses,
  };
  const next: GameState = {
    ...state,
    totalXp: state.totalXp + xp,
    coins: state.coins + coins,
    completions: [completion, ...state.completions],
    streak,
    daily: reward.daily && state.daily ? { ...state.daily, claimed: true } : state.daily,
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
      streak: streak.current,
      mastery: tierAfter,
      masteryUp: tierAfter > tierBefore,
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

// ───────────── Wardrobe & decor ─────────────

export function buyCosmetic(state: GameState, id: string): Result {
  const item = COSMETIC_BY_ID[id];
  if (!item) return { ok: false, error: 'unknown' };
  if (state.ownedCosmetics.includes(id)) return { ok: false, error: 'already-owned' };
  if (currentLevel(state) < item.minLevel) return { ok: false, error: 'level-locked' };
  if (state.coins < item.price) return { ok: false, error: 'insufficient-coins' };
  const bought: GameState = { ...state, coins: state.coins - item.price, ownedCosmetics: [...state.ownedCosmetics, id] };
  return { ok: true, state: equipCosmetic(bought, id) };
}

/** Wears an owned item. Decor items toggle on and off; other slots hold one item. */
export function equipCosmetic(state: GameState, id: string): GameState {
  const item = COSMETIC_BY_ID[id];
  if (!item || !state.ownedCosmetics.includes(id)) return state;
  const eq = state.equipped;
  if (item.slot === 'decor') {
    const decor = eq.decor.includes(id) ? eq.decor.filter((d) => d !== id) : [...eq.decor, id];
    return { ...state, equipped: { ...eq, decor } };
  }
  return { ...state, equipped: { ...eq, [item.slot]: id } };
}

// ───────────── Achievements ─────────────

export function playerStats(state: GameState): PlayerStats {
  const cooked = state.completions.map((c) => RECIPE_BY_ID[c.recipeId]).filter(Boolean);
  const counts = new Map<string, number>();
  for (const c of state.completions) counts.set(c.recipeId, (counts.get(c.recipeId) ?? 0) + 1);
  return {
    level: currentLevel(state),
    dishes: state.completions.length,
    photos: state.completions.filter((c) => c.photoUri).length,
    unlockedCuisines: state.unlockedCuisines.length,
    cuisinesCooked: new Set(cooked.map((r) => r.cuisine)).size,
    totalCuisines: CUISINES.length,
    golds: [...counts.values()].filter((n) => masteryTier(n) === 3).length,
    bestStreak: state.streak.best,
    dailySpecials: state.completions.filter((c) => c.daily).length,
    pantry: state.ownedIngredients.length,
    cosmeticsBought: state.ownedCosmetics.filter((id) => (COSMETIC_BY_ID[id]?.price ?? 0) > 0).length,
    masterDishes: cooked.filter((r) => r.difficulty === 5).length,
    longestCookMinutes: Math.max(0, ...cooked.map((r) => r.minutes)),
  };
}

/** Unlocks any newly earned achievements and pays their coins. */
export function applyAchievements(state: GameState, now = Date.now()): { state: GameState; unlocked: Achievement[] } {
  const stats = playerStats(state);
  const unlocked = ACHIEVEMENTS.filter((a) => !state.achievements[a.id] && a.check(stats));
  if (!unlocked.length) return { state, unlocked };
  const achievements = { ...state.achievements };
  for (const a of unlocked) achievements[a.id] = now;
  return {
    state: { ...state, achievements, coins: state.coins + unlocked.reduce((n, a) => n + a.coins, 0) },
    unlocked,
  };
}
