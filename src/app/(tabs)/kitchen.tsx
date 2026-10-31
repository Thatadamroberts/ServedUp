import { router, useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PixelDialog, type DialogSpec } from '../../components/PixelDialog';
import { PlayerHud } from '../../components/PlayerHud';
import { PlayerKitchen } from '../../components/PlayerKitchen';
import { RecipeCard } from '../../components/RecipeCard';
import { Body, Coins, Panel, PixelButton, PixelText } from '../../components/ui';
import { ACHIEVEMENTS } from '../../game/achievements';
import { CUISINE_BY_ID, CUISINES, RECIPE_BY_ID } from '../../game/data';
import { useGame, useGameState } from '../../game/GameContext';
import {
  activeStreak,
  cookedToday,
  currentLevel,
  nextStreakMilestone,
  recipesFor,
  recipeStatus,
  timesCooked,
} from '../../game/progression';
import type { CuisineId } from '../../game/types';
import { colors } from '../../theme';

export default function Kitchen() {
  const game = useGame();
  const state = useGameState();
  const [dialog, setDialog] = useState<DialogSpec | null>(null);
  const level = currentLevel(state);
  const cuisine = CUISINE_BY_ID[state.activeCuisine!];
  const recipes = recipesFor(cuisine.id);
  // Roll today's special whenever the Kitchen comes into view on a new day.
  useFocusEffect(game.refreshDaily);

  const special = state.daily ? RECIPE_BY_ID[state.daily.recipeId] : undefined;
  const streak = activeStreak(state);
  const doneToday = cookedToday(state);
  const milestone = nextStreakMilestone(streak);
  const trophies = Object.keys(state.achievements).length;

  const ready = recipes
    .filter((r) => recipeStatus(state, r) === 'ready' && r.id !== special?.id)
    .sort((a, b) => timesCooked(state, a.id) - timesCooked(state, b.id) || b.xp - a.xp)
    .slice(0, 3);
  const nextUnlock = recipes.find((r) => r.level > level);

  const onCuisine = (id: CuisineId) => {
    if (state.unlockedCuisines.includes(id)) return game.switchCuisine(id);
    const c = CUISINE_BY_ID[id];
    if (state.coins < c.unlockCost) {
      return setDialog({
        title: 'NOT ENOUGH COINS',
        message: `You need ${c.unlockCost} coins to open the ${c.name} kitchen. You have ${state.coins}. Keep cooking!`,
      });
    }
    setDialog({
      title: `OPEN ${c.name.toUpperCase()}?`,
      message: `Spend ${c.unlockCost} coins to unlock ${c.name} cuisine and its starter pantry.`,
      confirmLabel: 'UNLOCK',
      onConfirm: () => game.unlockCuisine(id),
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <PlayerKitchen />
      <View style={styles.actions}>
        <PixelButton small variant="blue" label="WARDROBE" onPress={() => router.push('/wardrobe')} style={{ flex: 1 }} />
        <PixelButton small variant="ghost" label="SHARE PROFILE" onPress={() => router.push('/share?kind=profile')} style={{ flex: 1 }} />
      </View>

      <Panel style={{ marginTop: 12 }}>
        <PlayerHud state={state} />
      </Panel>

      <View style={styles.stats}>
        <Panel style={styles.stat}>
          <PixelText size={14} color={colors.gold} style={styles.center}>
            {state.completions.length}
          </PixelText>
          <PixelText size={7} color={colors.textDim} style={styles.center}>
            DISHES
          </PixelText>
        </Panel>
        <Panel style={styles.stat} color={streak > 0 ? '#4a2a1a' : undefined}>
          <PixelText size={14} color={streak > 0 ? '#ff9a3c' : colors.textDim} style={styles.center}>
            🔥{streak}
          </PixelText>
          <PixelText size={7} color={colors.textDim} style={styles.center}>
            DAY STREAK
          </PixelText>
        </Panel>
        <Pressable style={styles.stat} onPress={() => router.push('/trophies')} accessibilityRole="button" accessibilityLabel={`Trophies, ${trophies} of ${ACHIEVEMENTS.length}`}>
          <Panel>
            <PixelText size={14} color={colors.gold} style={styles.center}>
              {trophies}/{ACHIEVEMENTS.length}
            </PixelText>
            <PixelText size={7} color={colors.textDim} style={styles.center}>
              TROPHIES ▶
            </PixelText>
          </Panel>
        </Pressable>
      </View>
      <Body dim style={{ fontSize: 12, marginTop: 6, textAlign: 'center' }}>
        {doneToday
          ? `Streak safe for today.${milestone ? ` ${milestone.days - streak} more day${milestone.days - streak === 1 ? '' : 's'} to the ${milestone.days}-day bonus (+${milestone.coins} coins).` : ''}`
          : streak > 0
            ? `Cook something today to keep your ${streak}-day streak alive!`
            : 'Cook on consecutive days to build a streak and earn bonus coins.'}
      </Body>

      {special && (
        <>
          <View style={styles.hRow}>
            <PixelText size={10} color={colors.gold}>
              ★ CHEF&apos;S SPECIAL
            </PixelText>
            <PixelText size={7} color={colors.textDim}>
              {state.daily?.claimed ? 'SERVED TODAY ✓' : 'DOUBLE XP TODAY'}
            </PixelText>
          </View>
          <RecipeCard recipe={special} state={state} />
        </>
      )}

      <PixelText size={10} style={styles.h}>
        {ready.length ? 'READY TO COOK' : 'NOTHING ELSE READY'}
      </PixelText>
      {ready.length ? (
        ready.map((r) => <RecipeCard key={r.id} recipe={r} state={state} />)
      ) : (
        <Panel>
          <Body>Stock up at the market to unlock more dishes.</Body>
          <Pressable onPress={() => router.push('/market')} style={{ marginTop: 8 }}>
            <PixelText size={9} color={colors.gold}>
              ▶ GO TO MARKET
            </PixelText>
          </Pressable>
        </Panel>
      )}

      {nextUnlock && (
        <>
          <PixelText size={10} style={styles.h}>
            NEXT UNLOCK
          </PixelText>
          <RecipeCard recipe={nextUnlock} state={state} />
        </>
      )}

      <PixelText size={10} style={styles.h}>
        CUISINES
      </PixelText>
      <View style={styles.cuisines}>
        {CUISINES.map((c) => {
          const unlocked = state.unlockedCuisines.includes(c.id);
          const active = c.id === cuisine.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => onCuisine(c.id)}
              accessibilityRole="button"
              accessibilityLabel={unlocked ? `Switch to ${c.name}` : `Unlock ${c.name} for ${c.unlockCost} coins`}
              style={[
                styles.cuisine,
                { backgroundColor: active ? c.color : colors.panel, borderColor: active ? colors.gold : colors.border, opacity: unlocked ? 1 : 0.75 },
              ]}
            >
              <Text style={{ fontSize: 24 }}>{c.emoji}</Text>
              <PixelText size={7} style={{ marginTop: 4 }}>
                {c.name.toUpperCase()}
              </PixelText>
              {!unlocked && (
                <View style={{ marginTop: 4 }}>
                  <Coins amount={c.unlockCost} size={7} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() =>
          setDialog({
            title: 'START OVER?',
            message: 'This erases your chef, coins, wardrobe, trophies and journal.',
            confirmLabel: 'RESET',
            danger: true,
            onConfirm: () => game.reset().then(() => router.replace('/onboarding')),
          })
        }
        style={{ marginTop: 30, alignSelf: 'center' }}
      >
        <PixelText size={7} color={colors.textDim}>
          RESET SAVE
        </PixelText>
      </Pressable>
      <PixelDialog spec={dialog} onClose={() => setDialog(null)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h: { marginTop: 20, marginBottom: 10 },
  hRow: { marginTop: 20, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  center: { textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 10 },
  stat: { flex: 1 },
  cuisines: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cuisine: { width: '31%', flexGrow: 1, alignItems: 'center', padding: 8, borderWidth: 3 },
});
