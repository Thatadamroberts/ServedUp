# Changelog

All notable changes to Served Up. Versions follow `major.minor.patch`: bump **minor** for new
features or content, **patch** for fixes. Each release also gets a new build number
(Android `versionCode`, iOS `buildNumber`), which phones use to recognise an update.

Add notes under **Unreleased** as you go, then run `npm run version:bump -- minor` (or `patch`)
to date them and bump every version number together.

## Unreleased

- Version tracking: `app.json` is the single source of the version and build numbers,
  `npm run version:bump` keeps them in step, and the Kitchen screen shows the installed version.

## [1.1.0] - 2026-11-09

Build 2.

- Chinese, Greek and Desserts kitchens, each with a starter pantry and its own recipes.
- 50 new recipes, including two more for each of the original six cuisines (114 in total).
- Detailed instructions: a Simple/Detailed toggle with technique how-tos under each step,
  and a HOW? button per step in Simple mode.
- Sweet Tooth trophy for baking 5 desserts.
- Some ingredients are now shared between kitchens (soy sauce, olive oil, chocolate and others).

## [1.0.0] - 2026-11-04

Build 1. First Android build.

- Cooking RPG core: pick a cuisine, cook real recipes step by step, earn XP and coins, buy
  ingredients, level up through chef titles.
- Six cuisines: Italian, Japanese, Mexican, Indian, French and Persian.
- Animated 16-bit chef with cooking animations for chopping, boiling, frying, baking, mixing,
  rolling and plating.
- Dish photos linked to recipes in a journal, with notes.
- Wardrobe and kitchen decor, Chef's Special, streaks, mastery medals and trophies.
- Instagram post and story export for your profile and dishes.
