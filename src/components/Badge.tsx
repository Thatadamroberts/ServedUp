import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

/** Pixel-framed badge. Locked badges show a dim question mark. */
export function Badge({ icon, unlocked, size = 52 }: { icon: string; unlocked: boolean; size?: number }) {
  return (
    <View style={[styles.outer, { width: size, height: size }, unlocked ? styles.on : styles.off]}>
      <Text style={{ fontSize: size * 0.48, opacity: unlocked ? 1 : 0.35 }}>{unlocked ? icon : '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.border },
  on: { backgroundColor: '#3a2f12', borderTopColor: colors.gold, borderLeftColor: colors.gold },
  off: { backgroundColor: colors.bgDeep },
});
