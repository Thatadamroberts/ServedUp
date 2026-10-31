import { Redirect } from 'expo-router';
import { useGame } from '../game/GameContext';

export default function Index() {
  const { state } = useGame();
  return <Redirect href={state?.activeCuisine ? '/kitchen' : '/onboarding'} />;
}
