import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ChefAvatar } from '../components/ChefAvatar';
import { PlayerKitchen } from '../components/PlayerKitchen';
import { useChefLook } from '../components/useChefLook';
import { Body, Coins, PixelButton, PixelText } from '../components/ui';
import { COSMETICS, SLOT_LABELS } from '../game/cosmetics';
import { useGame, useGameState } from '../game/GameContext';
import { currentLevel } from '../game/progression';
import type { Cosmetic, CosmeticSlot, Equipped } from '../game/types';
import { colors } from '../theme';

const SLOTS: CosmeticSlot[] = ['hat', 'outfit', 'face', 'wall', 'decor'];

function tryOn(eq: Equipped, item: Cosmetic): Equipped {
  if (item.slot === 'decor') return { ...eq, decor: eq.decor.includes(item.id) ? eq.decor : [...eq.decor, item.id] };
  return { ...eq, [item.slot]: item.id };
}

export default function Wardrobe() {
  const game = useGame();
  const state = useGameState();
  const { scarf, scarfShade } = useChefLook();
  const level = currentLevel(state);
  const [slot, setSlot] = useState<CosmeticSlot>('hat');
  const [preview, setPreview] = useState<Cosmetic | null>(null);
  const owned = new Set(state.ownedCosmetics);

  const look = useMemo(() => (preview ? tryOn(state.equipped, preview) : state.equipped), [preview, state.equipped]);
  const isKitchen = slot === 'wall' || slot === 'decor';

  const select = (item: Cosmetic) => {
    if (owned.has(item.id)) {
      game.equip(item.id);
      setPreview(null);
    } else {
      setPreview(item);
    }
  };

  const buy = (item: Cosmetic) => {
    const r = game.buyCosmetic(item.id);
    if (r.ok) {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setPreview(null);
    }
  };

  const isWorn = (item: Cosmetic) =>
    item.slot === 'decor' ? state.equipped.decor.includes(item.id) : state.equipped[item.slot] === item.id;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      {isKitchen ? (
        <PlayerKitchen lookOverride={look} height={170} />
      ) : (
        <View style={styles.stage}>
          <ChefAvatar mode="idle" scarf={scarf} scarfShade={scarfShade} look={look} scale={6} />
        </View>
      )}

      <View style={[styles.row, { justifyContent: 'space-between', marginTop: 12 }]}>
        <PixelText size={9} color={colors.textDim}>
          {preview ? `TRYING ON: ${preview.name.toUpperCase()}` : 'TAP AN ITEM TO TRY IT ON'}
        </PixelText>
        <Coins amount={state.coins} size={11} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }} contentContainerStyle={{ gap: 6 }}>
        {SLOTS.map((s) => (
          <Pressable
            key={s}
            onPress={() => {
              setSlot(s);
              setPreview(null);
            }}
            accessibilityRole="tab"
            accessibilityState={{ selected: slot === s }}
            style={[styles.tab, slot === s && { backgroundColor: colors.gold }]}
          >
            <PixelText size={8} color={slot === s ? '#2b1d14' : colors.text}>
              {SLOT_LABELS[s].toUpperCase()}
            </PixelText>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ marginTop: 12 }}>
        {COSMETICS.filter((c) => c.slot === slot).map((item) => {
          const have = owned.has(item.id);
          const worn = isWorn(item);
          const locked = level < item.minLevel;
          const selected = preview?.id === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => select(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.name}${worn ? ', wearing' : have ? ', owned' : locked ? `, unlocks at level ${item.minLevel}` : `, ${item.price} coins`}`}
              style={[styles.item, (worn || selected) && { borderColor: colors.gold }, locked && { opacity: 0.5 }]}
            >
              <View style={{ flex: 1 }}>
                <PixelText size={9}>{item.name}</PixelText>
                <Body dim style={{ fontSize: 12, lineHeight: 16, marginTop: 4 }}>
                  {locked ? `Unlocks at LV ${item.minLevel}` : item.description}
                </Body>
              </View>
              {worn ? (
                <PixelText size={8} color={colors.xp}>
                  {item.slot === 'decor' ? 'SHOWN ✓' : 'WEARING ✓'}
                </PixelText>
              ) : have ? (
                <PixelText size={8} color={colors.textDim}>
                  {item.slot === 'decor' ? 'TAP TO SHOW' : 'TAP TO WEAR'}
                </PixelText>
              ) : selected && locked ? (
                <PixelText size={8} color={colors.textDim}>
                  LV {item.minLevel}
                </PixelText>
              ) : selected ? (
                <PixelButton small variant="green" label={`BUY ${item.price}¢`} disabled={state.coins < item.price} onPress={() => buy(item)} />
              ) : (
                <Coins amount={item.price} size={9} />
              )}
            </Pressable>
          );
        })}
      </View>
      {slot === 'decor' && (
        <Body dim style={{ fontSize: 12, marginTop: 4 }}>
          Decor items can all be shown at once. Tap one you own to hide or show it. Trophies appear on your counter automatically.
        </Body>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  stage: {
    height: 170,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: colors.bgDeep,
    borderWidth: 3,
    borderColor: colors.border,
    paddingBottom: 4,
  },
  tab: { paddingHorizontal: 10, paddingVertical: 8, borderWidth: 3, borderColor: colors.border, backgroundColor: colors.panel },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.panel,
    borderWidth: 3,
    borderColor: colors.border,
    padding: 10,
    marginBottom: 8,
  },
});
