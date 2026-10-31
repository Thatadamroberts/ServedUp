import { View } from 'react-native';
import { levelInfo, nextTitle, titleFor } from '../game/progression';
import type { GameState } from '../game/types';
import { colors } from '../theme';
import { Coins, PixelText, SegmentBar } from './ui';

export function PlayerHud({ state }: { state: GameState }) {
  const info = levelInfo(state.totalXp);
  const title = titleFor(info.level);
  const upcoming = nextTitle(info.level);
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <PixelText size={13} numberOfLines={1}>
            {state.chefName}
          </PixelText>
          <PixelText size={9} color={title.scarf === '#1d1d2b' ? colors.textDim : title.scarf} style={{ marginTop: 4 }}>
            {title.name.toUpperCase()}
          </PixelText>
        </View>
        <Coins amount={state.coins} size={12} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <PixelText size={10} color={colors.gold} style={{ marginRight: 8 }}>
          LV{info.level}
        </PixelText>
        <View style={{ flex: 1 }}>
          <SegmentBar progress={info.progress} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <PixelText size={7} color={colors.textDim}>
          {info.span ? `${info.into}/${info.span} XP` : 'MAX LEVEL'}
        </PixelText>
        {upcoming && (
          <PixelText size={7} color={colors.textDim}>
            {upcoming.name.toUpperCase()} @ LV{upcoming.minLevel}
          </PixelText>
        )}
      </View>
    </View>
  );
}
