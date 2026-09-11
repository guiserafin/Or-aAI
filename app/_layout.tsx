import React, { useCallback, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { BudgetsProvider } from '@/store/budgets';
import { ProviderProvider } from '@/store/provider';
import { colors, fontsToLoad } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontsToLoad);

  const onLayout = useCallback(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  useEffect(() => {
    onLayout();
  }, [onLayout]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <BudgetsProvider>
        <ProviderProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="new-budget" />
            <Stack.Screen name="processing" options={{ gestureEnabled: false, animation: 'fade' }} />
            <Stack.Screen name="budgets" />
            <Stack.Screen name="budget/[id]/index" />
            <Stack.Screen name="budget/[id]/edit" />
          </Stack>
        </ProviderProvider>
      </BudgetsProvider>
    </SafeAreaProvider>
  );
}
