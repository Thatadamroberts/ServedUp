/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RECIPES } from '../data.ts';
import { TECHNIQUES, techniquesFor } from '../techniques.ts';

test('steps pick up the right techniques', () => {
  const ids = (s: string) => techniquesFor(s).map((t) => t.id);
  assert.deepEqual(ids('Finely dice onion and carrot; soften gently in oil for 10 minutes.'), ['finely_chop', 'dice', 'saute']);
  assert.ok(ids('Whisk 4 egg whites to soft peaks, then add 200 g sugar.').includes('whisk_peaks'));
  assert.ok(ids('Line a 23 cm tart tin with pastry and blind-bake at 190 °C.').includes('blind_bake'));
  assert.ok(!ids('Slide over bowls of hot rice.').includes('rice_absorb'), 'serving over rice is not cooking rice');
  assert.deepEqual(ids('Wet and salt your hands.'), []);
});

test('technique ids are unique and most steps get help', () => {
  assert.equal(new Set(TECHNIQUES.map((t) => t.id)).size, TECHNIQUES.length);
  const steps = RECIPES.flatMap((r) => r.steps);
  const covered = steps.filter((s) => techniquesFor(s).length > 0).length;
  assert.ok(covered / steps.length >= 0.75, `only ${covered}/${steps.length} steps have a technique`);
  // Every technique is reachable from at least one real step.
  const used = new Set(steps.flatMap((s) => techniquesFor(s, 10).map((t) => t.id)));
  for (const t of TECHNIQUES) assert.ok(used.has(t.id), `${t.id} never matches a recipe step`);
});
