import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PlayerKitchen } from '../../components/PlayerKitchen';
import { Body, PixelButton, PixelText, SegmentBar } from '../../components/ui';
import { ACTION_ICONS, ACTION_LABELS, stepAction } from '../../game/cookActions';
import { RECIPE_BY_ID } from '../../game/data';
import { useGame } from '../../game/GameContext';
import { colors } from '../../theme';

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export default function Cook() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = useGame();
  const recipe = RECIPE_BY_ID[id];
  const [done, setDone] = useState<boolean[]>(() => recipe?.steps.map(() => false) ?? []);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (!recipe) return <Body>Recipe not found.</Body>;
  const count = done.filter(Boolean).length;
  const allDone = count === done.length;
  // Animate whatever the next unticked step involves; plate up once everything is done.
  const currentStep = done.findIndex((d) => !d);
  const action = allDone ? 'plate' : stepAction(recipe.steps[currentStep]);

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
      <PlayerKitchen mode="cook" action={action} cuisine={recipe.cuisine} height={170} />
      <View style={styles.actionTag} accessibilityLiveRegion="polite">
        <PixelText size={8} color={colors.gold}>
          {ACTION_ICONS[action]} {ACTION_LABELS[action]}…
        </PixelText>
      </View>

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
            style={[
              styles.step,
              i === currentStep && { borderColor: colors.gold },
              done[i] && { backgroundColor: '#24402f', borderLeftColor: colors.xp },
            ]}
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
  actionTag: {
    alignSelf: 'center',
    marginTop: -14,
    backgroundColor: colors.bgDeep,
    borderWidth: 3,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
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
