import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Body, Panel, PixelText } from '../../components/ui';
import { RECIPE_BY_ID } from '../../game/data';
import { useGameState } from '../../game/GameContext';
import { colors } from '../../theme';

export default function Journal() {
  const state = useGameState();
  const entries = state.completions;

  if (!entries.length) {
    return (
      <View style={{ padding: 16 }}>
        <Panel>
          <PixelText size={10} color={colors.gold}>
            YOUR DISH JOURNAL
          </PixelText>
          <Body style={{ marginTop: 8 }}>
            Every dish you serve lands here. Snap a photo of each creation to link it to the recipe — and earn a bonus coin tip!
          </Body>
        </Panel>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
      <View style={styles.grid}>
        {entries.map((c) => {
          const r = RECIPE_BY_ID[c.recipeId];
          return (
            <Pressable
              key={c.id}
              onPress={() => router.push(`/entry/${c.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${r?.name ?? 'Dish'}, ${new Date(c.completedAt).toLocaleDateString()}${c.photoUri ? ', with photo' : ', no photo yet'}`}
              style={styles.cell}
            >
              <View style={styles.photo}>
                {c.photoUri ? (
                  <Image source={{ uri: c.photoUri }} style={StyleSheet.absoluteFill} />
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 34 }}>{r?.emoji ?? '🍽️'}</Text>
                    <PixelText size={6} color={colors.gold} style={{ marginTop: 6 }}>
                      + ADD PHOTO
                    </PixelText>
                  </View>
                )}
              </View>
              <View style={{ padding: 6 }}>
                <PixelText size={7} numberOfLines={2}>
                  {r?.name ?? c.recipeId}
                </PixelText>
                <Body dim style={{ fontSize: 11, lineHeight: 14, marginTop: 2 }}>
                  {new Date(c.completedAt).toLocaleDateString()}
                </Body>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cell: { width: '48.5%', backgroundColor: colors.panel, borderWidth: 3, borderColor: colors.border, marginBottom: 10 },
  photo: { aspectRatio: 1, backgroundColor: colors.bgDeep, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
