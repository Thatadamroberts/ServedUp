/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CUISINES, INGREDIENT_BY_ID, INGREDIENTS, RECIPES, STARTER_PACKS } from '../data.ts';
import {
  attachPhoto, buyIngredient, completeRecipe, levelInfo, newGame, PHOTO_BONUS_COINS,
  recipeStatus, recipesFor, unlockCuisine, xpForLevel, xpToNext,
} from '../progression.ts';

test('data integrity: ids unique and references resolve', () => {
  assert.equal(new Set(INGREDIENTS.map((i) => i.id)).size, INGREDIENTS.length);
  assert.equal(new Set(RECIPES.map((r) => r.id)).size, RECIPES.length);
  for (const r of RECIPES) {
    for (const id of r.ingredients) assert.ok(INGREDIENT_BY_ID[id], `${r.id} uses unknown ${id}`);
    assert.ok(r.steps.length >= 3, `${r.id} has too few steps`);
  }
  for (const c of CUISINES) for (const id of STARTER_PACKS[c.id]) assert.ok(INGREDIENT_BY_ID[id], `${c.id} starter ${id}`);
});

test('every cuisine can cook at least two dishes from its starter pack', () => {
  for (const c of CUISINES) {
    const s = newGame('Test', c.id);
    const ready = recipesFor(c.id).filter((r) => recipeStatus(s, r) === 'ready');
    assert.ok(ready.length >= 2, `${c.id} only has ${ready.length} starter dishes`);
  }
});

test('every recipe ingredient is buyable from that cuisine market or common', () => {
  for (const r of RECIPES) for (const id of r.ingredients) {
    const i = INGREDIENT_BY_ID[id];
    assert.ok(i.cuisine === r.cuisine || i.cuisine === 'common', `${r.id}: ${id} is ${i.cuisine}`);
    assert.ok(i.minLevel <= r.level, `${r.id} (L${r.level}) needs ${id} (L${i.minLevel})`);
  }
});

test('level curve', () => {
  assert.equal(levelInfo(0).level, 1);
  assert.equal(levelInfo(xpToNext(1) - 1).level, 1);
  assert.equal(levelInfo(xpToNext(1)).level, 2);
  assert.equal(levelInfo(xpForLevel(5)).level, 5);
  assert.equal(levelInfo(10_000_000).level, 30);
});

test('cooking awards xp/coins with first-time bonus, and gates on level & pantry', () => {
  let s = newGame('Ada', 'italian', 0);
  const r1 = completeRecipe(s, 'it_aglio', 1, 'a');
  assert.ok(r1.ok);
  if (!r1.ok) return;
  assert.equal(r1.outcome.completion.xpEarned, 60);
  assert.equal(r1.outcome.state.coins, 75);
  s = r1.outcome.state;
  const r2 = completeRecipe(s, 'it_aglio', 2, 'b');
  assert.ok(r2.ok && r2.outcome.completion.xpEarned === 40);
  assert.deepEqual(completeRecipe(s, 'it_pomodoro'), { ok: false, error: 'missing-ingredients' });
  assert.deepEqual(completeRecipe(s, 'it_tiramisu'), { ok: false, error: 'level-locked' });
});

test('market purchases and cuisine unlocks', () => {
  let s = newGame('Ada', 'italian');
  const b = buyIngredient(s, 'basil');
  assert.ok(b.ok);
  if (!b.ok) return;
  s = b.state;
  assert.equal(s.coins, 35);
  assert.equal(recipeStatus(s, RECIPES.find((r) => r.id === 'it_pomodoro')!), 'ready');
  assert.deepEqual(buyIngredient(s, 'basil'), { ok: false, error: 'already-owned' });
  assert.deepEqual(buyIngredient(s, 'mascarpone'), { ok: false, error: 'level-locked' });
  assert.deepEqual(unlockCuisine(s, 'japanese'), { ok: false, error: 'insufficient-coins' });
  const u = unlockCuisine({ ...s, coins: 500 }, 'japanese');
  assert.ok(u.ok && u.state.activeCuisine === 'japanese' && u.state.ownedIngredients.includes('nori'));
});

test('photo bonus pays once', () => {
  const r = completeRecipe(newGame('Ada', 'french'), 'fr_crepes', 1, 'x');
  assert.ok(r.ok);
  if (!r.ok) return;
  const coins = r.outcome.state.coins;
  let s = attachPhoto(r.outcome.state, 'x', 'file:///a.jpg');
  assert.equal(s.coins, coins + PHOTO_BONUS_COINS);
  s = attachPhoto(s, 'x', 'file:///b.jpg');
  assert.equal(s.coins, coins + PHOTO_BONUS_COINS);
  assert.equal(s.completions[0].photoUri, 'file:///b.jpg');
});
