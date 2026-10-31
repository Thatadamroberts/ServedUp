import { memo, useMemo } from 'react';
import Svg, { G, Rect } from 'react-native-svg';
import type { Palette } from './sprites';

export interface Layer {
  rows: string[];
  x: number;
  y: number;
}

interface Props {
  layers: Layer[];
  /** Canvas size in sprite pixels. */
  width: number;
  height: number;
  /** Screen points per sprite pixel. */
  scale: number;
  palette: Palette;
}

/** Renders pixel-art layers as crisp SVG rects, merging horizontal runs of the same colour. */
function PixelSpriteImpl({ layers, width, height, scale, palette }: Props) {
  const rects = useMemo(() => {
    const out: { x: number; y: number; w: number; fill: string }[] = [];
    for (const layer of layers) {
      layer.rows.forEach((row, ry) => {
        let x = 0;
        while (x < row.length) {
          const ch = row[x];
          if (ch === '.' || !palette[ch]) {
            x++;
            continue;
          }
          let end = x + 1;
          while (end < row.length && row[end] === ch) end++;
          out.push({ x: layer.x + x, y: layer.y + ry, w: end - x, fill: palette[ch] });
          x = end;
        }
      });
    }
    return out;
  }, [layers, palette]);

  return (
    <Svg width={width * scale} height={height * scale} viewBox={`0 0 ${width} ${height}`}>
      <G shapeRendering="crispEdges">
        {rects.map((r, i) => (
          // Tiny overlap (0.02) hides sub-pixel seams between runs on some renderers.
          <Rect key={i} x={r.x} y={r.y} width={r.w + 0.02} height={1.02} fill={r.fill} />
        ))}
      </G>
    </Svg>
  );
}

export const PixelSprite = memo(PixelSpriteImpl);
