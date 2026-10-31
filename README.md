# Served Up 🍳

A cooking RPG for iOS and Android, where **you** are the player. Pick a cuisine, cook real dishes in your
real kitchen, and level up your chef from *Dishwasher* to *Culinary Legend*.

Built with Expo (SDK 58), React Native and Expo Router.

## How it plays

| Loop | What happens |
| --- | --- |
| **Choose a cuisine** | Italian, Japanese, Mexican, Indian or French. Each one comes with a free starter pantry that can already make a few dishes. |
| **Cook** | Open a recipe and tap **Start cooking**. A step-by-step checklist (with a timer) guides you, and your chef tosses a pan while you work. Tick off every step, then **Serve it up!** |
| **Earn** | Each dish pays **XP** and **coins**. The first time you cook a dish you get +50% XP. Harder dishes pay more. |
| **Shop** | Spend coins in the **Market** on new ingredients. Once bought, they stay in your pantry. New stock appears as you level up. |
| **Level up** | XP raises your level, which unlocks tougher recipes and gives you a new title. Your chef's neckerchief changes colour with each title. |
| **Photograph** | After serving, take a photo with the camera or pick one from your library. It's linked to that cooked recipe in your **Journal**. The first photo on each dish pays a 10-coin tip. You can add notes too. |
| **Expand** | Spend 120 coins to open another cuisine's kitchen and get its starter pantry. |

There are 51 recipes across 5 cuisines, difficulty 1–5, with level gates up to LV 12. Titles run to LV 25.

## The chef

The chef is drawn as 16-bit pixel art (`src/components/sprites.ts`) and rendered as crisp SVG rects
(`PixelSprite.tsx`). `ChefAvatar.tsx` animates it frame by frame:

- **idle**: breathing bob and blinking (Kitchen tab)
- **cook**: tossing a pan over a flickering flame, with rising steam (cooking screen)
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
    recipe/[id].tsx     recipe detail, inline buying
    cook/[id].tsx       step checklist + timer
    entry/[id].tsx      rewards / level-up + photo & notes for a cooked dish
  game/
    data.ts             cuisines, ingredients, recipes
    progression.ts      pure game rules (XP curve, titles, buying, cooking, photos)
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
npx eas-cli@latest build --platform android   # or ios / all
```

The bundle IDs are `com.servedup.app` on both platforms. Change them in `app.json` before you publish.
The camera and photo-library permission prompts are set through the `expo-image-picker` plugin in `app.json`.

## Data and privacy

Progress is stored on the device with AsyncStorage. Photos are copied into the app's private
documents folder (`dish-photos/`) so they last after the system clears its cache. Nothing is uploaded.
