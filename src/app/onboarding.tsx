import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChefAvatar } from '../components/ChefAvatar';
import { Body, Panel, PixelButton, PixelText } from '../components/ui';
import { CUISINES, INGREDIENT_BY_ID, RECIPES, STARTER_PACKS } from '../game/data';
import { useGame } from '../game/GameContext';
import type { CuisineId } from '../game/types';
import { colors, PIXEL_FONT } from '../theme';

export default function Onboarding() {
  const { start } = useGame();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [cuisine, setCuisine] = useState<CuisineId | null>(null);

  const begin = () => {
    if (!cuisine) return;
    start(name, cuisine);
    router.replace('/kitchen');
  };

  const selected = CUISINES.find((c) => c.id === cuisine);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={{ backgroundColor: colors.bg }}
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <PixelText size={22} color={colors.gold} style={{ textAlign: 'center' }}>
          SERVED UP
        </PixelText>
        <PixelText size={8} color={colors.textDim} style={{ textAlign: 'center', marginTop: 6 }}>
          A COOKING RPG FOR REAL KITCHENS
        </PixelText>

        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <ChefAvatar mode={cuisine ? 'cheer' : 'idle'} scale={6} />
        </View>

        <Panel>
          <PixelText size={9}>WHAT DO THEY CALL YOU, CHEF?</PixelText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textDim}
            maxLength={16}
            style={styles.input}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </Panel>

        <PixelText size={10} style={{ marginTop: 20, marginBottom: 10 }}>
          CHOOSE YOUR CUISINE
        </PixelText>
        <View style={styles.grid}>
          {CUISINES.map((c) => {
            const active = c.id === cuisine;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCuisine(c.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[styles.cuisine, { borderColor: active ? colors.gold : colors.border, backgroundColor: active ? c.color : colors.panel }]}
              >
                <Body style={{ fontSize: 30, lineHeight: 38 }}>{c.emoji}</Body>
                <PixelText size={9} style={{ marginTop: 4 }}>
                  {c.name.toUpperCase()}
                </PixelText>
                <Body dim={!active} style={{ fontSize: 12, lineHeight: 16, textAlign: 'center', marginTop: 4 }}>
                  {c.tagline}
                </Body>
              </Pressable>
            );
          })}
        </View>

        {selected && (
          <Panel style={{ marginTop: 16 }}>
            <PixelText size={8} color={colors.gold}>
              STARTER PANTRY
            </PixelText>
            <Body style={{ marginTop: 6 }}>
              {STARTER_PACKS[selected.id].map((id) => `${INGREDIENT_BY_ID[id].emoji} ${INGREDIENT_BY_ID[id].name}`).join('  ·  ')}
            </Body>
            <Body dim style={{ marginTop: 8, fontSize: 13 }}>
              {RECIPES.filter((r) => r.cuisine === selected.id).length} recipes to master, from street snacks to showstoppers. You
              can open other cuisines later with coins.
            </Body>
          </Panel>
        )}

        <PixelButton label="START YOUR SHIFT ▶" onPress={begin} disabled={!cuisine} style={{ marginTop: 20 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 10,
    backgroundColor: colors.bgDeep,
    borderWidth: 3,
    borderColor: colors.border,
    color: colors.text,
    padding: 12,
    fontFamily: PIXEL_FONT,
    fontSize: 12,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  cuisine: {
    width: '48.5%',
    borderWidth: 3,
    padding: 10,
    alignItems: 'center',
    minHeight: 120,
  },
});
