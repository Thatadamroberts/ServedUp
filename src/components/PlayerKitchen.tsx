import { CUISINE_BY_ID } from '../game/data';
import { useGameState } from '../game/GameContext';
import type { CookAction } from '../game/cookActions';
import type { CuisineId, Equipped } from '../game/types';
import { ChefAvatar, type ChefMode } from './ChefAvatar';
import { KitchenScene } from './KitchenScene';
import { useChefLook } from './useChefLook';

/** The player's own kitchen and chef, dressed in whatever they've equipped. */
export function PlayerKitchen({
  mode = 'idle',
  action,
  height,
  cuisine,
  lookOverride,
  still,
}: {
  mode?: ChefMode;
  action?: CookAction;
  height?: number;
  cuisine?: CuisineId;
  lookOverride?: Equipped;
  still?: boolean;
}) {
  const state = useGameState();
  const { scarf, scarfShade, look } = useChefLook();
  const eq = lookOverride ?? look;
  const accent = CUISINE_BY_ID[cuisine ?? state.activeCuisine ?? 'italian'].color;
  return (
    <KitchenScene
      accent={accent}
      height={height}
      wall={eq.wall}
      decor={eq.decor}
      trophyCount={Object.keys(state.achievements).length}
    >
      <ChefAvatar mode={mode} action={action} scarf={scarf} scarfShade={scarfShade} look={eq} scale={5} still={still} />
    </KitchenScene>
  );
}
