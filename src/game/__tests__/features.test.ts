/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ACHIEVEMENTS } from '../achievements.ts';
import { COSMETICS } from '../cosmetics.ts';
import {
  activeStreak, applyAchievements, buyCosmetic, completeRecipe, dayKey, ensureDailySpecial, equipCosmetic,
  masteryTier, newGame, normalizeState, previousDay, rewardFor,
} from '../progression.ts';
import { RECIPE_BY_ID } from '../data.ts';
import type { GameState } from '../types.ts';

const DAY = 24 * 60 * 60 * 1000;
const t0 = new Date(2026, 9, 31, 18).getTime();

function cook(s: GameState, id: string, now: number) {
  const r = completeRecipe(s, id, now, `${id}-${now}`);
  assert.ok(r.ok, `could not cook ${id}`);
  return r.outcome;
}

test('dates', () => {
  assert.equal(dayKey(t0), '2026-10-31');
  assert.equal(previousDay('2026-11-01'), '2026-10-31');
  assert.equal(previousDay('2026-03-01'), '2026-02-28');
});

test('streak grows on consecutive days, pays milestones, and resets after a gap', () => {
  let s = newGame('Ada', 'italian', t0);
  s = cook(s, 'it_aglio', t0).state;
  s = cook(s, 'it_aglio', t0 + 1000).state; // same day: no change
  assert.equal(s.streak.current, 1);
  s = cook(s, 'it_aglio', t0 + DAY).state;
  const third = cook(s, 'it_bruschetta', t0 + 2 * DAY);
  assert.equal(third.streak, 3);
  assert.ok(third.completion.bonuses?.some((b) => b.label === '3-day streak' && b.coins === 30));
  s = third.state;
  assert.equal(activeStreak(s, t0 + 3 * DAY), 3);
  assert.equal(activeStreak(s, t0 + 4 * DAY), 0);
  s = cook(s, 'it_aglio', t0 + 5 * DAY).state;
  assert.equal(s.streak.current, 1);
  assert.equal(s.streak.best, 3);
});

test('daily special doubles XP once per day and re-rolls the next day', () => {
  let s = ensureDailySpecial(newGame('Ada', 'italian', t0), t0);
  assert.ok(s.daily);
  const id = s.daily!.recipeId;
  assert.equal(ensureDailySpecial(s, t0 + 1000), s, 'same day keeps the same special');
  const r = rewardFor(s, RECIPE_BY_ID[id], t0);
  assert.equal(r.xp, Math.round(RECIPE_BY_ID[id].xp * 2.5)); // base + first-cook 50% + special 100%
  const out = cook(s, id, t0);
  assert.equal(out.completion.daily, true);
  s = out.state;
  assert.equal(s.daily!.claimed, true);
  assert.equal(rewardFor(s, RECIPE_BY_ID[id], t0).daily, false);
  const tomorrow = ensureDailySpecial(s, t0 + DAY);
  assert.equal(tomorrow.daily!.day, dayKey(t0 + DAY));
  assert.equal(tomorrow.daily!.claimed, false);
});

test('mastery tiers pay silver and gold bonuses', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 9].map(masteryTier), [0, 1, 1, 2, 2, 3, 3]);
  let s = newGame('Ada', 'french', t0);
  const labels: string[] = [];
  for (let i = 0; i < 5; i++) {
    const o = cook(s, 'fr_crepes', t0 + i * 1000);
    labels.push(...(o.completion.bonuses ?? []).map((b) => b.label));
    s = o.state;
  }
  assert.ok(labels.includes('Silver mastery'));
  assert.ok(labels.includes('Gold mastery'));
});

test('cosmetics: buy, auto-equip, decor toggles, level gates', () => {
  let s = { ...newGame('Ada', 'italian', t0), coins: 1000 };
  assert.deepEqual(buyCosmetic(s, 'crown'), { ok: false, error: 'level-locked' });
  const b = buyCosmetic(s, 'bandana');
  assert.ok(b.ok);
  if (!b.ok) return;
  s = b.state;
  assert.equal(s.equipped.hat, 'bandana');
  assert.equal(s.coins, 940);
  s = equipCosmetic(s, 'toque');
  assert.equal(s.equipped.hat, 'toque');
  const p = buyCosmetic(s, 'plant');
  assert.ok(p.ok && p.state.equipped.decor.includes('plant'));
  if (!p.ok) return;
  assert.ok(!equipCosmetic(p.state, 'plant').equipped.decor.includes('plant'));
  assert.equal(equipCosmetic(s, 'beret'), s, 'cannot wear what you do not own');
  assert.ok(COSMETICS.every((c) => c.price >= 0));
});

test('achievements unlock once and pay coins', () => {
  const s = cook(newGame('Ada', 'italian', t0), 'it_aglio', t0).state;
  const a = applyAchievements(s, t0);
  assert.deepEqual(a.unlocked.map((x) => x.id), ['first_dish']);
  assert.equal(a.state.coins, s.coins + 25);
  assert.equal(applyAchievements(a.state, t0).unlocked.length, 0);
  assert.equal(new Set(ACHIEVEMENTS.map((x) => x.id)).size, ACHIEVEMENTS.length);
});

test('old saves are upgraded with defaults', () => {
  const { ownedCosmetics, equipped, streak, daily, achievements, ...old } = newGame('Ada', 'italian', t0);
  void ownedCosmetics; void equipped; void streak; void daily; void achievements;
  const s = normalizeState(old as GameState);
  assert.equal(s.equipped.hat, 'toque');
  assert.ok(s.ownedCosmetics.includes('whites'));
  assert.equal(s.streak.current, 0);
  assert.deepEqual(s.achievements, {});
});
