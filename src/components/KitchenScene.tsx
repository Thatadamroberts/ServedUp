import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Rect } from 'react-native-svg';
import { colors } from '../theme';

const VW = 64;
const VH = 32;

/** Static 16-bit kitchen backdrop: tiled wall, window, shelf with pots, counter and floor. */
const Backdrop = memo(function Backdrop({ accent }: { accent: string }) {
  const tiles: ReactNode[] = [];
  for (let y = 0; y < 20; y += 4) {
    for (let x = 0; x < VW; x += 4) {
      const alt = ((x + y) / 4) % 2 === 0;
      tiles.push(<Rect key={`t${x}-${y}`} x={x} y={y} width={4} height={4} fill={alt ? '#3f5d78' : '#37526b'} />);
    }
  }
  const floor: ReactNode[] = [];
  for (let x = 0; x < VW; x += 4) {
    floor.push(<Rect key={`f${x}`} x={x} y={28} width={4} height={2} fill={(x / 4) % 2 ? '#5b3a2a' : '#6e4733'} />);
    floor.push(<Rect key={`g${x}`} x={x} y={30} width={4} height={2} fill={(x / 4) % 2 ? '#6e4733' : '#5b3a2a'} />);
  }
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMax slice">
      <G shapeRendering="crispEdges">
        {tiles}
        {/* window */}
        <Rect x={4} y={3} width={12} height={9} fill="#1b1a2e" />
        <Rect x={5} y={4} width={10} height={7} fill="#7ec8f2" />
        <Rect x={5} y={4} width={10} height={2} fill="#a8dcf7" />
        <Rect x={9.5} y={4} width={1} height={7} fill="#1b1a2e" />
        <Rect x={5} y={7} width={10} height={1} fill="#1b1a2e" />
        {/* shelf with pots */}
        <Rect x={44} y={8} width={16} height={1} fill="#2b1d14" />
        <Rect x={45} y={5} width={4} height={3} fill="#c0763b" />
        <Rect x={45} y={5} width={4} height={1} fill="#e0a060" />
        <Rect x={51} y={4} width={3} height={4} fill="#9aa3ad" />
        <Rect x={55} y={6} width={4} height={2} fill={accent} />
        {/* hanging utensils */}
        <Rect x={22} y={0} width={20} height={1} fill="#2b1d14" />
        <Rect x={25} y={1} width={1} height={4} fill="#9aa3ad" />
        <Rect x={24} y={5} width={3} height={2} fill="#9aa3ad" />
        <Rect x={31} y={1} width={1} height={5} fill="#8a5a32" />
        <Rect x={30} y={6} width={3} height={1} fill="#8a5a32" />
        <Rect x={37} y={1} width={1} height={3} fill="#9aa3ad" />
        <Rect x={36} y={4} width={3} height={3} fill="#9aa3ad" />
        {/* counter */}
        <Rect x={0} y={20} width={VW} height={2} fill="#d9d4c4" />
        <Rect x={0} y={22} width={VW} height={1} fill="#9a9584" />
        <Rect x={0} y={23} width={VW} height={5} fill={accent} />
        {[4, 20, 36, 52].map((x) => (
          <Rect key={x} x={x} y={24} width={8} height={3} fill="#00000033" />
        ))}
        {floor}
      </G>
    </Svg>
  );
});

export function KitchenScene({ children, accent = colors.danger, height = 190 }: { children: ReactNode; accent?: string; height?: number }) {
  return (
    <View style={[styles.frame, { height }]}>
      <View style={StyleSheet.absoluteFill}>
        <Backdrop accent={accent} />
      </View>
      <View style={styles.actor}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { borderWidth: 3, borderColor: colors.border, overflow: 'hidden', backgroundColor: '#37526b' },
  actor: { position: 'absolute', left: 0, right: 0, bottom: 4, alignItems: 'center' },
});
