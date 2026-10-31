import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, PIXEL_FONT } from '../theme';
import { PixelSprite } from './PixelSprite';
import { BASE_PALETTE, COIN, STAR } from './sprites';

export function PixelText({
  children,
  size = 10,
  color = colors.text,
  style,
  numberOfLines,
}: {
  children: ReactNode;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ fontFamily: PIXEL_FONT, fontSize: size, lineHeight: Math.round(size * 1.6), color }, style]}
    >
      {children}
    </Text>
  );
}

export function Body({
  children,
  dim,
  style,
  numberOfLines,
}: {
  children: ReactNode;
  dim?: boolean;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.body, dim && { color: colors.textDim }, style]}>
      {children}
    </Text>
  );
}

/** Chunky bevelled panel, like a 16-bit dialog box. */
export function Panel({ children, style, color }: { children: ReactNode; style?: StyleProp<ViewStyle>; color?: string }) {
  return (
    <View style={[styles.panelOuter, style]}>
      <View style={[styles.panelInner, color ? { backgroundColor: color } : null]}>{children}</View>
    </View>
  );
}

type Variant = 'gold' | 'green' | 'blue' | 'red' | 'ghost';
const VARIANTS: Record<Variant, { bg: string; shade: string; text: string }> = {
  gold: { bg: colors.gold, shade: colors.goldDark, text: '#2b1d14' },
  green: { bg: colors.xp, shade: colors.xpDark, text: '#10261a' },
  blue: { bg: colors.blue, shade: colors.blueDark, text: '#ffffff' },
  red: { bg: colors.danger, shade: colors.dangerDark, text: '#ffffff' },
  ghost: { bg: colors.panelLight, shade: colors.border, text: colors.text },
};

export function PixelButton({
  label,
  onPress,
  variant = 'gold',
  disabled,
  small,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const v = VARIANTS[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        {
          backgroundColor: disabled ? '#55526e' : v.bg,
          borderBottomColor: disabled ? '#3a3852' : v.shade,
          borderRightColor: disabled ? '#3a3852' : v.shade,
          transform: [{ translateY: pressed ? 2 : 0 }],
          borderBottomWidth: pressed ? 2 : 5,
        },
        style,
      ]}
    >
      <PixelText size={small ? 8 : 11} color={disabled ? '#9a97b3' : v.text} style={{ textAlign: 'center' }}>
        {label}
      </PixelText>
    </Pressable>
  );
}

/** Segmented 16-bit progress bar. */
export function SegmentBar({
  progress,
  color = colors.xp,
  segments = 16,
  height = 14,
}: {
  progress: number;
  color?: string;
  segments?: number;
  height?: number;
}) {
  const filled = Math.round(Math.max(0, Math.min(1, progress)) * segments);
  return (
    <View style={[styles.barOuter, { height }]}>
      {Array.from({ length: segments }).map((_, i) => (
        <View key={i} style={{ flex: 1, marginRight: i < segments - 1 ? 2 : 0, backgroundColor: i < filled ? color : '#1a1930' }} />
      ))}
    </View>
  );
}

export function CoinIcon({ scale = 2 }: { scale?: number }) {
  return <PixelSprite layers={[{ rows: COIN, x: 0, y: 0 }]} width={8} height={8} scale={scale} palette={BASE_PALETTE} />;
}

export function StarIcon({ scale = 2 }: { scale?: number }) {
  return <PixelSprite layers={[{ rows: STAR, x: 0, y: 0 }]} width={7} height={7} scale={scale} palette={BASE_PALETTE} />;
}

export function Coins({ amount, size = 10 }: { amount: number; size?: number }) {
  return (
    <View style={styles.row}>
      <CoinIcon scale={Math.max(1.5, size / 5)} />
      <PixelText size={size} color={colors.gold} style={{ marginLeft: 6 }}>
        {amount}
      </PixelText>
    </View>
  );
}

export function Difficulty({ value }: { value: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Difficulty ${value} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} style={{ opacity: i < value ? 1 : 0.2, marginRight: 2 }}>
          <StarIcon scale={2} />
        </View>
      ))}
    </View>
  );
}

export function Tag({ label, color = colors.panelLight, textColor = colors.text }: { label: string; color?: string; textColor?: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: color }]}>
      <PixelText size={7} color={textColor}>
        {label}
      </PixelText>
    </View>
  );
}

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  body: { color: colors.text, fontSize: 15, lineHeight: 22 },
  panelOuter: {
    borderWidth: 3,
    borderColor: colors.border,
    backgroundColor: colors.border,
  },
  panelInner: {
    backgroundColor: colors.panel,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: colors.highlight,
    borderLeftColor: colors.highlight,
    padding: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderColor: colors.border,
    borderRightWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmall: { paddingVertical: 8, paddingHorizontal: 10 },
  barOuter: {
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: colors.border,
    backgroundColor: colors.border,
    padding: 2,
  },
  tag: { paddingHorizontal: 6, paddingVertical: 3, borderWidth: 2, borderColor: colors.border, marginRight: 6 },
});
