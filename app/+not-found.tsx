import React from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { EmptyState } from '@/components/EmptyState';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen title="Página não encontrada" onBack={() => router.replace('/')}>
      <EmptyState
        icon="file-text"
        title="Página não encontrada"
        description="O endereço que você abriu não existe no OrçaAI."
        actionLabel="Voltar ao início"
        onAction={() => router.replace('/')}
      />
    </Screen>
  );
}
