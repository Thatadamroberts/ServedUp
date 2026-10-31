import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ChefAvatar } from '../../components/ChefAvatar';
import { KitchenScene } from '../../components/KitchenScene';
import { Body, Coins, Panel, PixelButton, PixelText } from '../../components/ui';
import { CUISINE_BY_ID, RECIPE_BY_ID } from '../../game/data';
import { useGame, useGameState } from '../../game/GameContext';
import { capturePhoto, deletePhotoFile } from '../../game/photos';
import { currentLevel, PHOTO_BONUS_COINS, titleFor } from '../../game/progression';
import { colors } from '../../theme';

export default function Entry() {
  const params = useLocalSearchParams<{ id: string; fresh?: string; lv?: string; title?: string }>();
  const game = useGame();
  const state = useGameState();
  const entry = state.completions.find((c) => c.id === params.id);
  const [note, setNote] = useState(entry?.note ?? '');
  const [busy, setBusy] = useState(false);

  if (!entry) return <Body>Entry not found.</Body>;
  const recipe = RECIPE_BY_ID[entry.recipeId];
  const fresh = params.fresh === '1';
  const title = titleFor(currentLevel(state));
  const cuisine = CUISINE_BY_ID[recipe.cuisine];

  const addPhoto = async (source: 'camera' | 'library') => {
    setBusy(true);
    try {
      const uri = await capturePhoto(source, entry.id);
      if (uri) {
        const old = entry.photoUri;
        game.attachPhoto(entry.id, uri);
        if (old && old !== uri) deletePhotoFile(old);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: fresh ? 'Served!' : 'Journal', headerBackVisible: !fresh, gestureEnabled: !fresh }} />

      {fresh && (
        <>
          <KitchenScene accent={cuisine.color} height={170}>
            <ChefAvatar mode="cheer" scarf={title.scarf} scarfShade={title.scarfShade} scale={5} />
          </KitchenScene>
          <PixelText size={16} color={colors.gold} style={{ textAlign: 'center', marginTop: 14 }}>
            DISH SERVED!
          </PixelText>
          <View style={[styles.row, { justifyContent: 'center', gap: 24, marginTop: 10 }]}>
            <PixelText size={14} color={colors.xp}>
              +{entry.xpEarned} XP
            </PixelText>
            <Coins amount={entry.coinsEarned} size={14} />
          </View>
          {entry.firstTime && (
            <PixelText size={8} color={colors.textDim} style={{ textAlign: 'center', marginTop: 8 }}>
              FIRST COOK BONUS ×1.5 XP
            </PixelText>
          )}
          {params.lv && (
            <Panel style={{ marginTop: 14 }} color="#3a2f12">
              <PixelText size={12} color={colors.gold} style={{ textAlign: 'center' }}>
                ★ LEVEL UP! LV {params.lv} ★
              </PixelText>
              {params.title ? (
                <PixelText size={9} style={{ textAlign: 'center', marginTop: 8 }}>
                  NEW TITLE: {params.title.toUpperCase()}
                </PixelText>
              ) : null}
              <Body dim style={{ textAlign: 'center', marginTop: 6, fontSize: 13 }}>
                Tougher recipes and new market stock may be unlocked.
              </Body>
            </Panel>
          )}
        </>
      )}

      <View style={[styles.row, { marginTop: fresh ? 20 : 0 }]}>
        <Text style={{ fontSize: 28, marginRight: 10 }}>{recipe.emoji}</Text>
        <View style={{ flex: 1 }}>
          <PixelText size={11}>{recipe.name}</PixelText>
          <Body dim style={{ fontSize: 12 }}>
            {cuisine.name} · {new Date(entry.completedAt).toLocaleString()}
          </Body>
        </View>
      </View>

      <View style={[styles.photoFrame, !entry.photoUri && { aspectRatio: undefined, minHeight: 220 }]}>
        {entry.photoUri ? (
          <Image source={{ uri: entry.photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityLabel={`Photo of your ${recipe.name}`} />
        ) : (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 48 }}>📸</Text>
            <PixelText size={9} style={{ marginTop: 10, textAlign: 'center' }}>
              SNAP YOUR CREATION
            </PixelText>
            <Body dim style={{ textAlign: 'center', marginTop: 6, fontSize: 13 }}>
              Link a photo to this recipe for your journal
              {entry.photoBonusClaimed ? '.' : ` and earn a ${PHOTO_BONUS_COINS}-coin tip.`}
            </Body>
          </View>
        )}
      </View>

      <View style={[styles.row, { gap: 10, marginTop: 10 }]}>
        {Platform.OS !== 'web' && (
          <PixelButton
            style={{ flex: 1 }}
            variant="blue"
            label={entry.photoUri ? 'RETAKE' : 'CAMERA'}
            disabled={busy}
            onPress={() => addPhoto('camera')}
          />
        )}
        <PixelButton style={{ flex: 1 }} variant="ghost" label="LIBRARY" disabled={busy} onPress={() => addPhoto('library')} />
      </View>
      {entry.photoUri && (
        <PixelButton
          style={{ marginTop: 8 }}
          small
          variant="ghost"
          label="REMOVE PHOTO"
          onPress={() => {
            deletePhotoFile(entry.photoUri);
            game.removePhoto(entry.id);
          }}
        />
      )}

      <PixelText size={9} style={{ marginTop: 18, marginBottom: 8 }}>
        CHEF&apos;S NOTES
      </PixelText>
      <TextInput
        value={note}
        onChangeText={setNote}
        onBlur={() => game.setNote(entry.id, note)}
        placeholder="How did it turn out? Any tweaks for next time?"
        placeholderTextColor={colors.textDim}
        multiline
        style={styles.note}
      />

      <PixelButton style={{ marginTop: 16 }} variant="ghost" small label="VIEW RECIPE" onPress={() => router.push(`/recipe/${recipe.id}`)} />
      {fresh && (
        <PixelButton
          style={{ marginTop: 10 }}
          label="BACK TO KITCHEN ▶"
          onPress={() => {
            game.setNote(entry.id, note);
            router.dismissTo('/kitchen');
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  photoFrame: {
    marginTop: 12,
    aspectRatio: 1,
    backgroundColor: colors.bgDeep,
    borderWidth: 4,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  note: {
    minHeight: 90,
    backgroundColor: colors.bgDeep,
    color: colors.text,
    borderWidth: 3,
    borderColor: colors.border,
    padding: 10,
    fontSize: 15,
    textAlignVertical: 'top',
  },
});
