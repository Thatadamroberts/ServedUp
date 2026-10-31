import { router } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ChefAvatar } from '../../components/ChefAvatar';
import { KitchenScene } from '../../components/KitchenScene';
import { PlayerHud } from '../../components/PlayerHud';
import { RecipeCard } from '../../components/RecipeCard';
import { Body, Coins, Panel, PixelText } from '../../components/ui';
import { CUISINE_BY_ID, CUISINES } from '../../game/data';
import { useGame, useGameState } from '../../game/GameContext';
import { currentLevel, recipesFor, recipeStatus, timesCooked, titleFor } from '../../game/progression';
import type { CuisineId } from '../../game/types';
import { colors } from '../../theme';

function confirm(title: string, message: string, onYes: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onYes();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'OK', onPress: onYes },
  ]);
}

export default function Kitchen() {
  const game = useGame();
  const state = useGameState();
  const level = currentLevel(state);
  const title = titleFor(level);
  const cuisine = CUISINE_BY_ID[state.activeCuisine!];
  const recipes = recipesFor(cuisine.id);

  const ready = recipes
    .filter((r) => recipeStatus(state, r) === 'ready')
    .sort((a, b) => timesCooked(state, a.id) - timesCooked(state, b.id) || b.xp - a.xp)
    .slice(0, 3);
  const nextUnlock = recipes.find((r) => r.level > level);
  const photos = state.completions.filter((c) => c.photoUri).length;

  const onCuisine = (id: CuisineId) => {
    if (state.unlockedCuisines.includes(id)) return game.switchCuisine(id);
    const c = CUISINE_BY_ID[id];
    if (state.coins < c.unlockCost) {
      const msg = `You need ${c.unlockCost} coins to open the ${c.name} kitchen. Keep cooking!`;
      return Platform.OS === 'web' ? globalThis.alert?.(msg) : Alert.alert('Not enough coins', msg);
    }
    confirm(`Open ${c.name} kitchen?`, `Spend ${c.unlockCost} coins to unlock ${c.name} cuisine and its starter pantry.`, () =>
      game.unlockCuisine(id),
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <KitchenScene accent={cuisine.color}>
        <ChefAvatar mode="idle" scarf={title.scarf} scarfShade={title.scarfShade} scale={5} />
      </KitchenScene>

      <Panel style={{ marginTop: 12 }}>
        <PlayerHud state={state} />
      </Panel>

      <View style={styles.stats}>
        <Panel style={styles.stat}>
          <PixelText size={14} color={colors.gold} style={{ textAlign: 'center' }}>
            {state.completions.length}
          </PixelText>
          <PixelText size={7} color={colors.textDim} style={{ textAlign: 'center' }}>
            DISHES
          </PixelText>
        </Panel>
        <Panel style={styles.stat}>
          <PixelText size={14} color={colors.gold} style={{ textAlign: 'center' }}>
            {new Set(state.completions.map((c) => c.recipeId)).size}
          </PixelText>
          <PixelText size={7} color={colors.textDim} style={{ textAlign: 'center' }}>
            MASTERED
          </PixelText>
        </Panel>
        <Panel style={styles.stat}>
          <PixelText size={14} color={colors.gold} style={{ textAlign: 'center' }}>
            {photos}
          </PixelText>
          <PixelText size={7} color={colors.textDim} style={{ textAlign: 'center' }}>
            PHOTOS
          </PixelText>
        </Panel>
      </View>

      <PixelText size={10} style={styles.h}>
        {ready.length ? 'READY TO COOK' : 'NOTHING READY'}
      </PixelText>
      {ready.length ? (
        ready.map((r) => <RecipeCard key={r.id} recipe={r} state={state} />)
      ) : (
        <Panel>
          <Body>Your pantry is missing something for every unlocked dish. Head to the market to stock up!</Body>
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
        onPress={() => confirm('Start over?', 'This erases your chef, coins and journal. Photos stay in your gallery.', () => game.reset().then(() => router.replace('/onboarding')))}
        style={{ marginTop: 30, alignSelf: 'center' }}
      >
        <PixelText size={7} color={colors.textDim}>
          RESET SAVE
        </PixelText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h: { marginTop: 20, marginBottom: 10 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 10 },
  stat: { flex: 1 },
  cuisines: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cuisine: { width: '31%', flexGrow: 1, alignItems: 'center', padding: 8, borderWidth: 3 },
});
