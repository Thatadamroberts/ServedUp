import { ScrollView, View } from 'react-native';
import { RecipeCard } from '../../components/RecipeCard';
import { Body, PixelText } from '../../components/ui';
import { CUISINE_BY_ID } from '../../game/data';
import { useGameState } from '../../game/GameContext';
import { masteryTier, recipesFor, recipeStatus, timesCooked } from '../../game/progression';
import { colors } from '../../theme';

export default function Recipes() {
  const state = useGameState();
  const cuisine = CUISINE_BY_ID[state.activeCuisine!];
  const recipes = recipesFor(cuisine.id);
  const unlocked = recipes.filter((r) => recipeStatus(state, r) !== 'level-locked');
  const locked = recipes.filter((r) => recipeStatus(state, r) === 'level-locked');
  const tiers = recipes.map((r) => masteryTier(timesCooked(state, r.id)));
  const golds = tiers.filter((t) => t === 3).length;
  const anyMedal = tiers.filter((t) => t > 0).length;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <PixelText size={12} color={cuisine.color}>
          {cuisine.emoji} {cuisine.name.toUpperCase()} COOKBOOK
        </PixelText>
      </View>
      <Body dim style={{ marginBottom: 14, fontSize: 13 }}>
        First cook of a dish earns +50% XP. Cook a dish 1, 3 and 5 times for bronze, silver and gold mastery.
      </Body>
      <PixelText size={8} color={colors.gold} style={{ marginBottom: 14 }}>
        MASTERY: {anyMedal}/{recipes.length} COOKED · {golds} GOLD
      </PixelText>
      {unlocked.map((r) => (
        <RecipeCard key={r.id} recipe={r} state={state} />
      ))}
      {locked.length > 0 && (
        <PixelText size={9} color={colors.textDim} style={{ marginVertical: 10 }}>
          LOCKED — LEVEL UP TO LEARN
        </PixelText>
      )}
      {locked.map((r) => (
        <RecipeCard key={r.id} recipe={r} state={state} />
      ))}
    </ScrollView>
  );
}
