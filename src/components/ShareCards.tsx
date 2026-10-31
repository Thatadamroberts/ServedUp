import { Image, StyleSheet, Text, View } from 'react-native';
import { ACHIEVEMENTS } from '../game/achievements';
import { CUISINE_BY_ID, RECIPE_BY_ID } from '../game/data';
import { activeStreak, levelInfo, MASTERY_NAMES, masteryTier, playerStats, titleFor } from '../game/progression';
import type { Completion, GameState } from '../game/types';
import { colors } from '../theme';
import { Badge } from './Badge';
import { ChefAvatar } from './ChefAvatar';
import { KitchenScene } from './KitchenScene';
import { Medal } from './Medal';
import { PixelText, SegmentBar } from './ui';

/** On-screen card width in points; exports are scaled up to 1080 px wide. */
export const CARD_WIDTH = 320;
export type CardFormat = 'post' | 'story';
export const CARD_SIZES: Record<CardFormat, { w: number; h: number; label: string }> = {
  post: { w: 1080, h: 1350, label: 'POST 4:5' },
  story: { w: 1080, h: 1920, label: 'STORY 9:16' },
};
export const cardHeight = (f: CardFormat) => (CARD_WIDTH * CARD_SIZES[f].h) / CARD_SIZES[f].w;

function Brand() {
  return (
    <View style={styles.brand}>
      <PixelText size={11} color={colors.gold}>
        SERVED UP
      </PixelText>
      <PixelText size={6} color={colors.textDim}>
        A COOKING RPG
      </PixelText>
    </View>
  );
}

function Footer({ text }: { text: string }) {
  return (
    <PixelText size={6} color={colors.textDim} style={{ textAlign: 'center' }}>
      {text}
    </PixelText>
  );
}

export function ProfileCard({ state, format }: { state: GameState; format: CardFormat }) {
  const info = levelInfo(state.totalXp);
  const title = titleFor(info.level);
  const stats = playerStats(state);
  const photos = state.completions.filter((c) => c.photoUri).slice(0, format === 'story' ? 6 : 3);
  const earned = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).slice(-5);
  const tall = format === 'story';
  // Post cards have less height: show photos or badges, not both.
  const showBadges = earned.length > 0 && (tall || photos.length === 0);
  const cells: [string, string][] = [
    [String(stats.dishes), 'DISHES'],
    [`${stats.cuisinesCooked}/${stats.totalCuisines}`, 'CUISINES'],
    [`🔥${Math.max(activeStreak(state), 0)}`, 'STREAK'],
    [`${Object.keys(state.achievements).length}`, 'TROPHIES'],
  ];
  return (
    <View style={[styles.card, { height: cardHeight(format), gap: tall ? 12 : 8 }]}>
      <Brand />
      <KitchenScene
        accent={CUISINE_BY_ID[state.activeCuisine ?? 'italian'].color}
        height={tall ? 200 : 112}
        wall={state.equipped.wall}
        decor={state.equipped.decor}
        trophyCount={Object.keys(state.achievements).length}
      >
        <ChefAvatar mode="idle" scarf={title.scarf} scarfShade={title.scarfShade} look={state.equipped} scale={tall ? 5 : 3} still />
      </KitchenScene>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <PixelText size={14} numberOfLines={1}>
          {state.chefName}
        </PixelText>
        <PixelText size={8} color={title.scarf === '#1d1d2b' ? colors.textDim : title.scarf}>
          LV {info.level} · {title.name.toUpperCase()}
        </PixelText>
      </View>
      <SegmentBar progress={info.progress} height={12} />
      <View style={styles.grid}>
        {cells.map(([v, l]) => (
          <View key={l} style={styles.cell}>
            <PixelText size={12} color={colors.gold}>
              {v}
            </PixelText>
            <PixelText size={6} color={colors.textDim} style={{ marginTop: 2 }}>
              {l}
            </PixelText>
          </View>
        ))}
      </View>
      {photos.length > 0 && (
        <View style={styles.photos}>
          {photos.map((c) => (
            <Image key={c.id} source={{ uri: c.photoUri }} style={tall ? styles.thumb : styles.thumbSmall} />
          ))}
        </View>
      )}
      {showBadges && (
        <View style={styles.badges}>
          {earned.map((a) => (
            <Badge key={a.id} icon={a.icon} unlocked size={36} />
          ))}
        </View>
      )}
      <View style={{ flex: 1 }} />
      <Footer text="#SERVEDUP  #HOMECOOKING" />
    </View>
  );
}

export function DishCard({ state, entry, format }: { state: GameState; entry: Completion; format: CardFormat }) {
  const recipe = RECIPE_BY_ID[entry.recipeId];
  const cuisine = CUISINE_BY_ID[recipe.cuisine];
  const level = levelInfo(state.totalXp).level;
  const title = titleFor(level);
  const cookNumber = state.completions.filter((c) => c.recipeId === entry.recipeId && c.completedAt <= entry.completedAt).length;
  const tier = masteryTier(cookNumber);
  const tall = format === 'story';
  const photoSize = tall ? CARD_WIDTH - 32 : 184;
  return (
    <View style={[styles.card, { height: cardHeight(format), gap: tall ? 12 : 8 }]}>
      <Brand />
      {format === 'story' && <View style={{ flex: 1 }} />}
      <View style={[styles.photoFrame, { width: photoSize, height: photoSize, borderColor: cuisine.color }]}>
        {entry.photoUri ? (
          <Image source={{ uri: entry.photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <Text style={{ fontSize: 110 }}>{recipe.emoji}</Text>
        )}
        <View style={[styles.cuisineTag, { backgroundColor: cuisine.color }]}>
          <PixelText size={7} color="#fff">
            {cuisine.emoji} {cuisine.name.toUpperCase()}
          </PixelText>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <PixelText size={12} numberOfLines={2}>
          {recipe.name}
        </PixelText>
        <View style={[styles.row, { gap: 10 }]}>
          <PixelText size={9} color={colors.xp}>
            +{entry.xpEarned} XP
          </PixelText>
          {tier > 0 && (
            <View style={[styles.row, { gap: 4 }]}>
              <Medal tier={tier} />
              <PixelText size={7} color={colors.textDim}>
                {MASTERY_NAMES[tier].toUpperCase()}
              </PixelText>
            </View>
          )}
          {entry.daily && (
            <PixelText size={7} color={colors.gold}>
              ★ SPECIAL
            </PixelText>
          )}
        </View>
        <PixelText size={7} color={colors.textDim}>
          {'★'.repeat(recipe.difficulty)}
          {'☆'.repeat(5 - recipe.difficulty)} · {recipe.minutes} MIN · {new Date(entry.completedAt).toLocaleDateString()}
        </PixelText>
        {entry.note && tall ? (
          <Text style={styles.note} numberOfLines={4}>
            “{entry.note}”
          </Text>
        ) : null}
      </View>
      <View style={{ flex: 1 }} />
      <View style={[styles.row, styles.chefRow]}>
        <ChefAvatar mode="idle" scarf={title.scarf} scarfShade={title.scarfShade} look={state.equipped} scale={2} still />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <PixelText size={8} numberOfLines={1}>
            COOKED BY {state.chefName.toUpperCase()}
          </PixelText>
          <PixelText size={6} color={colors.textDim} style={{ marginTop: 2 }}>
            LV {level} {title.name.toUpperCase()}
          </PixelText>
        </View>
      </View>
      {tall && <Footer text="#SERVEDUP  #HOMECOOKING" />}
    </View>
  );
}

export function captionFor(state: GameState, entry?: Completion): string {
  const info = levelInfo(state.totalXp);
  const title = titleFor(info.level).name;
  if (entry) {
    const recipe = RECIPE_BY_ID[entry.recipeId];
    const cuisine = CUISINE_BY_ID[recipe.cuisine].name;
    return [
      `Just cooked ${recipe.name} ${recipe.emoji} (${cuisine}) and levelled up my chef in Served Up!`,
      entry.note ? `\n${entry.note}` : '',
      `\nLV ${info.level} ${title} 👨‍🍳`,
      `\n#ServedUp #HomeCooking #${cuisine}Food #CookingRPG #WhatICooked`,
    ].join('');
  }
  const s = playerStats(state);
  return [
    `My Served Up chef: LV ${info.level} ${title} 👨‍🍳`,
    `\n${s.dishes} dishes cooked across ${s.cuisinesCooked} cuisine${s.cuisinesCooked === 1 ? '' : 's'}, ${Object.keys(state.achievements).length} trophies, best streak ${s.bestStreak} days.`,
    `\n#ServedUp #HomeCooking #CookingRPG #PixelArt`,
  ].join('');
}

const styles = StyleSheet.create({
  card: { width: CARD_WIDTH, backgroundColor: colors.bg, padding: 16, gap: 12, borderWidth: 4, borderColor: colors.border, overflow: 'hidden' },
  brand: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  row: { flexDirection: 'row', alignItems: 'center' },
  grid: { flexDirection: 'row', gap: 6 },
  cell: { flex: 1, alignItems: 'center', backgroundColor: colors.panel, borderWidth: 2, borderColor: colors.border, paddingVertical: 8 },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  thumb: { width: (CARD_WIDTH - 32 - 12) / 3, height: (CARD_WIDTH - 32 - 12) / 3, borderWidth: 2, borderColor: colors.border },
  thumbSmall: { width: 52, height: 52, borderWidth: 2, borderColor: colors.border },
  badges: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  photoFrame: {
    alignSelf: 'center',
    borderWidth: 4,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cuisineTag: { position: 'absolute', left: 6, top: 6, paddingHorizontal: 6, paddingVertical: 4, borderWidth: 2, borderColor: colors.border },
  note: { color: colors.text, fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
  chefRow: { backgroundColor: colors.panel, borderWidth: 2, borderColor: colors.border, padding: 6 },
});
