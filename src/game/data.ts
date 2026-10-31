import type { Cuisine, CuisineId, Ingredient, Recipe } from './types.ts';

export const CUISINES: Cuisine[] = [
  { id: 'italian', name: 'Italian', emoji: '🍝', tagline: 'Pasta, pomodoro & passion', color: '#d94a3d', unlockCost: 120 },
  { id: 'japanese', name: 'Japanese', emoji: '🍣', tagline: 'Rice, umami & precision', color: '#e06b8b', unlockCost: 120 },
  { id: 'mexican', name: 'Mexican', emoji: '🌮', tagline: 'Tortillas, chiles & fire', color: '#2f9e5b', unlockCost: 120 },
  { id: 'indian', name: 'Indian', emoji: '🍛', tagline: 'Spice, slow-cooks & tadka', color: '#e89a1c', unlockCost: 120 },
  { id: 'french', name: 'French', emoji: '🥐', tagline: 'Butter, technique & finesse', color: '#3d6fd9', unlockCost: 120 },
];

/** Free starter pantry granted when a cuisine is chosen / unlocked. */
export const STARTER_PACKS: Record<CuisineId, string[]> = {
  italian: ['pasta', 'tomato', 'olive_oil', 'parmesan', 'ciabatta', 'garlic'],
  japanese: ['rice_jp', 'soy_sauce', 'eggs', 'scallions', 'nori'],
  mexican: ['tortillas', 'black_beans', 'onion', 'lime', 'tomato', 'cheese_mx'],
  indian: ['basmati', 'red_lentils', 'onion', 'garlic', 'turmeric', 'cumin'],
  french: ['baguette', 'butter', 'eggs', 'flour', 'milk'],
};

/** Always in the cupboard; never listed as requirements. */
export const STAPLES = ['Salt', 'Black pepper', 'Cooking oil', 'Sugar', 'Water'];

const ing = (
  id: string,
  name: string,
  emoji: string,
  cuisine: Ingredient['cuisine'],
  price: number,
  minLevel = 1,
): Ingredient => ({ id, name, emoji, cuisine, price, minLevel });

export const INGREDIENTS: Ingredient[] = [
  // Common – useful across cuisines
  ing('eggs', 'Eggs', '🥚', 'common', 20),
  ing('onion', 'Onions', '🧅', 'common', 10),
  ing('garlic', 'Garlic', '🧄', 'common', 10),
  ing('tomato', 'Tomatoes', '🍅', 'common', 15),
  ing('butter', 'Butter', '🧈', 'common', 20),
  ing('flour', 'Flour', '🌾', 'common', 15),
  ing('milk', 'Milk', '🥛', 'common', 15),
  ing('lemon', 'Lemons', '🍋', 'common', 15),
  ing('potatoes', 'Potatoes', '🥔', 'common', 15),
  ing('chicken', 'Chicken thighs', '🍗', 'common', 45, 2),
  ing('mushrooms', 'Mushrooms', '🍄', 'common', 30, 3),
  ing('carrots', 'Carrots', '🥕', 'common', 15, 3),
  ing('cream', 'Double cream', '🍶', 'common', 30, 3),
  ing('white_wine', 'Dry white wine', '🥂', 'common', 40, 4),
  ing('beef_mince', 'Beef mince', '🥩', 'common', 50, 4),

  // Italian
  ing('pasta', 'Dried spaghetti', '🍝', 'italian', 20),
  ing('olive_oil', 'Extra-virgin olive oil', '🫒', 'italian', 25),
  ing('parmesan', 'Parmigiano', '🧀', 'italian', 35),
  ing('ciabatta', 'Ciabatta', '🥖', 'italian', 15),
  ing('basil', 'Fresh basil', '🌿', 'italian', 15),
  ing('mozzarella', 'Mozzarella', '⚪', 'italian', 30, 2),
  ing('pancetta', 'Pancetta / guanciale', '🥓', 'italian', 40, 3),
  ing('arborio', 'Arborio rice', '🍚', 'italian', 40, 4),
  ing('lasagne', 'Lasagne sheets', '🟨', 'italian', 30, 6),
  ing('ricotta', 'Ricotta', '🥣', 'italian', 35, 6),
  ing('mascarpone', 'Mascarpone', '🍨', 'italian', 55, 8),
  ing('espresso', 'Espresso', '☕', 'italian', 35, 8),
  ing('ladyfingers', 'Savoiardi biscuits', '🍪', 'italian', 40, 8),
  ing('cocoa', 'Cocoa powder', '🟫', 'italian', 25, 8),
  ing('flour_00', '"00" pasta flour', '🌾', 'italian', 40, 9),

  // Japanese
  ing('rice_jp', 'Short-grain rice', '🍚', 'japanese', 25),
  ing('soy_sauce', 'Soy sauce', '🫙', 'japanese', 20),
  ing('scallions', 'Spring onions', '🌱', 'japanese', 10),
  ing('nori', 'Nori sheets', '🟩', 'japanese', 20),
  ing('mirin', 'Mirin', '🍶', 'japanese', 25),
  ing('dashi', 'Dashi stock', '🐟', 'japanese', 30, 2),
  ing('miso', 'White miso', '🥣', 'japanese', 30, 2),
  ing('tofu', 'Silken tofu', '🧊', 'japanese', 20, 2),
  ing('sake', 'Cooking sake', '🍶', 'japanese', 35, 3),
  ing('rice_vinegar', 'Rice vinegar', '🧴', 'japanese', 20, 5),
  ing('salmon', 'Sashimi-grade salmon', '🐟', 'japanese', 70, 5),
  ing('panko', 'Panko breadcrumbs', '🍞', 'japanese', 20, 6),
  ing('pork_loin', 'Pork loin', '🥩', 'japanese', 55, 6),
  ing('cabbage', 'Cabbage', '🥬', 'japanese', 15, 6),
  ing('pork_belly', 'Pork belly', '🥓', 'japanese', 65, 7),
  ing('ramen', 'Fresh ramen noodles', '🍜', 'japanese', 40, 10),

  // Mexican
  ing('tortillas', 'Corn tortillas', '🫓', 'mexican', 15),
  ing('black_beans', 'Black beans', '🫘', 'mexican', 15),
  ing('lime', 'Limes', '🍋‍🟩', 'mexican', 15),
  ing('cheese_mx', 'Oaxaca cheese', '🧀', 'mexican', 30),
  ing('cilantro', 'Coriander', '🌿', 'mexican', 10),
  ing('jalapeno', 'Jalapeños', '🌶️', 'mexican', 15),
  ing('avocado', 'Avocados', '🥑', 'mexican', 30, 2),
  ing('chipotle', 'Chipotle in adobo', '🥫', 'mexican', 30, 4),
  ing('rice_mx', 'Long-grain rice', '🍚', 'mexican', 20, 5),
  ing('cumin_mx', 'Ground cumin', '🟤', 'mexican', 15, 6),
  ing('pork_shoulder', 'Pork shoulder', '🍖', 'mexican', 60, 6),
  ing('ancho', 'Dried ancho chiles', '🌶️', 'mexican', 35, 7),
  ing('masa', 'Masa harina', '🌽', 'mexican', 35, 10),
  ing('corn_husks', 'Corn husks', '🌽', 'mexican', 25, 10),
  ing('chocolate_mx', 'Mexican chocolate', '🍫', 'mexican', 45, 12),
  ing('sesame', 'Sesame seeds', '⚪', 'mexican', 20, 12),

  // Indian
  ing('basmati', 'Basmati rice', '🍚', 'indian', 25),
  ing('red_lentils', 'Red lentils', '🟠', 'indian', 15),
  ing('turmeric', 'Turmeric', '🟡', 'indian', 15),
  ing('cumin', 'Cumin seeds', '🟤', 'indian', 15),
  ing('chilli_powder', 'Kashmiri chilli', '🌶️', 'indian', 15),
  ing('ginger', 'Fresh ginger', '🫚', 'indian', 15, 2),
  ing('garam_masala', 'Garam masala', '🟫', 'indian', 25, 3),
  ing('chickpeas', 'Chickpeas', '🫘', 'indian', 15, 3),
  ing('cauliflower', 'Cauliflower', '🥦', 'indian', 20, 3),
  ing('ghee', 'Ghee', '🧈', 'indian', 30, 4),
  ing('spinach', 'Spinach', '🥬', 'indian', 20, 5),
  ing('paneer', 'Paneer', '🧀', 'indian', 45, 5),
  ing('yogurt', 'Plain yogurt', '🥛', 'indian', 20, 7),
  ing('cardamom', 'Green cardamom', '🟢', 'indian', 35, 10),

  // French
  ing('baguette', 'Baguette', '🥖', 'french', 15),
  ing('chives', 'Chives', '🌱', 'french', 10),
  ing('gruyere', 'Gruyère', '🧀', 'french', 45, 2),
  ing('ham', 'Jambon (ham)', '🍖', 'french', 35, 2),
  ing('leeks', 'Leeks', '🥬', 'french', 15, 3),
  ing('pastry', 'Shortcrust pastry', '🥧', 'french', 30, 4),
  ing('lardons', 'Lardons', '🥓', 'french', 40, 4),
  ing('thyme', 'Thyme', '🌿', 'french', 15, 5),
  ing('beef_stock', 'Beef stock', '🥣', 'french', 25, 5),
  ing('aubergine', 'Aubergine', '🍆', 'french', 20, 6),
  ing('courgette', 'Courgette', '🥒', 'french', 15, 6),
  ing('bell_pepper', 'Bell peppers', '🫑', 'french', 15, 6),
  ing('red_wine', 'Burgundy red wine', '🍷', 'french', 60, 8),
  ing('beef_chuck', 'Beef chuck', '🥩', 'french', 80, 10),
  ing('dark_choc', 'Dark chocolate 70%', '🍫', 'french', 50, 12),
];

/** Rewards scale with difficulty so tougher dishes are worth more. */
const REWARDS: Record<Recipe['difficulty'], { xp: number; coins: number }> = {
  1: { xp: 40, coins: 25 },
  2: { xp: 70, coins: 40 },
  3: { xp: 110, coins: 60 },
  4: { xp: 160, coins: 85 },
  5: { xp: 230, coins: 120 },
};

type RecipeInput = Omit<Recipe, 'xp' | 'coins'> & { xp?: number; coins?: number };
const recipe = (r: RecipeInput): Recipe => ({ ...REWARDS[r.difficulty], ...r });

export const RECIPES: Recipe[] = [
  // ───────────── ITALIAN ─────────────
  recipe({
    id: 'it_bruschetta', cuisine: 'italian', name: 'Bruschetta al Pomodoro', emoji: '🍅', level: 1, difficulty: 1, minutes: 15, servings: 2,
    description: 'Charred bread rubbed with garlic and piled with juicy tomatoes.',
    ingredients: ['ciabatta', 'tomato', 'garlic', 'olive_oil'],
    steps: [
      'Dice 3 ripe tomatoes, season with salt and a glug of olive oil. Leave 5 minutes.',
      'Slice the ciabatta thickly and toast or griddle until charred at the edges.',
      'Rub each warm slice with a halved garlic clove.',
      'Spoon over the tomatoes, finish with more oil and black pepper.',
    ],
  }),
  recipe({
    id: 'it_aglio', cuisine: 'italian', name: 'Spaghetti Aglio e Olio', emoji: '🍝', level: 1, difficulty: 1, minutes: 20, servings: 2,
    description: 'The midnight pasta: garlic, oil, and a shower of Parmigiano.',
    ingredients: ['pasta', 'garlic', 'olive_oil', 'parmesan'],
    steps: [
      'Boil 200 g spaghetti in well-salted water until just al dente.',
      'Meanwhile, gently fry 4 thinly sliced garlic cloves in 5 tbsp olive oil until pale gold.',
      'Add a ladle of pasta water to the pan and swirl to emulsify.',
      'Toss in the drained pasta until glossy. Serve with grated Parmigiano.',
    ],
  }),
  recipe({
    id: 'it_pomodoro', cuisine: 'italian', name: 'Pasta al Pomodoro', emoji: '🍝', level: 1, difficulty: 2, minutes: 30, servings: 2,
    description: 'A silky tomato sauce lifted with torn basil.',
    ingredients: ['pasta', 'tomato', 'garlic', 'olive_oil', 'basil'],
    steps: [
      'Soften 2 sliced garlic cloves in olive oil without colouring.',
      'Add 500 g chopped tomatoes and a pinch of salt; simmer 15 minutes until thick.',
      'Cook the spaghetti; reserve a cup of pasta water.',
      'Toss pasta through the sauce with a splash of pasta water.',
      'Tear in fresh basil and finish with good olive oil.',
    ],
  }),
  recipe({
    id: 'it_caprese', cuisine: 'italian', name: 'Insalata Caprese', emoji: '🥗', level: 2, difficulty: 1, minutes: 10, servings: 2,
    description: 'Red, white & green — the flag on a plate.',
    ingredients: ['tomato', 'mozzarella', 'basil', 'olive_oil'],
    steps: [
      'Slice tomatoes and mozzarella into even rounds.',
      'Alternate them on a plate, tucking basil leaves between.',
      'Season with flaky salt and pepper; drizzle with olive oil.',
    ],
  }),
  recipe({
    id: 'it_carbonara', cuisine: 'italian', name: 'Spaghetti Carbonara', emoji: '🥓', level: 3, difficulty: 2, minutes: 25, servings: 2,
    description: 'Creamy without cream — eggs, cheese and crisp pancetta.',
    ingredients: ['pasta', 'eggs', 'pancetta', 'parmesan'],
    steps: [
      'Whisk 3 egg yolks + 1 whole egg with 50 g grated Parmigiano and lots of black pepper.',
      'Render 120 g diced pancetta in a dry pan until crisp. Take off the heat.',
      'Cook spaghetti; transfer to the pancetta pan with a splash of pasta water.',
      'Off the heat, pour in the egg mix and toss fast until creamy, not scrambled.',
      'Serve immediately with more cheese and pepper.',
    ],
  }),
  recipe({
    id: 'it_risotto', cuisine: 'italian', name: 'Risotto ai Funghi', emoji: '🍄', level: 4, difficulty: 3, minutes: 40, servings: 2,
    description: 'Patience in a pan: stir, ladle, repeat.',
    ingredients: ['arborio', 'mushrooms', 'onion', 'white_wine', 'parmesan', 'butter'],
    steps: [
      'Fry sliced mushrooms in butter until golden; set aside.',
      'Soften a finely diced onion in butter, then toast 160 g arborio for 1 minute.',
      'Add a glass of white wine and stir until absorbed.',
      'Add hot stock (or salted water) a ladle at a time, stirring, for ~18 minutes.',
      'Fold in the mushrooms, a knob of butter and Parmigiano. Rest 2 minutes, then serve loose.',
    ],
  }),
  recipe({
    id: 'it_bolognese', cuisine: 'italian', name: 'Ragù alla Bolognese', emoji: '🍖', level: 5, difficulty: 3, minutes: 120, servings: 4,
    description: 'Low and slow meat sauce — the Sunday classic.',
    ingredients: ['beef_mince', 'onion', 'carrots', 'tomato', 'white_wine', 'milk', 'pasta'],
    steps: [
      'Finely dice onion and carrot; soften gently in oil for 10 minutes.',
      'Add the mince and brown well, breaking it up.',
      'Pour in a glass of white wine and let it bubble away.',
      'Add 400 g chopped tomatoes and 150 ml milk. Simmer very low for 1½–2 hours.',
      'Toss through pasta (tagliatelle if you have it) and serve with Parmigiano.',
    ],
  }),
  recipe({
    id: 'it_lasagne', cuisine: 'italian', name: 'Lasagne al Forno', emoji: '🟨', level: 6, difficulty: 4, minutes: 150, servings: 6,
    description: 'Layers of ragù, ricotta and bubbling mozzarella.',
    ingredients: ['lasagne', 'beef_mince', 'tomato', 'onion', 'ricotta', 'mozzarella', 'parmesan'],
    steps: [
      'Make a quick ragù: brown the mince with onion, add tomatoes and simmer 40 minutes.',
      'Mix ricotta with a handful of Parmigiano, salt and pepper.',
      'Layer: ragù, lasagne sheets, ricotta, mozzarella. Repeat 3–4 times, finishing with ragù.',
      'Top with mozzarella and Parmigiano.',
      'Bake covered at 190 °C for 25 minutes, uncovered 20 more until golden.',
      'Rest 15 minutes before slicing.',
    ],
  }),
  recipe({
    id: 'it_tiramisu', cuisine: 'italian', name: 'Tiramisù', emoji: '☕', level: 8, difficulty: 4, minutes: 30, servings: 6,
    description: '"Pick me up" — coffee-soaked biscuits and mascarpone clouds.',
    ingredients: ['mascarpone', 'eggs', 'espresso', 'ladyfingers', 'cocoa'],
    steps: [
      'Whisk 4 egg yolks with 80 g sugar until pale and thick.',
      'Beat in 500 g mascarpone until smooth.',
      'Whip 2 egg whites to soft peaks and fold through.',
      'Dip savoiardi briefly in cooled espresso and layer in a dish.',
      'Alternate cream and biscuits, ending with cream. Chill 6 hours.',
      'Dust generously with cocoa to serve.',
    ],
  }),
  recipe({
    id: 'it_tagliatelle', cuisine: 'italian', name: 'Handmade Tagliatelle', emoji: '🍜', level: 10, difficulty: 5, minutes: 90, servings: 4,
    description: 'Flour, eggs and elbow grease — pasta from scratch.',
    ingredients: ['flour_00', 'eggs', 'butter', 'parmesan'],
    steps: [
      'Make a well in 400 g "00" flour, crack in 4 eggs and mix with a fork.',
      'Knead 10 minutes until silky. Wrap and rest 30 minutes.',
      'Roll very thin (you should see your hand through it).',
      'Dust with flour, fold loosely and cut 7 mm ribbons.',
      'Cook 2 minutes in salted water. Toss with butter, pasta water and Parmigiano.',
    ],
  }),

  // ───────────── JAPANESE ─────────────
  recipe({
    id: 'jp_onigiri', cuisine: 'japanese', name: 'Onigiri', emoji: '🍙', level: 1, difficulty: 1, minutes: 30, servings: 2,
    description: 'Hand-pressed rice triangles wrapped in nori.',
    ingredients: ['rice_jp', 'nori'],
    steps: [
      'Rinse 1 cup rice until the water runs clear, then cook it.',
      'Wet and salt your hands.',
      'Take a handful of warm rice and press into a firm triangle.',
      'Wrap the base with a strip of nori.',
    ],
  }),
  recipe({
    id: 'jp_tkg', cuisine: 'japanese', name: 'Tamago Kake Gohan', emoji: '🥚', level: 1, difficulty: 1, minutes: 5, servings: 1,
    description: 'Hot rice, raw egg, soy — the ultimate comfort breakfast.',
    ingredients: ['rice_jp', 'eggs', 'soy_sauce', 'scallions'],
    steps: [
      'Put a bowl of steaming hot rice in front of you.',
      'Make a dip and crack in a very fresh egg.',
      'Add soy sauce and whip with chopsticks until fluffy.',
      'Top with sliced spring onions.',
    ],
  }),
  recipe({
    id: 'jp_tamagoyaki', cuisine: 'japanese', name: 'Tamagoyaki', emoji: '🍳', level: 2, difficulty: 2, minutes: 15, servings: 2,
    description: 'Sweet rolled omelette, layer by layer.',
    ingredients: ['eggs', 'soy_sauce', 'mirin'],
    steps: [
      'Beat 4 eggs with 1 tbsp mirin, 1 tsp soy and 1 tsp sugar.',
      'Oil a pan over medium-low and pour in a thin layer.',
      'When just set, roll it to one side.',
      'Pour another thin layer, lifting the roll so egg flows underneath; roll again.',
      'Repeat until done. Rest, then slice.',
    ],
  }),
  recipe({
    id: 'jp_miso', cuisine: 'japanese', name: 'Miso Soup', emoji: '🥣', level: 2, difficulty: 1, minutes: 10, servings: 2,
    description: 'Dashi, miso and silky tofu.',
    ingredients: ['dashi', 'miso', 'tofu', 'scallions'],
    steps: [
      'Heat 500 ml dashi until steaming (do not boil).',
      'Add cubes of silken tofu and warm through.',
      'Whisk 2 tbsp miso with a little dashi, then stir it back in.',
      'Serve with sliced spring onions.',
    ],
  }),
  recipe({
    id: 'jp_teriyaki', cuisine: 'japanese', name: 'Chicken Teriyaki', emoji: '🍗', level: 3, difficulty: 2, minutes: 25, servings: 2,
    description: 'Crispy-skinned chicken in a sticky glossy glaze.',
    ingredients: ['chicken', 'soy_sauce', 'mirin', 'sake', 'rice_jp'],
    steps: [
      'Mix 3 tbsp each soy, mirin and sake with 1 tbsp sugar.',
      'Fry chicken thighs skin-side down until very crisp, then flip.',
      'Pour off excess fat, add the sauce and bubble, spooning over, until glossy.',
      'Slice and serve over rice with the pan glaze.',
    ],
  }),
  recipe({
    id: 'jp_oyakodon', cuisine: 'japanese', name: 'Oyakodon', emoji: '🍲', level: 4, difficulty: 2, minutes: 25, servings: 2,
    description: '"Parent and child" — chicken and egg over rice.',
    ingredients: ['chicken', 'eggs', 'onion', 'dashi', 'soy_sauce', 'mirin', 'rice_jp'],
    steps: [
      'Simmer 150 ml dashi with 2 tbsp each soy and mirin and a sliced onion for 3 minutes.',
      'Add bite-size chicken and cook through.',
      'Pour over 3 lightly beaten eggs; cover and cook 1 minute until just set.',
      'Slide over bowls of hot rice.',
    ],
  }),
  recipe({
    id: 'jp_maki', cuisine: 'japanese', name: 'Salmon Maki Rolls', emoji: '🍣', level: 5, difficulty: 3, minutes: 60, servings: 2,
    description: 'Seasoned sushi rice rolled tight around salmon.',
    ingredients: ['rice_jp', 'rice_vinegar', 'nori', 'salmon'],
    steps: [
      'Cook rice; fold in 3 tbsp rice vinegar, 1 tbsp sugar and 1 tsp salt. Fan to cool.',
      'Lay nori shiny-side down on a mat. Spread rice thinly, leaving a 2 cm strip bare.',
      'Lay a line of salmon strips across the rice.',
      'Roll tightly with the mat, sealing with a dab of water.',
      'Slice with a wet sharp knife into 6–8 pieces.',
    ],
  }),
  recipe({
    id: 'jp_tonkatsu', cuisine: 'japanese', name: 'Tonkatsu', emoji: '🐖', level: 6, difficulty: 3, minutes: 35, servings: 2,
    description: 'Panko-crusted pork cutlet with shredded cabbage.',
    ingredients: ['pork_loin', 'panko', 'flour', 'eggs', 'cabbage', 'rice_jp'],
    steps: [
      'Pound pork loin steaks to 1.5 cm and season.',
      'Dredge in flour, then beaten egg, then press into panko.',
      'Shallow-fry at 170 °C for 3–4 minutes per side until deep golden.',
      'Rest on a rack 2 minutes, then slice.',
      'Serve with finely shredded cabbage and rice.',
    ],
  }),
  recipe({
    id: 'jp_okonomiyaki', cuisine: 'japanese', name: 'Okonomiyaki', emoji: '🥞', level: 7, difficulty: 3, minutes: 30, servings: 2,
    description: 'Savoury cabbage pancake, "grilled as you like it".',
    ingredients: ['flour', 'cabbage', 'eggs', 'pork_belly', 'dashi', 'scallions'],
    steps: [
      'Whisk 100 g flour with 120 ml dashi and 2 eggs.',
      'Fold in 300 g finely shredded cabbage and spring onions.',
      'Pour into an oiled pan, lay thin pork belly slices on top.',
      'Cook 5 minutes, flip, cook 5 more until the pork is crisp.',
      'Top with mayo and okonomi sauce if you have them.',
    ],
  }),
  recipe({
    id: 'jp_ramen', cuisine: 'japanese', name: 'Shoyu Ramen', emoji: '🍜', level: 10, difficulty: 5, minutes: 240, servings: 4,
    description: 'Rolled chashu, jammy eggs and a deep soy broth.',
    ingredients: ['ramen', 'pork_belly', 'soy_sauce', 'mirin', 'sake', 'eggs', 'scallions', 'garlic'],
    steps: [
      'Roll and tie pork belly; braise 2 hours in soy, mirin, sake, garlic and water.',
      'Boil eggs 6½ minutes, ice, peel, and marinate in some of the braising liquid.',
      'Make broth: simmer stock with a splash of the braise (the "tare") to taste.',
      'Slice the chashu and blowtorch or sear it.',
      'Cook noodles, add to bowls of hot broth; top with chashu, halved egg and spring onions.',
    ],
  }),

  // ───────────── MEXICAN ─────────────
  recipe({
    id: 'mx_quesadilla', cuisine: 'mexican', name: 'Quesadillas', emoji: '🧀', level: 1, difficulty: 1, minutes: 10, servings: 2,
    description: 'Melty cheese folded in a toasted tortilla.',
    ingredients: ['tortillas', 'cheese_mx'],
    steps: [
      'Heat a dry pan over medium heat.',
      'Lay in a tortilla and scatter cheese over half.',
      'Fold, press, and cook until spotty-brown on both sides and the cheese is molten.',
    ],
  }),
  recipe({
    id: 'mx_tostadas', cuisine: 'mexican', name: 'Black Bean Tostadas', emoji: '🫘', level: 1, difficulty: 1, minutes: 20, servings: 2,
    description: 'Crisp tortillas heaped with smashed beans.',
    ingredients: ['tortillas', 'black_beans', 'onion', 'cheese_mx', 'tomato'],
    steps: [
      'Brush tortillas with oil and bake at 200 °C for 8 minutes until crisp.',
      'Fry half a diced onion, add the beans and mash with a splash of water.',
      'Spread beans over the tostadas.',
      'Top with diced tomato, the remaining onion and crumbled cheese.',
    ],
  }),
  recipe({
    id: 'mx_pico', cuisine: 'mexican', name: 'Pico de Gallo', emoji: '🍅', level: 1, difficulty: 1, minutes: 10, servings: 4,
    description: 'Fresh, punchy chopped salsa.',
    ingredients: ['tomato', 'onion', 'lime', 'cilantro', 'jalapeno'],
    steps: [
      'Finely dice tomatoes, half an onion and a jalapeño.',
      'Chop a handful of coriander.',
      'Combine with lime juice and salt. Rest 10 minutes before serving.',
    ],
  }),
  recipe({
    id: 'mx_guac', cuisine: 'mexican', name: 'Guacamole', emoji: '🥑', level: 2, difficulty: 1, minutes: 10, servings: 4,
    description: 'Chunky avocado with lime and chile.',
    ingredients: ['avocado', 'lime', 'onion', 'cilantro', 'jalapeno'],
    steps: [
      'Mash 2 ripe avocados roughly with a fork.',
      'Fold in finely diced onion, jalapeño and chopped coriander.',
      'Season with lime juice and salt to taste.',
    ],
  }),
  recipe({
    id: 'mx_rancheros', cuisine: 'mexican', name: 'Huevos Rancheros', emoji: '🍳', level: 3, difficulty: 2, minutes: 25, servings: 2,
    description: 'Fried eggs on tortillas with a quick ranchera salsa.',
    ingredients: ['eggs', 'tortillas', 'tomato', 'onion', 'jalapeno', 'black_beans'],
    steps: [
      'Blend tomatoes, onion and jalapeño; simmer in oil 10 minutes to make salsa.',
      'Warm the black beans.',
      'Lightly fry tortillas until pliable.',
      'Fry eggs sunny-side up.',
      'Stack: tortilla, beans, egg, then smother in salsa.',
    ],
  }),
  recipe({
    id: 'mx_tinga', cuisine: 'mexican', name: 'Chicken Tinga Tacos', emoji: '🌮', level: 4, difficulty: 2, minutes: 40, servings: 4,
    description: 'Smoky shredded chicken in chipotle-tomato sauce.',
    ingredients: ['chicken', 'chipotle', 'tomato', 'onion', 'tortillas', 'garlic'],
    steps: [
      'Poach chicken thighs in salted water 20 minutes; shred.',
      'Blend tomatoes, 2 chipotles, garlic and a splash of adobo.',
      'Fry sliced onion until soft, add the sauce and simmer 5 minutes.',
      'Stir in the chicken and cook until saucy.',
      'Pile onto warm tortillas.',
    ],
  }),
  recipe({
    id: 'mx_rice', cuisine: 'mexican', name: 'Arroz Rojo', emoji: '🍚', level: 5, difficulty: 2, minutes: 35, servings: 4,
    description: 'Toasty red rice simmered in tomato.',
    ingredients: ['rice_mx', 'tomato', 'onion', 'garlic'],
    steps: [
      'Rinse 1 cup rice and dry well.',
      'Fry in oil until golden and nutty.',
      'Blend 2 tomatoes, ¼ onion and a garlic clove; add to the rice and fry 2 minutes.',
      'Add 1½ cups water and salt; cover and cook on low 18 minutes. Rest 5.',
    ],
  }),
  recipe({
    id: 'mx_carnitas', cuisine: 'mexican', name: 'Carnitas', emoji: '🍖', level: 6, difficulty: 3, minutes: 180, servings: 6,
    description: 'Slow-braised pork, crisped in its own fat.',
    ingredients: ['pork_shoulder', 'lime', 'onion', 'garlic', 'cumin_mx', 'tortillas'],
    steps: [
      'Cut pork shoulder into large chunks; season with salt and cumin.',
      'Put in a pot with onion, garlic, lime juice and water to just cover.',
      'Simmer uncovered 2½ hours until the liquid evaporates and fat renders.',
      'Let the pork fry in its fat until crisp at the edges; shred.',
      'Serve in tortillas with pico de gallo.',
    ],
  }),
  recipe({
    id: 'mx_enchiladas', cuisine: 'mexican', name: 'Enchiladas Rojas', emoji: '🌯', level: 7, difficulty: 3, minutes: 60, servings: 4,
    description: 'Tortillas rolled around chicken in an ancho chile sauce.',
    ingredients: ['tortillas', 'ancho', 'chicken', 'cheese_mx', 'onion', 'garlic'],
    steps: [
      'Toast and soak 4 ancho chiles in hot water 20 minutes.',
      'Blend with garlic, onion and soaking water; fry the sauce 10 minutes.',
      'Dip tortillas in sauce, fill with shredded chicken and roll.',
      'Line up in a dish, cover with remaining sauce and cheese.',
      'Bake at 190 °C for 15 minutes.',
    ],
  }),
  recipe({
    id: 'mx_tamales', cuisine: 'mexican', name: 'Tamales de Puerco', emoji: '🌽', level: 10, difficulty: 5, minutes: 240, servings: 12,
    description: 'Steamed masa parcels with red chile pork.',
    ingredients: ['masa', 'corn_husks', 'pork_shoulder', 'ancho', 'garlic', 'cumin_mx'],
    steps: [
      'Soak corn husks in hot water for 1 hour.',
      'Simmer pork until tender; shred. Mix with blended ancho-garlic sauce.',
      'Beat masa harina with fat, broth and salt until a dab floats in water.',
      'Spread masa on each husk, add a spoon of pork, fold up.',
      'Steam upright for 1–1½ hours, until the masa pulls from the husk.',
    ],
  }),
  recipe({
    id: 'mx_mole', cuisine: 'mexican', name: 'Mole Poblano', emoji: '🍫', level: 12, difficulty: 5, minutes: 240, servings: 8,
    description: 'The legendary sauce of chiles, spice and chocolate.',
    ingredients: ['ancho', 'chocolate_mx', 'chicken', 'tomato', 'onion', 'garlic', 'sesame'],
    steps: [
      'Toast and soak the chiles; toast sesame seeds separately.',
      'Char the tomatoes, onion and garlic.',
      'Blend everything (keep some sesame for garnish) with stock until very smooth.',
      'Fry the paste in oil, stirring, for 20 minutes; melt in the chocolate.',
      'Simmer with poached chicken for 30 minutes. Garnish with sesame.',
    ],
  }),

  // ───────────── INDIAN ─────────────
  recipe({
    id: 'in_jeera', cuisine: 'indian', name: 'Jeera Rice', emoji: '🍚', level: 1, difficulty: 1, minutes: 25, servings: 2,
    description: 'Fluffy basmati perfumed with toasted cumin.',
    ingredients: ['basmati', 'cumin', 'onion'],
    steps: [
      'Rinse 1 cup basmati and soak 15 minutes.',
      'Fry 1 tsp cumin seeds in oil until they crackle, then add sliced onion.',
      'Add the drained rice, 1¾ cups water and salt.',
      'Cover and cook on low 12 minutes. Rest 5, then fluff.',
    ],
  }),
  recipe({
    id: 'in_dal', cuisine: 'indian', name: 'Tadka Dal', emoji: '🍲', level: 1, difficulty: 1, minutes: 35, servings: 3,
    description: 'Comforting lentils finished with a sizzling tempering.',
    ingredients: ['red_lentils', 'onion', 'garlic', 'turmeric', 'cumin'],
    steps: [
      'Simmer 1 cup red lentils with 3 cups water and ½ tsp turmeric for 20 minutes.',
      'Season with salt and whisk until creamy.',
      'For the tadka: fry cumin seeds, then sliced garlic and onion in hot oil until golden.',
      'Pour the sizzling tadka over the dal.',
    ],
  }),
  recipe({
    id: 'in_omelette', cuisine: 'indian', name: 'Masala Omelette', emoji: '🍳', level: 2, difficulty: 1, minutes: 10, servings: 1,
    description: 'Street-style spiced omelette.',
    ingredients: ['eggs', 'onion', 'tomato', 'turmeric', 'chilli_powder'],
    steps: [
      'Beat 3 eggs with finely diced onion and tomato.',
      'Add a pinch each of turmeric, chilli and salt.',
      'Cook in an oiled pan over medium heat, then fold.',
    ],
  }),
  recipe({
    id: 'in_chana', cuisine: 'indian', name: 'Chana Masala', emoji: '🫘', level: 3, difficulty: 2, minutes: 40, servings: 4,
    description: 'Tangy, spicy chickpea curry.',
    ingredients: ['chickpeas', 'onion', 'tomato', 'garlic', 'ginger', 'garam_masala'],
    steps: [
      'Fry a diced onion until deep golden.',
      'Add grated garlic and ginger, cook 1 minute.',
      'Add 2 tsp garam masala, then chopped tomatoes; cook down to a thick masala.',
      'Add chickpeas and a cup of water; simmer 15 minutes, mashing a few.',
    ],
  }),
  recipe({
    id: 'in_aloogobi', cuisine: 'indian', name: 'Aloo Gobi', emoji: '🥔', level: 3, difficulty: 2, minutes: 35, servings: 3,
    description: 'Dry-spiced potato and cauliflower.',
    ingredients: ['potatoes', 'cauliflower', 'turmeric', 'cumin', 'ginger'],
    steps: [
      'Crackle cumin seeds in oil.',
      'Add cubed potatoes and cauliflower florets with turmeric, ginger and salt.',
      'Cover and cook on low 20 minutes, stirring now and then.',
      'Uncover and fry until edges catch and colour.',
    ],
  }),
  recipe({
    id: 'in_chapati', cuisine: 'indian', name: 'Chapati', emoji: '🫓', level: 4, difficulty: 2, minutes: 40, servings: 4,
    description: 'Soft, puffy flatbreads straight from the pan.',
    ingredients: ['flour', 'ghee'],
    steps: [
      'Mix 2 cups flour with salt and enough warm water to make a soft dough. Knead 5 minutes.',
      'Rest 20 minutes, then divide into 8 balls.',
      'Roll each into a thin round.',
      'Cook on a hot dry pan, flipping, pressing the edges so it puffs.',
      'Brush with ghee and keep wrapped in a cloth.',
    ],
  }),
  recipe({
    id: 'in_palak', cuisine: 'indian', name: 'Palak Paneer', emoji: '🥬', level: 5, difficulty: 3, minutes: 40, servings: 3,
    description: 'Golden paneer in a vivid spinach sauce.',
    ingredients: ['spinach', 'paneer', 'onion', 'garlic', 'ginger', 'cream', 'garam_masala'],
    steps: [
      'Blanch spinach 1 minute, plunge into ice water, then blend smooth.',
      'Fry paneer cubes until golden; set aside.',
      'Fry onion, garlic and ginger; add garam masala.',
      'Stir in the spinach purée and simmer 5 minutes.',
      'Add paneer and a swirl of cream.',
    ],
  }),
  recipe({
    id: 'in_butterchicken', cuisine: 'indian', name: 'Butter Chicken', emoji: '🍗', level: 7, difficulty: 3, minutes: 60, servings: 4,
    description: 'Charred tandoori-style chicken in a velvety tomato sauce.',
    ingredients: ['chicken', 'yogurt', 'butter', 'tomato', 'cream', 'garam_masala', 'ginger', 'garlic'],
    steps: [
      'Marinate chicken in yogurt, garlic, ginger, garam masala and chilli for 1 hour.',
      'Grill or pan-sear until charred.',
      'Melt butter, add tomatoes, ginger and garlic; simmer 15 minutes and blend.',
      'Add cream and the chicken; simmer 10 minutes.',
      'Finish with a knob of butter.',
    ],
  }),
  recipe({
    id: 'in_biryani', cuisine: 'indian', name: 'Chicken Biryani', emoji: '🍛', level: 10, difficulty: 5, minutes: 120, servings: 6,
    description: 'Layered, steam-sealed rice and spiced chicken.',
    ingredients: ['basmati', 'chicken', 'yogurt', 'onion', 'ginger', 'garlic', 'garam_masala', 'cardamom', 'ghee'],
    steps: [
      'Marinate chicken in yogurt, ginger, garlic and garam masala for 2 hours.',
      'Fry thinly sliced onions in ghee until deep brown and crisp.',
      'Par-boil soaked basmati with cardamom for 5 minutes; drain.',
      'Layer chicken, half the onions, then rice in a heavy pot. Drizzle ghee.',
      'Seal tightly and cook on very low heat for 35 minutes ("dum").',
      'Rest 10 minutes, then gently mix and serve with the remaining onions.',
    ],
  }),

  // ───────────── FRENCH ─────────────
  recipe({
    id: 'fr_crepes', cuisine: 'french', name: 'Crêpes', emoji: '🥞', level: 1, difficulty: 1, minutes: 30, servings: 4,
    description: 'Paper-thin pancakes, sweet or savoury.',
    ingredients: ['flour', 'eggs', 'milk', 'butter'],
    steps: [
      'Whisk 125 g flour, 2 eggs, 300 ml milk, a pinch of salt and 1 tbsp melted butter.',
      'Rest the batter 15 minutes.',
      'Butter a hot pan, pour a small ladle and swirl thin.',
      'Cook 1 minute, flip, 30 seconds more. Serve with sugar and lemon.',
    ],
  }),
  recipe({
    id: 'fr_tartine', cuisine: 'french', name: 'Tartine Beurre & Œuf', emoji: '🥖', level: 1, difficulty: 1, minutes: 10, servings: 1,
    description: 'Buttered baguette with a perfect soft egg.',
    ingredients: ['baguette', 'butter', 'eggs'],
    steps: [
      'Boil an egg for 6½ minutes, then cool in cold water and peel.',
      'Split a length of baguette and spread generously with butter.',
      'Halve the egg on top, season with flaky salt and pepper.',
    ],
  }),
  recipe({
    id: 'fr_omelette', cuisine: 'french', name: 'Omelette aux Fines Herbes', emoji: '🍳', level: 2, difficulty: 2, minutes: 10, servings: 1,
    description: 'Pale, smooth and just-set — the classic test of a cook.',
    ingredients: ['eggs', 'butter', 'chives'],
    steps: [
      'Beat 3 eggs with salt until uniform.',
      'Foam butter in a pan over medium heat, add eggs and stir rapidly with a fork.',
      'When just set but still creamy, stop stirring and scatter chives.',
      'Tilt and roll into a neat cylinder; turn onto a plate seam-side down.',
    ],
  }),
  recipe({
    id: 'fr_croque', cuisine: 'french', name: 'Croque Monsieur', emoji: '🥪', level: 2, difficulty: 2, minutes: 25, servings: 2,
    description: 'Ham and Gruyère toastie under a blanket of béchamel.',
    ingredients: ['baguette', 'ham', 'gruyere', 'butter', 'flour', 'milk'],
    steps: [
      'Make béchamel: cook 1 tbsp butter with 1 tbsp flour, whisk in 200 ml milk until thick.',
      'Split the bread and fill with ham and Gruyère.',
      'Spread béchamel on top and scatter with more cheese.',
      'Grill until bubbling and golden.',
    ],
  }),
  recipe({
    id: 'fr_vichyssoise', cuisine: 'french', name: 'Vichyssoise', emoji: '🥣', level: 3, difficulty: 2, minutes: 45, servings: 4,
    description: 'Silky leek and potato soup.',
    ingredients: ['leeks', 'potatoes', 'onion', 'butter', 'cream'],
    steps: [
      'Sweat sliced leeks and onion in butter for 10 minutes without colour.',
      'Add diced potatoes and water to cover; simmer 20 minutes.',
      'Blend until very smooth; stir in cream.',
      'Serve hot or chilled with chives.',
    ],
  }),
  recipe({
    id: 'fr_quiche', cuisine: 'french', name: 'Quiche Lorraine', emoji: '🥧', level: 4, difficulty: 3, minutes: 75, servings: 6,
    description: 'Crisp pastry, smoky lardons and a wobbly custard.',
    ingredients: ['pastry', 'eggs', 'cream', 'lardons', 'gruyere'],
    steps: [
      'Line a tart tin with pastry; blind-bake at 190 °C for 15 minutes.',
      'Fry lardons until golden.',
      'Whisk 3 eggs with 300 ml cream, pepper and a little salt.',
      'Scatter lardons and Gruyère in the case, pour over custard.',
      'Bake at 170 °C for 30 minutes until just set with a slight wobble.',
    ],
  }),
  recipe({
    id: 'fr_onionsoup', cuisine: 'french', name: 'Soupe à l’Oignon', emoji: '🧅', level: 5, difficulty: 3, minutes: 90, servings: 4,
    description: 'Deeply caramelised onions under a cheesy crouton lid.',
    ingredients: ['onion', 'butter', 'white_wine', 'beef_stock', 'baguette', 'gruyere', 'thyme'],
    steps: [
      'Slowly cook 1 kg sliced onions in butter for 45–60 minutes until deep brown.',
      'Deglaze with white wine, add stock and thyme; simmer 20 minutes.',
      'Ladle into oven-proof bowls.',
      'Top with toasted baguette and lots of Gruyère.',
      'Grill until bubbling and blistered.',
    ],
  }),
  recipe({
    id: 'fr_ratatouille', cuisine: 'french', name: 'Ratatouille', emoji: '🍆', level: 6, difficulty: 3, minutes: 75, servings: 4,
    description: 'Provençal summer vegetables, each cooked to perfection.',
    ingredients: ['aubergine', 'courgette', 'bell_pepper', 'tomato', 'onion', 'garlic', 'thyme'],
    steps: [
      'Dice aubergine, courgette and peppers into 2 cm pieces.',
      'Fry each vegetable separately in olive oil until golden; set aside.',
      'Soften onion and garlic, add chopped tomatoes and thyme; cook 10 minutes.',
      'Return everything to the pan and simmer gently 20 minutes.',
      'Rest before serving — it is even better the next day.',
    ],
  }),
  recipe({
    id: 'fr_coqauvin', cuisine: 'french', name: 'Coq au Vin', emoji: '🍷', level: 8, difficulty: 4, minutes: 120, servings: 4,
    description: 'Chicken braised in red wine with mushrooms and lardons.',
    ingredients: ['chicken', 'red_wine', 'lardons', 'mushrooms', 'onion', 'carrots', 'thyme'],
    steps: [
      'Brown lardons, then the chicken pieces, in a heavy casserole.',
      'Add onion and carrot; cook 5 minutes.',
      'Pour in a bottle of red wine and add thyme; simmer covered 1 hour.',
      'Fry mushrooms in butter and add for the last 15 minutes.',
      'Reduce the sauce until glossy. Serve with potatoes or bread.',
    ],
  }),
  recipe({
    id: 'fr_bourguignon', cuisine: 'french', name: 'Bœuf Bourguignon', emoji: '🥩', level: 10, difficulty: 5, minutes: 210, servings: 6,
    description: 'The great Burgundian beef stew.',
    ingredients: ['beef_chuck', 'red_wine', 'lardons', 'mushrooms', 'carrots', 'onion', 'thyme', 'beef_stock'],
    steps: [
      'Pat beef dry and brown in batches; set aside.',
      'Brown lardons, onion and carrot in the same pot.',
      'Return beef, dust with flour, then add wine, stock and thyme.',
      'Cover and braise at 150 °C for 3 hours until spoon-tender.',
      'Add butter-fried mushrooms and reduce the sauce on the hob.',
    ],
  }),
  recipe({
    id: 'fr_souffle', cuisine: 'french', name: 'Soufflé au Chocolat', emoji: '🍫', level: 12, difficulty: 5, minutes: 40, servings: 4,
    description: 'The towering, trembling dessert. Serve immediately!',
    ingredients: ['dark_choc', 'eggs', 'butter'],
    steps: [
      'Butter 4 ramekins and coat with sugar. Heat oven to 200 °C.',
      'Melt 100 g chocolate with 30 g butter; whisk in 3 yolks.',
      'Whisk 4 whites to soft peaks, then add 40 g sugar to stiff, glossy peaks.',
      'Fold whites into the chocolate in three additions — keep the air!',
      'Fill ramekins, run a thumb round the rim, bake 12 minutes. Serve at once.',
    ],
  }),
];

export const INGREDIENT_BY_ID: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i]),
);
export const RECIPE_BY_ID: Record<string, Recipe> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
export const CUISINE_BY_ID = Object.fromEntries(CUISINES.map((c) => [c.id, c])) as Record<CuisineId, Cuisine>;
