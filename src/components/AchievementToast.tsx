import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '../game/GameContext';
import { colors } from '../theme';
import { Badge } from './Badge';
import { Coins, PixelText } from './ui';

/** Shows each newly earned achievement in turn at the top of the screen. */
export function AchievementToast() {
  const { toasts, dismissToast } = useGame();
  const insets = useSafeAreaInsets();
  const current = toasts[0];

  useEffect(() => {
    if (!current) return;
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const t = setTimeout(dismissToast, 3500);
    return () => clearTimeout(t);
  }, [current, dismissToast]);

  if (!current) return null;
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { top: insets.top + 8 }]}>
      <Pressable onPress={dismissToast} style={styles.toast} accessibilityRole="alert" accessibilityLabel={`Trophy earned: ${current.name}`}>
        <Badge icon={current.icon} unlocked size={44} />
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <PixelText size={7} color={colors.gold}>
            TROPHY EARNED!
          </PixelText>
          <PixelText size={9} style={{ marginTop: 4 }}>
            {current.name}
          </PixelText>
        </View>
        <Coins amount={current.coins} size={9} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12, alignItems: 'center' },
  toast: {
    width: '100%',
    maxWidth: 440,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.panelLight,
    borderWidth: 3,
    borderColor: colors.gold,
    padding: 8,
  },
});
