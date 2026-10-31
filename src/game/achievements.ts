/** Stats derived from the game state that achievements are checked against. */
export interface PlayerStats {
  level: number;
  dishes: number;
  photos: number;
  unlockedCuisines: number;
  cuisinesCooked: number;
  totalCuisines: number;
  golds: number;
  bestStreak: number;
  dailySpecials: number;
  pantry: number;
  cosmeticsBought: number;
  masterDishes: number;
  longestCookMinutes: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  /** Emoji shown inside the pixel badge frame. */
  icon: string;
  coins: number;
  check: (s: PlayerStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_dish', name: 'Order Up!', description: 'Serve your first dish.', icon: '🍽️', coins: 25, check: (s) => s.dishes >= 1 },
  { id: 'dishes_10', name: 'Regular Service', description: 'Serve 10 dishes.', icon: '🔟', coins: 50, check: (s) => s.dishes >= 10 },
  { id: 'dishes_25', name: 'Busy Kitchen', description: 'Serve 25 dishes.', icon: '🔥', coins: 100, check: (s) => s.dishes >= 25 },
  { id: 'dishes_50', name: 'Half Century', description: 'Serve 50 dishes.', icon: '🏅', coins: 200, check: (s) => s.dishes >= 50 },
  { id: 'first_photo', name: 'Food Photographer', description: 'Attach a photo to a dish.', icon: '📸', coins: 20, check: (s) => s.photos >= 1 },
  { id: 'photos_10', name: 'Gallery Wall', description: 'Attach photos to 10 dishes.', icon: '🖼️', coins: 75, check: (s) => s.photos >= 10 },
  { id: 'streak_3', name: 'On a Roll', description: 'Cook 3 days in a row.', icon: '📅', coins: 20, check: (s) => s.bestStreak >= 3 },
  { id: 'streak_7', name: 'Week of Flavour', description: 'Cook 7 days in a row.', icon: '🗓️', coins: 50, check: (s) => s.bestStreak >= 7 },
  { id: 'streak_30', name: 'Iron Apron', description: 'Cook 30 days in a row.', icon: '🛡️', coins: 150, check: (s) => s.bestStreak >= 30 },
  { id: 'daily_5', name: 'Special Agent', description: "Cook 5 Chef's Specials.", icon: '⭐', coins: 75, check: (s) => s.dailySpecials >= 5 },
  { id: 'gold_1', name: 'Signature Dish', description: 'Earn gold mastery on a dish.', icon: '🥇', coins: 50, check: (s) => s.golds >= 1 },
  { id: 'gold_10', name: 'Repertoire', description: 'Earn gold mastery on 10 dishes.', icon: '👑', coins: 200, check: (s) => s.golds >= 10 },
  { id: 'cuisine_2', name: 'Passport Stamped', description: 'Open a second cuisine.', icon: '🛂', coins: 50, check: (s) => s.unlockedCuisines >= 2 },
  { id: 'world_tour', name: 'World Tour', description: 'Cook a dish from every cuisine.', icon: '🌍', coins: 300, check: (s) => s.cuisinesCooked >= s.totalCuisines },
  { id: 'master_dish', name: 'Showstopper', description: 'Cook a 5-star difficulty dish.', icon: '💎', coins: 100, check: (s) => s.masterDishes >= 1 },
  { id: 'marathon', name: 'Slow Food', description: 'Cook a dish that takes 3 hours or more.', icon: '⏳', coins: 75, check: (s) => s.longestCookMinutes >= 180 },
  { id: 'level_5', name: 'Commis', description: 'Reach level 5.', icon: '🎖️', coins: 50, check: (s) => s.level >= 5 },
  { id: 'level_10', name: 'Head of the Pass', description: 'Reach level 10.', icon: '🏆', coins: 150, check: (s) => s.level >= 10 },
  { id: 'pantry_25', name: 'Well Stocked', description: 'Own 25 ingredients.', icon: '🧺', coins: 50, check: (s) => s.pantry >= 25 },
  { id: 'stylish', name: 'Dressed to Grill', description: 'Buy your first outfit or decor.', icon: '🎩', coins: 20, check: (s) => s.cosmeticsBought >= 1 },
];

export const ACHIEVEMENT_BY_ID: Record<string, Achievement> = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));
