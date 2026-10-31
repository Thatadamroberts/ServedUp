# Served Up 🍳

A cooking RPG for iOS and Android, where **you** are the player. Pick a cuisine, cook real dishes in your
real kitchen, and level up your chef from *Dishwasher* to *Culinary Legend*.

Built with Expo (SDK 58), React Native and Expo Router.

## How it plays

| Loop | What happens |
| --- | --- |
| **Choose a cuisine** | Italian, Japanese, Mexican, Indian, French or Persian. Each one comes with a free starter pantry that can already make a few dishes. |
| **Cook** | Open a recipe and tap **Start cooking**. A step-by-step checklist (with a timer) guides you. Your chef acts out the current step (chopping, boiling, frying, baking, mixing, rolling or plating) based on the recipe text. Tick off every step, then **Serve it up!** |
| **Earn** | Each dish pays **XP** and **coins**. The first time you cook a dish you get +50% XP. Harder dishes pay more. |
| **Shop** | Spend coins in the **Market** on new ingredients. Once bought, they stay in your pantry. New stock appears as you level up. |
| **Level up** | XP raises your level, which unlocks tougher recipes and gives you a new title. Your chef's neckerchief changes colour with each title. |
| **Photograph** | After serving, take a photo with the camera or pick one from your library. It's linked to that cooked recipe in your **Journal**. The first photo on each dish pays a 10-coin tip. You can add notes too. |
| **Expand** | Spend 120 coins to open another cuisine's kitchen and get its starter pantry. |
| **Chef's Special** | Each day one dish you can cook is the Chef's Special, worth double XP the first time you serve it that day. |
| **Streaks** | Cook on consecutive days to build a streak. Reaching 3, 7, 14 and 30 days pays 30, 75, 150 and 300 coins. |
| **Mastery** | Cook a dish 1, 3 and 5 times for bronze, silver and gold medals. Silver pays 20 coins and gold pays 50. |
| **Wardrobe** | Spend coins on hats, coats, a mustache or glasses, kitchen wall tiles and decor (a plant, copper pans, a cat, a neon sign). Try items on before buying. |
| **Trophies** | 20 achievements, each paying coins, and a trophy appears on your kitchen counter for each one. |
| **Share** | Export your chef profile or any cooked dish as an Instagram post (1080×1350) or story (1080×1920), with a ready-made caption. |

There are 64 recipes across 6 cuisines, difficulty 1–5, with level gates up to LV 12. Titles run to LV 25.

## The chef

The chef is drawn as 16-bit pixel art (`src/components/sprites.ts`) and rendered as crisp SVG rects
(`PixelSprite.tsx`). `ChefAvatar.tsx` animates it frame by frame:

- **idle**: breathing bob and blinking (Kitchen tab)
- **cook**: one of seven actions picked from the current step (`src/game/cookActions.ts`): a rocking knife on a chopping board, a bubbling pot, a tossed frying pan, a glowing oven, a whisk in a bowl, a rolling pin on dough, or a finished plate (`src/components/cookingArt.ts`)
- **cheer**: arms up, hopping, with sparkles (dish served)

The UI uses the *Press Start 2P* pixel font, bevelled 16-bit panels and segmented XP bars.

## Project layout

```
src/
  app/                  Expo Router screens
    onboarding.tsx      name + cuisine pick
    (tabs)/kitchen.tsx  HUD, avatar, ready-to-cook, cuisine switcher
    (tabs)/recipes.tsx  cookbook for the active cuisine
    (tabs)/market.tsx   buy ingredients
    (tabs)/journal.tsx  photo grid of every dish you've served
    wardrobe.tsx        buy and try on outfits and kitchen decor
    trophies.tsx        achievement shelf
    share.tsx           Instagram post / story export
    recipe/[id].tsx     recipe detail, inline buying
    cook/[id].tsx       step checklist + timer
    entry/[id].tsx      rewards / level-up + photo & notes for a cooked dish
  game/
    data.ts             cuisines, ingredients, recipes
    progression.ts      pure game rules (XP, titles, buying, cooking, streaks, specials, mastery, wardrobe)
    achievements.ts     trophy definitions
    cosmetics.ts        wardrobe and decor catalogue
    GameContext.tsx     state + AsyncStorage persistence
    photos.ts           camera / library capture, copied into app storage
  components/           pixel sprite renderer, avatar, kitchen scene, UI kit
```

## Running it

```bash
npm install
npx expo start            # scan the QR code with Expo Go, or press a / i
```

Other checks:

```bash
npm test                  # game-rule + data-integrity tests (node:test)
npm run typecheck
npm run lint
```

### Building for the stores

Use [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npx eas-cli@latest build --platform android --profile preview   # installable .apk for Android phones
npx eas-cli@latest build --platform android --profile production # .aab for the Play Store
npx eas-cli@latest build --platform ios                          # needs an Apple Developer account
```

The `preview` profile in `eas.json` produces an `.apk` you can download and install on an Android phone directly.

The bundle IDs are `com.servedup.app` on both platforms. Change them in `app.json` before you publish.
The camera and photo-library permission prompts are set through the `expo-image-picker` plugin in `app.json`.

## Data and privacy

Progress is stored on the device with AsyncStorage. Saves from older versions are upgraded automatically. Photos are copied into the app's private
documents folder (`dish-photos/`) so they last after the system clears its cache. Nothing is uploaded:
share images are made on the device and handed to the system share sheet, so you choose where they go.
