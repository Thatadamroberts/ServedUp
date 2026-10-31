/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stepAction } from '../cookActions.ts';
import { RECIPES } from '../data.ts';

test('steps map to the right animation', () => {
  const cases: [string, string][] = [
    ['Dice 3 ripe tomatoes, season with salt.', 'chop'],
    ['Boil 200 g spaghetti in well-salted water until just al dente.', 'boil'],
    ['Meanwhile, gently fry 4 thinly sliced garlic cloves in olive oil.', 'fry'],
    ['Bake covered at 190 °C for 25 minutes.', 'bake'],
    ['Whisk 4 egg yolks with 80 g sugar until pale.', 'mix'],
    ['Knead 10 minutes until silky.', 'roll'],
    ['Serve immediately with more cheese and pepper.', 'plate'],
    ['Simmer 1 cup red lentils with 3 cups water.', 'boil'],
    ['Something with no verbs at all', 'fry'],
    ['Add 500 g chopped tomatoes and a pinch of salt; simmer 15 minutes.', 'boil'],
    ['Add the mince and brown well, breaking it up.', 'fry'],
    ['Add soy sauce and whip with chopsticks until fluffy.', 'mix'],
    ['Line a tart tin with pastry; blind-bake at 190 °C for 15 minutes.', 'roll'],
  ];
  for (const [step, want] of cases) assert.equal(stepAction(step), want, step);
});

test('recipes use a good spread of animations', () => {
  const counts: Record<string, number> = {};
  for (const r of RECIPES) for (const s of r.steps) counts[stepAction(s)] = (counts[stepAction(s)] ?? 0) + 1;
  for (const a of ['chop', 'boil', 'fry', 'bake', 'mix', 'roll', 'plate']) assert.ok((counts[a] ?? 0) >= 5, `${a}: ${counts[a] ?? 0}`);
});
