import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <Screen>
        <EmptyState
          title="Página não encontrada"
          description="O endereço que você abriu não existe no OrçaAI."
          actionLabel="Voltar ao início"
          onAction={() => router.replace('/')}
        />
      </Screen>
    </>
  );
}
