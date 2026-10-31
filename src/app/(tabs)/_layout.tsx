import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import { Text } from 'react-native';
import { useGame } from '../../game/GameContext';
import { colors, PIXEL_FONT } from '../../theme';

const icon = (emoji: string) =>
  function TabIcon({ focused }: { focused: boolean }) {
    return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
  };

export default function TabsLayout() {
  const { state } = useGame();
  if (!state?.activeCuisine) return <Redirect href="/onboarding" />;
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bgDeep },
        headerTintColor: colors.gold,
        headerTitleStyle: { fontFamily: PIXEL_FONT, fontSize: 12 },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: colors.bgDeep, borderTopColor: colors.border, borderTopWidth: 3 },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: { fontFamily: PIXEL_FONT, fontSize: 7, marginTop: 2 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="kitchen" options={{ title: 'Kitchen', tabBarIcon: icon('🍳') }} />
      <Tabs.Screen name="recipes" options={{ title: 'Recipes', tabBarIcon: icon('📜') }} />
      <Tabs.Screen name="market" options={{ title: 'Market', tabBarIcon: icon('🛒') }} />
      <Tabs.Screen name="journal" options={{ title: 'Journal', tabBarIcon: icon('📸') }} />
    </Tabs>
  );
}
