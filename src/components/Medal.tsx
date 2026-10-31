import { View } from 'react-native';
import { MASTERY_COLORS, MASTERY_NAMES, type MasteryTier } from '../game/progression';
import { PixelSprite } from './PixelSprite';

const MEDAL = ['RR...RR', '.RR.RR.', '..RRR..', '.KKKKK.', 'KMmMMMK', 'KmMMMMK', 'KMMMMMK', '.KKKKK.'];

/** Pixel medal for bronze / silver / gold mastery. Tier 0 renders an empty outline. */
export function Medal({ tier, scale = 2 }: { tier: MasteryTier; scale?: number }) {
  const color = tier ? MASTERY_COLORS[tier] : '#3a3852';
  return (
    <View accessibilityLabel={tier ? `${MASTERY_NAMES[tier]} mastery` : 'Not yet mastered'}>
      <PixelSprite
        layers={[{ rows: MEDAL, x: 0, y: 0 }]}
        width={7}
        height={8}
        scale={scale}
        palette={{ R: tier ? '#3d6fd9' : '#3a3852', K: '#0b0a16', M: color, m: tier ? '#ffffff88' : color }}
      />
    </View>
  );
}
