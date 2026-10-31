import { ScrollView, View } from 'react-native';
import { RecipeCard } from '../../components/RecipeCard';
import { Body, PixelText } from '../../components/ui';
import { CUISINE_BY_ID } from '../../game/data';
import { useGameState } from '../../game/GameContext';
import { recipesFor, recipeStatus } from '../../game/progression';
import { colors } from '../../theme';

export default function Recipes() {
  const state = useGameState();
  const cuisine = CUISINE_BY_ID[state.activeCuisine!];
  const recipes = recipesFor(cuisine.id);
  const unlocked = recipes.filter((r) => recipeStatus(state, r) !== 'level-locked');
  const locked = recipes.filter((r) => recipeStatus(state, r) === 'level-locked');

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
        <PixelText size={12} color={cuisine.color}>
          {cuisine.emoji} {cuisine.name.toUpperCase()} COOKBOOK
        </PixelText>
      </View>
      <Body dim style={{ marginBottom: 14, fontSize: 13 }}>
        First time you cook a dish earns +50% XP. Switch cuisine from the Kitchen tab.
      </Body>
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
