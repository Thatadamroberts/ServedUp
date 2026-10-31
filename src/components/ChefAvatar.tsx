import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import type { Equipped } from '../game/types';
import { PixelSprite, type Layer } from './PixelSprite';
import { BASE_PALETTE, CHEF, FLAME, PAN, SPARKLE, STEAM } from './sprites';
import { dressFrame, lookPalette } from './wardrobeArt';

export type ChefMode = 'idle' | 'cook' | 'cheer';

interface Props {
  mode?: ChefMode;
  scarf?: string;
  scarfShade?: string;
  /** Screen points per pixel. */
  scale?: number;
  /** Wardrobe items to wear. */
  look?: Equipped;
  /** Freeze on the first frame (for exported images). */
  still?: boolean;
}

const W = 30;
const H = 26;
const TICK_MS = 160;

/**
 * Animated 16-bit chef. Pure frame-based animation (no tweening) for an authentic sprite feel:
 * - idle: gentle 2-frame breathing bob with an occasional blink
 * - cook: tossing a pan over a flickering flame with rising steam
 * - cheer: arms up, hopping, with sparkles
 */
export function ChefAvatar({ mode = 'idle', scarf = '#d94a3d', scarfShade = '#9c2b21', scale = 5, look, still }: Props) {
  // Start past the blink frame so still images (exports) have open eyes.
  const [tick, setTick] = useState(2);

  useEffect(() => {
    if (still) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 960), TICK_MS);
    return () => clearInterval(id);
  }, [still]);

  const palette = useMemo(
    () => ({ ...BASE_PALETTE, ...lookPalette(look), R: scarf, r: scarfShade }),
    [scarf, scarfShade, look],
  );
  const chef = useMemo(
    () => ({
      idle: dressFrame(CHEF.idle, look, false),
      blink: dressFrame(CHEF.blink, look, false),
      cook: dressFrame(CHEF.cook, look, false),
      cookBlink: dressFrame(CHEF.cookBlink, look, false),
      happy: dressFrame(CHEF.happy, look, false),
      cheer: dressFrame(CHEF.cheer, look, true),
    }),
    [look],
  );

  const layers = useMemo<Layer[]>(() => {
    const bx = 3;
    if (mode === 'cook') {
      const toss = Math.floor(tick / 2) % 4 === 3 ? 1 : 0; // quick toss every few beats
      const blink = tick % 24 === 0;
      const flame = tick % 2;
      return [
        { rows: blink ? chef.cookBlink : chef.cook, x: bx, y: 2 + (tick % 4 < 2 ? 0 : 1) },
        { rows: STEAM[Math.floor(tick / 3) % 2], x: bx + 16, y: 7 + (toss ? 0 : 1) },
        { rows: PAN[toss], x: bx + 14, y: 14 - toss },
        { rows: FLAME[flame], x: bx + 14, y: 20 },
      ];
    }
    if (mode === 'cheer') {
      const hop = tick % 4 < 2;
      const s = Math.floor(tick / 2) % 2;
      return [
        { rows: hop ? chef.cheer : chef.happy, x: bx + 4, y: hop ? 0 : 3 },
        { rows: SPARKLE[s], x: 2, y: 4 },
        { rows: SPARKLE[1 - s], x: W - 6, y: 2 },
        { rows: SPARKLE[1 - s], x: 4, y: 16 },
        { rows: SPARKLE[s], x: W - 5, y: 14 },
      ];
    }
    // idle
    const bob = Math.floor(tick / 4) % 2;
    const blink = tick % 28 === 0 || tick % 28 === 1;
    return [{ rows: blink ? chef.blink : chef.idle, x: bx + 4, y: 2 + bob }];
  }, [mode, tick, chef]);

  return (
    <View accessible accessibilityLabel="Your chef avatar" style={{ width: W * scale, height: H * scale }}>
      <PixelSprite layers={layers} width={W} height={H} scale={scale} palette={palette} />
    </View>
  );
}
