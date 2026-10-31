import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Coins, Panel, PixelButton, PixelText } from '../../components/ui';
import { CUISINE_BY_ID, STAPLES } from '../../game/data';
import { useGame, useGameState } from '../../game/GameContext';
import { currentLevel, marketFor, recipesUsing } from '../../game/progression';
import type { Ingredient } from '../../game/types';
import { colors } from '../../theme';

export default function Market() {
  const game = useGame();
  const state = useGameState();
  const level = currentLevel(state);
  const cuisine = CUISINE_BY_ID[state.activeCuisine!];
  const [flash, setFlash] = useState<string | null>(null);
  const items = marketFor(state);
  const owned = new Set(state.ownedIngredients);

  const forSale = items.filter((i) => !owned.has(i.id) && i.minLevel <= level);
  const upcoming = items.filter((i) => !owned.has(i.id) && i.minLevel > level);
  const pantry = items.filter((i) => owned.has(i.id));

  const buy = (i: Ingredient) => {
    const r = game.buy(i.id);
    if (r.ok) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setFlash(`Bought ${i.name}!`);
      setTimeout(() => setFlash(null), 1500);
    }
  };

  const Row = ({ i, mode }: { i: Ingredient; mode: 'buy' | 'locked' | 'owned' }) => {
    const uses = recipesUsing(i.id, cuisine.id);
    return (
      <View style={[styles.row, mode === 'locked' && { opacity: 0.5 }]}>
        <View style={styles.icon}>
          <Text style={{ fontSize: 22 }}>{mode === 'locked' ? '🔒' : i.emoji}</Text>
        </View>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Body style={{ fontWeight: '700' }}>{i.name}</Body>
          <Body dim style={{ fontSize: 12, lineHeight: 16 }} numberOfLines={2}>
            {mode === 'locked'
              ? `Unlocks at LV ${i.minLevel}`
              : uses.length
                ? `For: ${uses.map((r) => r.name).join(', ')}`
                : `Not used in ${cuisine.name} recipes`}
          </Body>
        </View>
        {mode === 'buy' && (
          <View style={{ alignItems: 'flex-end' }}>
            <Coins amount={i.price} size={9} />
            <PixelButton
              small
              label="BUY"
              variant="green"
              disabled={state.coins < i.price}
              onPress={() => buy(i)}
              style={{ marginTop: 6, minWidth: 64 }}
            />
          </View>
        )}
        {mode === 'owned' && (
          <PixelText size={8} color={colors.xp}>
            OWNED
          </PixelText>
        )}
        {mode === 'locked' && <Coins amount={i.price} size={8} />}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Panel>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <PixelText size={10}>{cuisine.name.toUpperCase()} MARKET</PixelText>
            <Coins amount={state.coins} size={12} />
          </View>
          <Body dim style={{ fontSize: 12, marginTop: 6 }}>
            Ingredients are yours to keep once bought. Always in the cupboard: {STAPLES.join(', ').toLowerCase()}.
          </Body>
        </Panel>

        <PixelText size={9} style={styles.h}>
          FOR SALE
        </PixelText>
        {forSale.length ? forSale.map((i) => <Row key={i.id} i={i} mode="buy" />) : <Body dim>Sold out for your level — keep cooking!</Body>}

        {upcoming.length > 0 && (
          <>
            <PixelText size={9} style={styles.h}>
              COMING SOON
            </PixelText>
            {upcoming.map((i) => (
              <Row key={i.id} i={i} mode="locked" />
            ))}
          </>
        )}

        <PixelText size={9} style={styles.h}>
          YOUR PANTRY ({pantry.length})
        </PixelText>
        {pantry.map((i) => (
          <Row key={i.id} i={i} mode="owned" />
        ))}
      </ScrollView>
      {flash && (
        <View style={styles.toast} pointerEvents="none">
          <PixelText size={9} color="#10261a">
            {flash}
          </PixelText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  h: { marginTop: 18, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderWidth: 3,
    borderColor: colors.border,
    padding: 8,
    marginBottom: 8,
  },
  icon: { width: 44, height: 44, backgroundColor: colors.bgDeep, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  toast: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: colors.xp,
    borderWidth: 3,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
