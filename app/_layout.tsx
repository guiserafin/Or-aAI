import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BudgetsProvider } from '@/store/budgets';
import { colors, fontSize } from '@/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <BudgetsProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            headerTintColor: colors.text,
            headerTitleStyle: { fontSize: fontSize.lg, fontWeight: '600' },
            headerBackTitle: 'Voltar',
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="new-budget" options={{ title: 'Novo orçamento' }} />
          <Stack.Screen
            name="processing"
            options={{ headerShown: false, gestureEnabled: false, animation: 'fade' }}
          />
          <Stack.Screen name="budgets" options={{ title: 'Orçamentos' }} />
          <Stack.Screen name="budget/[id]/index" options={{ title: 'Orçamento' }} />
          <Stack.Screen name="budget/[id]/edit" options={{ title: 'Revisar e precificar' }} />
        </Stack>
      </BudgetsProvider>
    </SafeAreaProvider>
  );
}
