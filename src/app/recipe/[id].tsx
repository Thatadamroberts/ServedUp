import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Medal } from '../../components/Medal';
import { Body, Coins, Difficulty, Panel, PixelButton, PixelText, Tag } from '../../components/ui';
import { CUISINE_BY_ID, INGREDIENT_BY_ID, RECIPE_BY_ID } from '../../game/data';
import { useGame, useGameState } from '../../game/GameContext';
import { cooksToNextTier, currentLevel, MASTERY_NAMES, MASTERY_REWARDS, masteryTier, recipeStatus, rewardFor, timesCooked } from '../../game/progression';
import { colors, difficultyLabel } from '../../theme';

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const game = useGame();
  const state = useGameState();
  const recipe = RECIPE_BY_ID[id];
  if (!recipe) return <Body>Recipe not found.</Body>;

  const status = recipeStatus(state, recipe);
  const reward = rewardFor(state, recipe);
  const level = currentLevel(state);
  const owned = new Set(state.ownedIngredients);
  const cuisine = CUISINE_BY_ID[recipe.cuisine];
  const locked = status === 'level-locked';
  const cooked = timesCooked(state, recipe.id);
  const tier = masteryTier(cooked);
  const toNext = cooksToNextTier(cooked);
  const nextTier = (tier + 1) as 1 | 2 | 3;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Stack.Screen options={{ title: cuisine.name }} />
      <View style={[styles.hero, { backgroundColor: cuisine.color }]}>
        <Text style={{ fontSize: 64 }}>{locked ? '🔒' : recipe.emoji}</Text>
      </View>
      <PixelText size={14} style={{ marginTop: 14 }}>
        {recipe.name}
      </PixelText>
      <Body dim style={{ marginTop: 6 }}>
        {recipe.description}
      </Body>

      <View style={[styles.row, { marginTop: 12, flexWrap: 'wrap', rowGap: 6 }]}>
        <Difficulty value={recipe.difficulty} />
        <View style={{ width: 8 }} />
        <Tag label={difficultyLabel[recipe.difficulty].toUpperCase()} />
        <Tag label={`${recipe.minutes} MIN`} />
        <Tag label={`SERVES ${recipe.servings}`} />
      </View>

      <Panel style={{ marginTop: 14 }}>
        <PixelText size={8} color={colors.textDim}>
          REWARD{reward.firstTime ? ' · FIRST COOK BONUS!' : ` · COOKED ×${cooked}`}
        </PixelText>
        {reward.daily && (
          <PixelText size={8} color={colors.gold} style={{ marginTop: 4 }}>
            ★ CHEF&apos;S SPECIAL: DOUBLE XP TODAY
          </PixelText>
        )}
        <View style={[styles.row, { marginTop: 8, justifyContent: 'space-around' }]}>
          <PixelText size={14} color={colors.xp}>
            +{reward.xp} XP
          </PixelText>
          <Coins amount={reward.coins} size={14} />
        </View>
      </Panel>

      <Panel style={{ marginTop: 10 }}>
        <View style={styles.row}>
          {[1, 2, 3].map((t) => (
            <View key={t} style={{ marginRight: 8 }}>
              <Medal tier={tier >= t ? (t as 1 | 2 | 3) : 0} scale={3} />
            </View>
          ))}
          <View style={{ flex: 1, marginLeft: 4 }}>
            <PixelText size={8}>{tier ? `${MASTERY_NAMES[tier].toUpperCase()} MASTERY` : 'NOT YET MASTERED'}</PixelText>
            <Body dim style={{ fontSize: 12, lineHeight: 16, marginTop: 4 }}>
              {toNext === null
                ? 'Gold! This dish is part of your signature repertoire.'
                : `Cook ${toNext} more time${toNext === 1 ? '' : 's'} for ${MASTERY_NAMES[nextTier]}${MASTERY_REWARDS[nextTier] ? ` (+${MASTERY_REWARDS[nextTier]} coins)` : ''}.`}
            </Body>
          </View>
        </View>
      </Panel>

      <PixelText size={10} style={styles.h}>
        INGREDIENTS
      </PixelText>
      {recipe.ingredients.map((iid) => {
        const ing = INGREDIENT_BY_ID[iid];
        const have = owned.has(iid);
        const canBuy = !have && level >= ing.minLevel;
        return (
          <View key={iid} style={styles.ing}>
            <Text style={{ fontSize: 20, width: 32 }}>{ing.emoji}</Text>
            <Body style={{ flex: 1 }}>{ing.name}</Body>
            {have ? (
              <PixelText size={8} color={colors.xp}>
                ✓ HAVE
              </PixelText>
            ) : canBuy ? (
              <PixelButton small variant="green" label={`BUY ${ing.price}¢`} disabled={state.coins < ing.price} onPress={() => game.buy(iid)} />
            ) : (
              <PixelText size={7} color={colors.textDim}>
                LV {ing.minLevel}
              </PixelText>
            )}
          </View>
        );
      })}
      <Body dim style={{ fontSize: 12, marginTop: 4 }}>
        Plus cupboard staples: salt, pepper, oil, sugar, water.
      </Body>

      <PixelText size={10} style={styles.h}>
        METHOD
      </PixelText>
      {recipe.steps.map((s, i) => (
        <View key={i} style={[styles.row, { alignItems: 'flex-start', marginBottom: 8 }]}>
          <PixelText size={9} color={colors.gold} style={{ width: 26 }}>
            {i + 1}.
          </PixelText>
          <Body style={{ flex: 1, opacity: locked ? 0.4 : 1 }}>{locked ? '???' : s}</Body>
        </View>
      ))}

      <PixelButton
        style={{ marginTop: 16 }}
        label={locked ? `REACH LV ${recipe.level}` : status === 'needs-ingredients' ? 'MISSING INGREDIENTS' : 'START COOKING ▶'}
        disabled={status !== 'ready'}
        onPress={() => router.push(`/cook/${recipe.id}`)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  hero: { height: 140, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.border },
  h: { marginTop: 20, marginBottom: 10 },
  ing: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.panel,
  },
});
