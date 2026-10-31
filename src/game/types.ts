export type CuisineId = 'italian' | 'japanese' | 'mexican' | 'indian' | 'french' | 'persian';

export interface Cuisine {
  id: CuisineId;
  name: string;
  emoji: string;
  tagline: string;
  /** Accent colour used for cards & headers. */
  color: string;
  /** Cost in coins to open this cuisine after your first one. */
  unlockCost: number;
}

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  cuisine: CuisineId | 'common';
  /** Coins to buy (starter-pack items are granted free). */
  price: number;
  /** Player level required before it appears in the market. */
  minLevel: number;
}

export interface Recipe {
  id: string;
  name: string;
  cuisine: CuisineId;
  emoji: string;
  description: string;
  /** Player level required to attempt the recipe. */
  level: number;
  /** 1 (easy) – 5 (master). */
  difficulty: 1 | 2 | 3 | 4 | 5;
  minutes: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  xp: number;
  coins: number;
}

export interface Completion {
  id: string;
  recipeId: string;
  completedAt: number;
  xpEarned: number;
  coinsEarned: number;
  firstTime: boolean;
  photoUri?: string;
  photoBonusClaimed?: boolean;
  note?: string;
}

export interface GameState {
  version: 1;
  chefName: string;
  activeCuisine: CuisineId | null;
  unlockedCuisines: CuisineId[];
  ownedIngredients: string[];
  coins: number;
  totalXp: number;
  completions: Completion[];
  createdAt: number;
}
