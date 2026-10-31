import { useGameState } from '../game/GameContext';
import { currentLevel, titleFor } from '../game/progression';

/** The props that dress the avatar as the current player. */
export function useChefLook() {
  const state = useGameState();
  const title = titleFor(currentLevel(state));
  return { scarf: title.scarf, scarfShade: title.scarfShade, look: state.equipped };
}
