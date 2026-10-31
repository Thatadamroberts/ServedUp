import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ChefAvatar } from '../../components/ChefAvatar';
import { KitchenScene } from '../../components/KitchenScene';
import { Body, PixelButton, PixelText, SegmentBar } from '../../components/ui';
import { CUISINE_BY_ID, RECIPE_BY_ID } from '../../game/data';
import { useGame, useGameState } from '../../game/GameContext';
import { currentLevel, titleFor } from '../../game/progression';
import { colors } from '../../theme';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function Cook() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = useGame();
  const state = useGameState();
  const recipe = RECIPE_BY_ID[id];
  const [done, setDone] = useState<boolean[]>(() => recipe?.steps.map(() => false) ?? []);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (!recipe) return <Body>Recipe not found.</Body>;
  const title = titleFor(currentLevel(state));
  const count = done.filter(Boolean).length;
  const allDone = count === done.length;

  const toggle = (i: number) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
    setDone((d) => d.map((v, j) => (j === i ? !v : v)));
  };

  const serve = () => {
    const r = game.cook(recipe.id);
    if (!r.ok) return;
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const { completion, leveledUp, newLevel, newTitle } = r.outcome;
    router.replace({
      pathname: '/entry/[id]',
      params: { id: completion.id, fresh: '1', ...(leveledUp ? { lv: String(newLevel) } : {}), ...(newTitle ? { title: newTitle.name } : {}) },
    });
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <KitchenScene accent={CUISINE_BY_ID[recipe.cuisine].color} height={170}>
        <ChefAvatar mode="cook" scarf={title.scarf} scarfShade={title.scarfShade} scale={5} />
      </KitchenScene>

      <View style={[styles.row, { justifyContent: 'space-between', marginTop: 12 }]}>
        <PixelText size={11} style={{ flex: 1 }} numberOfLines={2}>
          {recipe.name}
        </PixelText>
        <PixelText size={10} color={colors.gold}>
          ⏱ {fmt(elapsed)}
        </PixelText>
      </View>
      <View style={{ marginTop: 10 }}>
        <SegmentBar progress={count / done.length} segments={done.length * 3} color={colors.gold} />
      </View>
      <PixelText size={7} color={colors.textDim} style={{ marginTop: 4 }}>
        STEP {Math.min(count + 1, done.length)} OF {done.length} · TAP EACH STEP WHEN DONE
      </PixelText>

      <View style={{ marginTop: 14 }}>
        {recipe.steps.map((s, i) => (
          <Pressable
            key={i}
            onPress={() => toggle(i)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: done[i] }}
            style={[styles.step, done[i] && { backgroundColor: '#24402f', borderLeftColor: colors.xp }]}
          >
            <View style={[styles.box, done[i] && { backgroundColor: colors.xp }]}>
              {done[i] && (
                <PixelText size={9} color="#10261a">
                  ✓
                </PixelText>
              )}
            </View>
            <Body style={{ flex: 1, opacity: done[i] ? 0.6 : 1, textDecorationLine: done[i] ? 'line-through' : 'none' }}>{s}</Body>
          </Pressable>
        ))}
      </View>

      <PixelButton
        style={{ marginTop: 12 }}
        variant={allDone ? 'gold' : 'ghost'}
        label={allDone ? 'SERVE IT UP! 🍽' : 'FINISH ALL STEPS'}
        disabled={!allDone}
        onPress={serve}
      />
      <PixelButton style={{ marginTop: 10 }} small variant="ghost" label="ABANDON" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.panel,
    borderWidth: 3,
    borderColor: colors.border,
    borderLeftWidth: 6,
    borderLeftColor: colors.gold,
    padding: 10,
    marginBottom: 8,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 3,
    borderColor: colors.border,
    backgroundColor: colors.bgDeep,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
