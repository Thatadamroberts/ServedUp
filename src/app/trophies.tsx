import { ScrollView, StyleSheet, View } from 'react-native';
import { Badge } from '../components/Badge';
import { Body, Coins, PixelText, SegmentBar } from '../components/ui';
import { ACHIEVEMENTS } from '../game/achievements';
import { useGameState } from '../game/GameContext';
import { colors } from '../theme';

export default function Trophies() {
  const state = useGameState();
  const got = ACHIEVEMENTS.filter((a) => state.achievements[a.id]).length;
  const sorted = [...ACHIEVEMENTS].sort((a, b) => (state.achievements[b.id] ? 1 : 0) - (state.achievements[a.id] ? 1 : 0));

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <PixelText size={11} color={colors.gold}>
        TROPHY SHELF
      </PixelText>
      <View style={{ marginTop: 10 }}>
        <SegmentBar progress={got / ACHIEVEMENTS.length} segments={ACHIEVEMENTS.length} color={colors.gold} />
      </View>
      <PixelText size={7} color={colors.textDim} style={{ marginTop: 4, marginBottom: 14 }}>
        {got} OF {ACHIEVEMENTS.length} EARNED
      </PixelText>
      {sorted.map((a) => {
        const at = state.achievements[a.id];
        return (
          <View key={a.id} style={[styles.row, !at && { opacity: 0.6 }]}>
            <Badge icon={a.icon} unlocked={!!at} />
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <PixelText size={9}>{a.name}</PixelText>
              <Body dim style={{ fontSize: 12, lineHeight: 16, marginTop: 4 }}>
                {a.description}
                {at ? ` Earned ${new Date(at).toLocaleDateString()}.` : ''}
              </Body>
            </View>
            {at ? (
              <PixelText size={8} color={colors.xp}>
                ✓
              </PixelText>
            ) : (
              <Coins amount={a.coins} size={8} />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderWidth: 3,
    borderColor: colors.border,
    padding: 10,
    marginBottom: 8,
  },
});
