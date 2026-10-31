import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CUISINE_BY_ID } from '../game/data';
import { isDailySpecial, masteryTier, missingIngredients, recipeStatus, rewardFor, timesCooked } from '../game/progression';
import type { GameState, Recipe } from '../game/types';
import { colors } from '../theme';
import { Medal } from './Medal';
import { Body, Coins, Difficulty, PixelText, Tag } from './ui';

export function RecipeCard({ recipe, state }: { recipe: Recipe; state: GameState }) {
  const status = recipeStatus(state, recipe);
  const reward = rewardFor(state, recipe);
  const cooked = timesCooked(state, recipe.id);
  const locked = status === 'level-locked';
  const missing = status === 'needs-ingredients' ? missingIngredients(state, recipe) : [];
  const tier = masteryTier(cooked);
  const special = isDailySpecial(state, recipe.id);

  return (
    <Pressable
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${recipe.name}${locked ? `, unlocks at level ${recipe.level}` : ''}`}
      style={({ pressed }) => [styles.card, special && styles.special, { opacity: locked ? 0.55 : 1, transform: [{ translateY: pressed ? 2 : 0 }] }]}
    >
      <View style={[styles.emojiBox, { backgroundColor: locked ? colors.bgDeep : CUISINE_BY_ID[recipe.cuisine].color }]}>
        <Text style={{ fontSize: 28 }}>{locked ? '🔒' : recipe.emoji}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <PixelText size={9} numberOfLines={2}>
          {recipe.name}
        </PixelText>
        <View style={[styles.row, { marginTop: 6 }]}>
          <Difficulty value={recipe.difficulty} />
          <Body dim style={{ fontSize: 12, marginLeft: 8 }}>
            {recipe.minutes} min
          </Body>
        </View>
        <View style={[styles.row, { marginTop: 6, flexWrap: 'wrap', rowGap: 4 }]}>
          {locked && <Tag label={`LV ${recipe.level}`} color={colors.bgDeep} textColor={colors.textDim} />}
          {special && <Tag label="★ 2× XP" color={colors.gold} textColor="#2b1d14" />}
          {status === 'ready' && <Tag label="READY" color={colors.xp} textColor="#10261a" />}
          {status === 'needs-ingredients' && <Tag label={`NEED ${missing.length}`} color={colors.danger} textColor="#fff" />}
          {cooked > 0 ? <Tag label={`×${cooked}`} /> : !locked && <Tag label="NEW!" color={colors.gold} textColor="#2b1d14" />}
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
        {tier > 0 && (
          <View style={{ marginBottom: 6 }}>
            <Medal tier={tier} />
          </View>
        )}
        <PixelText size={8} color={colors.xp}>
          +{reward.xp}XP
        </PixelText>
        <View style={{ marginTop: 6 }}>
          <Coins amount={reward.coins} size={8} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.panel,
    borderWidth: 3,
    borderColor: colors.border,
    borderLeftColor: colors.highlight,
    borderTopColor: colors.highlight,
    padding: 10,
    marginBottom: 10,
  },
  special: { borderColor: colors.gold, borderLeftColor: colors.gold, borderTopColor: colors.gold },
  emojiBox: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center' },
});
