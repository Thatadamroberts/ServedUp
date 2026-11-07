/**
 * Detailed how-to notes for cooking techniques. In "Detailed" mode each recipe step shows the
 * techniques its text mentions, so beginners get specific instructions without cluttering the
 * simple view.
 */
export interface Technique {
  id: string;
  name: string;
  /** Words that bring this technique up. Whole words, plus -s/-ed/-ing endings. */
  words: string[];
  how: string;
}

export const TECHNIQUES: Technique[] = [
  {
    id: 'dice',
    name: 'Dicing',
    words: ['dice', 'diced', 'cube', 'cubes', 'cubed'],
    how: 'Cut the food into flat slices, stack them and cut into sticks, then cut across the sticks into even cubes. Keep the pieces the same size so they cook at the same rate. Curl the fingertips of your guiding hand under so the knife blade rests against your knuckles.',
  },
  {
    id: 'finely_chop',
    name: 'Finely chopping and mincing',
    words: ['finely chop', 'finely chopped', 'minced garlic', 'finely dice', 'very finely chop'],
    how: 'Roughly chop first, then rock the knife back and forth over the pile, keeping the tip on the board. Scrape the pile back together every few strokes. You want pieces about the size of a grain of rice.',
  },
  {
    id: 'slice',
    name: 'Slicing',
    words: ['slice', 'sliced', 'thinly', 'half-moons'],
    how: 'Cut a thin strip off one side so the food sits flat and cannot roll. Slice with long smooth strokes, pushing forward and down rather than pressing straight down. For "thinly", aim for about 2–3 mm.',
  },
  {
    id: 'grate',
    name: 'Grating and zesting',
    words: ['grate', 'grated', 'zest'],
    how: 'Use the large holes for cheese and vegetables and the fine holes for garlic, ginger and citrus zest. For zest, take only the coloured outer skin; the white pith underneath is bitter. Rotate the fruit as you go.',
  },
  {
    id: 'boil_pasta',
    name: 'Cooking pasta and noodles',
    words: ['spaghetti', 'pasta', 'noodles', 'al dente', 'tagliatelle'],
    how: 'Use a big pot of water at a rolling boil and salt it well (about 1 tbsp per 2 litres). Stir in the first minute so it does not stick. Start tasting 2 minutes before the packet time: al dente means tender with a slight bite in the centre. Save a mug of the starchy water before draining; it helps sauces cling.',
  },
  {
    id: 'boil',
    name: 'Boiling',
    words: ['boil', 'boiling', 'boiled', 'par-boil', 'parboil', 'parboiled'],
    how: 'A full boil has large bubbles breaking across the whole surface. Bring water to the boil before adding food, then adjust the heat to keep it bubbling. Par-boiling means cooking only part of the way, so the food can finish another way.',
  },
  {
    id: 'simmer',
    name: 'Simmering',
    words: ['simmer', 'simmering', 'simmered'],
    how: 'Lower the heat until only small bubbles rise gently, with a few breaking the surface. A simmer cooks food evenly without toughening meat or breaking up vegetables. Stir now and then so nothing catches on the bottom; if it starts boiling hard, turn it down.',
  },
  {
    id: 'blanch',
    name: 'Blanching',
    words: ['blanch', 'blanched'],
    how: 'Drop the food into boiling salted water for a short time (usually 30 seconds to 2 minutes), then lift it straight into a bowl of ice water to stop it cooking. This keeps greens bright and crisp.',
  },
  {
    id: 'poach',
    name: 'Poaching',
    words: ['poach', 'poached', 'poaching'],
    how: 'Cook in liquid that is barely moving: steaming, with only the odd bubble. For eggs, crack each into a cup first and slide it in gently. For chicken, keep it just below a simmer until cooked through.',
  },
  {
    id: 'steam',
    name: 'Steaming',
    words: ['steam', 'steamed', 'steaming'],
    how: 'Put the food in a basket or heatproof dish above simmering water, not in it, and cover with a lid. Check the water level every 10 minutes and top up with boiling water so the pan never boils dry.',
  },
  {
    id: 'sear',
    name: 'Searing and browning',
    words: ['sear', 'seared', 'brown', 'browned', 'browning'],
    how: 'Pat the food dry, heat the pan until the oil shimmers, then add the food in a single layer with space around each piece. Leave it alone until it releases easily and has a deep golden crust (2–4 minutes). Crowding the pan makes meat steam and go grey, so cook in batches.',
  },
  {
    id: 'saute',
    name: 'Softening onions and aromatics',
    words: ['soften', 'softened', 'sweat', 'sauté', 'saute', 'fry a diced onion', 'gently fry'],
    how: 'Cook over medium-low heat with a little oil or butter and a pinch of salt, stirring often. Onions are softened when they are translucent and floppy, about 8–10 minutes, without much colour. Garlic burns quickly, so add it for the last minute.',
  },
  {
    id: 'caramelise',
    name: 'Caramelising onions',
    words: ['deep golden', 'deep brown', 'caramelised', 'slowly cook', 'slowly fry'],
    how: 'Slice the onions evenly and cook over low to medium heat, stirring every few minutes. They go from soft to golden to a rich brown; this takes 30–60 minutes and cannot be rushed. If they start to catch, add a splash of water and scrape the bottom.',
  },
  {
    id: 'stirfry',
    name: 'Stir-frying',
    words: ['stir-fry', 'stir-fried', 'wok'],
    how: 'Have everything chopped and the sauce mixed before you start: it moves fast. Heat the wok until it just smokes, add oil, then the food. Keep it moving with a spatula over high heat and cook in batches if your pan is small.',
  },
  {
    id: 'shallow_fry',
    name: 'Shallow- and deep-frying',
    words: ['shallow-fry', 'deep-fry', 'deep-fried', '160 °c', '170 °c'],
    how: 'Heat the oil to the stated temperature (a cube of bread should brown in about 60 seconds at 160 °C, 40 seconds at 180 °C). Fry a few pieces at a time so the temperature stays up, and drain on kitchen paper. Never leave hot oil unattended or let water near it.',
  },
  {
    id: 'fry',
    name: 'Frying',
    words: ['fry', 'fried', 'until golden', 'pan-sear'],
    how: 'Heat the pan over medium-high heat before adding the oil, then add the food when the oil shimmers and flows easily. Listen for a steady sizzle: silence means the pan is too cool, smoking means it is too hot. Turn food once it releases from the pan rather than tearing it off.',
  },
  {
    id: 'beat',
    name: 'Beating and whisking',
    words: ['beat', 'beaten', 'whisk', 'whisked', 'until smooth'],
    how: 'Use a fork or balloon whisk and tilt the bowl slightly. For eggs, beat until the yolk and white are completely mixed with no streaks. For batters, whisk just until smooth; overbeating flour batters makes them tough.',
  },
  {
    id: 'season',
    name: 'Seasoning to taste',
    words: ['season', 'seasoned', 'to taste', 'salt and pepper'],
    how: 'Add salt a pinch at a time, stir, wait a few seconds and taste again. A dish that tastes flat usually needs salt; one that tastes heavy often needs a squeeze of lemon or a splash of vinegar. Season meat well before cooking, not just at the end.',
  },
  {
    id: 'toast_spices',
    name: 'Toasting spices and making a tadka',
    words: ['crackle', 'tadka', 'toast', 'toasted', 'sizzled'],
    how: 'Heat the oil or dry pan first, then add the whole spices or nuts and stir constantly. They are ready when fragrant and a shade darker, usually 20–60 seconds. Take them off the heat the moment they smell toasty; burnt spices taste bitter and should be thrown away.',
  },
  {
    id: 'deglaze',
    name: 'Deglazing and reducing',
    words: ['deglaze', 'reduce', 'reduced', 'let it bubble', 'bubble away'],
    how: 'Pour liquid (wine, stock or water) into the hot pan and scrape up the browned bits from the bottom with a wooden spoon; that is where the flavour is. To reduce, let it bubble uncovered until it has thickened and shrunk to the amount you want.',
  },
  {
    id: 'braise',
    name: 'Braising and slow-cooking',
    words: ['braise', 'braised', 'stew', 'casserole', 'until tender', 'spoon-tender'],
    how: 'Brown the meat first, then cook it covered in a little liquid over low heat or in a low oven. Keep it at a gentle simmer, never a boil. It is done when a fork slides in with no resistance; if it is still firm, give it more time.',
  },
  {
    id: 'roast',
    name: 'Roasting and baking',
    words: ['roast', 'roasted', 'bake', 'baked', 'oven'],
    how: 'Always heat the oven fully before the food goes in. Use the middle shelf, and for fan ovens set it about 20 °C lower than the recipe says. Every oven is different, so start checking 5–10 minutes before the stated time.',
  },
  {
    id: 'skewer_test',
    name: 'Testing cakes',
    words: ['skewer comes out clean', 'loaf tin', 'sponge', 'cake'],
    how: 'A cake is done when it is risen, golden, springs back when pressed lightly and a skewer pushed into the centre comes out clean. If wet batter clings to the skewer, bake 5 minutes more and test again.',
  },
  {
    id: 'blind_bake',
    name: 'Blind-baking pastry',
    words: ['blind-bake', 'blind-baked', 'tart tin', 'line a'],
    how: 'Line the tin with pastry, prick the base with a fork and chill 15 minutes. Cover with baking paper and fill with baking beans or rice, then bake. Remove the paper and beans for the last 5 minutes so the base dries out and turns golden.',
  },
  {
    id: 'cream_butter',
    name: 'Creaming butter and sugar',
    words: ['until pale and fluffy', 'soft butter', 'until creamy', 'creamy'],
    how: 'Use butter soft enough to dent easily (leave it out for an hour). Beat with the sugar for 3–5 minutes until it turns noticeably paler and fluffy. This traps air that makes cakes light. Add eggs one at a time, beating well after each.',
  },
  {
    id: 'fold',
    name: 'Folding',
    words: ['fold', 'folded', 'folding'],
    how: 'Use a large metal spoon or spatula. Cut down through the middle, sweep along the bottom and lift up and over, turning the bowl a quarter turn each time. Stop as soon as there are no streaks; overmixing knocks out the air.',
  },
  {
    id: 'whisk_peaks',
    name: 'Whisking egg whites',
    words: ['soft peaks', 'stiff peaks', 'stiff, glossy', 'egg whites', 'whites to'],
    how: 'Use a spotlessly clean bowl and no trace of yolk. Soft peaks flop over when you lift the whisk; stiff peaks stand straight up. When adding sugar for meringue, add it a spoonful at a time and keep whisking until glossy and the sugar has dissolved.',
  },
  {
    id: 'whip_cream',
    name: 'Whipping cream',
    words: ['whip the cream', 'whipped cream'],
    how: 'Start with cold cream in a cold bowl. Whisk until it holds soft, floppy peaks; stop there, because it goes grainy and then turns to butter quickly if you keep going.',
  },
  {
    id: 'rub_in',
    name: 'Rubbing in',
    words: ['rub', 'breadcrumbs'],
    how: 'Use cold butter cut into cubes. Lift the flour and butter with your fingertips and rub them together, letting it fall back into the bowl, until it looks like breadcrumbs. Work quickly so the butter stays cold.',
  },
  {
    id: 'knead',
    name: 'Kneading dough',
    words: ['knead', 'kneaded', 'kneading', 'dough'],
    how: 'Push the dough away with the heel of your hand, fold it back over, turn it a quarter and repeat. Keep going until it is smooth and springs back slowly when poked, usually 8–10 minutes. Add flour only if it is really sticky.',
  },
  {
    id: 'rest',
    name: 'Resting',
    words: ['rest', 'rested', 'resting'],
    how: 'Resting dough relaxes it so it rolls out without shrinking. Resting meat lets the juices settle so they stay in when you slice. Cover loosely and leave it for the time given; it will stay hot.',
  },
  {
    id: 'roll',
    name: 'Rolling out',
    words: ['roll', 'rolled', 'rolling', 'roll out', 'very thin'],
    how: 'Lightly flour the surface and rolling pin. Roll from the centre outwards, turning the dough a quarter turn every few rolls so it does not stick and stays round. If it springs back, rest it for 10 minutes.',
  },
  {
    id: 'pleat',
    name: 'Filling and pleating dumplings',
    words: ['pleat', 'pleated', 'wrapper', 'wrappers'],
    how: 'Use a small spoonful of filling; overfilling makes them burst. Wet half the edge with water, fold over and pinch at the top, then make small folds along one side, pressing each against the flat side. Keep the rest covered so they do not dry out.',
  },
  {
    id: 'temper',
    name: 'Cooking egg custards',
    words: ['coats the back of a spoon', 'yolks', 'custard', 'do not boil'],
    how: 'Pour hot liquid onto beaten eggs slowly, whisking all the time, so they warm up without scrambling. Then cook gently over low heat, stirring constantly, until it coats the back of a spoon and a line drawn with your finger stays clear. If it starts to look grainy, take it off the heat and whisk hard.',
  },
  {
    id: 'set_wobble',
    name: 'Knowing when it is set',
    words: ['wobble', 'just set', 'until set', 'jiggle'],
    how: 'Gently shake the tin or dish. The edges should be firm and the centre should wobble slightly like jelly, not slosh like liquid. It keeps cooking and firms up as it cools.',
  },
  {
    id: 'water_bath',
    name: 'Baking in a water bath',
    words: ['hot water halfway', 'roasting tin; add hot water'],
    how: 'Put the dishes in a deep roasting tin, set it on the oven shelf, then pour hot water into the tin until it reaches halfway up the dishes. The water keeps the heat gentle so custards set smoothly without cracking or bubbling.',
  },
  {
    id: 'caramel',
    name: 'Making caramel',
    words: ['until amber', 'caramelise', 'caramel'],
    how: 'Heat the sugar without stirring, swirling the pan instead. Watch closely: once it turns amber it goes from perfect to burnt in seconds. Molten sugar is extremely hot, so add butter or liquid carefully as it will spit.',
  },
  {
    id: 'marinate',
    name: 'Marinating',
    words: ['marinate', 'marinated'],
    how: 'Coat the food well in the marinade, cover and keep it in the fridge. Acidic marinades (citrus, yogurt, vinegar) work in 1–4 hours; longer than overnight can make meat mushy. Let it come up from fridge-cold for 20 minutes before cooking.',
  },
  {
    id: 'chicken_done',
    name: 'Cooking chicken through',
    words: ['cooked through', 'cook through', 'chicken'],
    how: 'Chicken must be cooked all the way through: cut into the thickest piece and check there is no pink and the juices run clear, or use a thermometer to check it reaches 75 °C. Wash your hands, boards and knives after handling raw chicken.',
  },
  {
    id: 'grill',
    name: 'Grilling and charring',
    words: ['grill', 'grilled', 'char', 'charred', 'skewers'],
    how: 'Heat the grill or griddle until very hot before the food goes on. Turn it only once or twice so it gets proper char marks. Soak wooden skewers in water for 30 minutes first so they do not burn.',
  },
  {
    id: 'bloom_saffron',
    name: 'Blooming saffron',
    words: ['saffron'],
    how: 'Grind a pinch of saffron threads with a pinch of sugar, then steep in 2–3 tbsp hot (not boiling) water for 10 minutes until deep orange. Add the liquid and threads to the dish; this gives far more colour and aroma than adding dry threads.',
  },
  {
    id: 'rice_absorb',
    name: 'Cooking rice',
    words: ['rinse', 'rinsed', 'cook on low', 'level with the rice', 'cooked rice', 'cups water'],
    how: 'Rinse the rice in a sieve until the water runs clear to remove excess starch. For the absorption method, bring it to the boil with the measured water, cover tightly and turn the heat right down. Do not lift the lid while it cooks, then rest it covered for 5–10 minutes and fluff with a fork.',
  },
  {
    id: 'bechamel',
    name: 'Making béchamel (white sauce)',
    words: ['béchamel', 'bechamel', 'whisk in', 'until thick'],
    how: 'Melt the butter, stir in the flour and cook for a minute without browning. Add warm milk a little at a time, whisking hard after each addition so it stays smooth. Keep stirring over medium heat until it thickens enough to coat a spoon.',
  },
];

const escape = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const COMPILED = TECHNIQUES.map((t) => ({
  t,
  res: t.words.map((w) => new RegExp(`(^|[^a-zà-ÿ])${escape(w.toLowerCase())}(s|es|ed|d|ing)?(?![a-zà-ÿ])`)),
}));

/** Techniques mentioned in a step, in the order they first appear in it. */
export function techniquesFor(step: string, limit = 3): Technique[] {
  const text = step.toLowerCase();
  const found: { t: Technique; at: number }[] = [];
  for (const { t, res } of COMPILED) {
    let at = -1;
    for (const re of res) {
      const m = re.exec(text);
      if (m && (at < 0 || m.index < at)) at = m.index;
    }
    if (at >= 0) found.push({ t, at });
  }
  return found
    .sort((a, b) => a.at - b.at)
    .slice(0, limit)
    .map((f) => f.t);
}
