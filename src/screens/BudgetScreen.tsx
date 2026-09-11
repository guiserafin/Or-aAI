import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { BudgetDocument } from '@/components/BudgetDocument';
import { EmptyState } from '@/components/EmptyState';
import { Notice } from '@/components/Notice';
import { ShareSheet } from '@/components/ShareSheet';
import { ProviderNameModal } from '@/components/ProviderNameModal';
import { Toast } from '@/components/Toast';
import { useBudget, useBudgets } from '@/store/budgets';
import { useProvider } from '@/store/provider';
import { shareBudgetPdf, shareBudgetText } from '@/services/share';
import { buildBudgetText } from '@/services/budgetText';
import { track } from '@/services/analytics';
import { countMissingPrices } from '@/utils/budget';
import { colors, fontFamily, spacing } from '@/theme';

type PendingAction = 'share' | 'pdf' | undefined;

export function BudgetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const budget = useBudget(id);
  const { registerShare, isLoading } = useBudgets();
  const { providerName, setProviderName } = useProvider();

  const [pending, setPending] = useState<PendingAction>();
  const [shareOpen, setShareOpen] = useState(false);
  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [toast, setToast] = useState<string | undefined>();

  if (!budget) {
    return (
      <Screen title="Orçamento">
        <EmptyState
          icon="file-text"
          title={isLoading ? 'Carregando…' : 'Orçamento não encontrado'}
          description={
            isLoading
              ? 'Só um instante.'
              : 'Esse orçamento não está mais salvo neste aparelho.'
          }
          actionLabel={isLoading ? undefined : 'Criar um novo orçamento'}
          onAction={isLoading ? undefined : () => router.replace('/new-budget')}
        />
      </Screen>
    );
  }

  const missing = countMissingPrices(budget.items);
  const openEditor = (from: string) => {
    track('budget_edited', { budgetId: budget.id, from });
    router.push(`/budget/${budget.id}/edit`);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(undefined), 1800);
  };

  const runAction = async (action: Exclude<PendingAction, undefined>) => {
    setPending(action);
    try {
      const result =
        action === 'pdf'
          ? await shareBudgetPdf(budget, providerName)
          : await shareBudgetText(budget, providerName);
      if (result === 'shared') {
        registerShare(budget.id, action);
        setShareOpen(false);
        showToast('Enviado para o cliente');
      }
    } catch (caught) {
      Alert.alert(
        action === 'pdf' ? 'Não consegui gerar o PDF' : 'Não consegui compartilhar',
        caught instanceof Error ? caught.message : 'Tente novamente em instantes.',
      );
    } finally {
      setPending(undefined);
    }
  };

  return (
    <View style={styles.root}>
    <Screen
      title={`Orçamento Nº ${budget.number}`}
      footer={
        <>
          <Button
            label="Compartilhar"
            icon="share"
            corners
            onPress={() => setShareOpen(true)}
          />
          <View style={styles.secondaryRow}>
            <Button
              label="Editar orçamento"
              variant="secondary"
              icon="pencil"
              iconPosition="start"
              onPress={() => openEditor('footer')}
              style={styles.secondaryButton}
            />
            <Button
              label="Gerar PDF"
              variant="secondary"
              icon="file-text"
              iconPosition="start"
              onPress={() => void runAction('pdf')}
              loading={pending === 'pdf'}
              disabled={pending === 'share'}
              style={styles.secondaryButton}
            />
          </View>
        </>
      }
    >
      {missing > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Informar valores dos itens"
          onPress={() => openEditor('pricing_banner')}
        >
          <Notice>
            <Text style={styles.noticeTitle}>
              {missing === 1
                ? 'Falta o valor de 1 item.'
                : `Faltam os valores de ${missing} itens.`}
            </Text>{' '}
            Toque aqui para informar os preços e calcular o total.
          </Notice>
        </Pressable>
      ) : (
        <Notice tone="info">
          Confira os valores antes de enviar ao cliente — o OrçaAI organiza o pedido, quem
          define o preço é você.
        </Notice>
      )}

      <BudgetDocument
        budget={budget}
        providerName={providerName}
        onEditProvider={() => setProviderModalOpen(true)}
      />

      {budget.customerMessage ? (
        <View style={styles.originalMessage}>
          <Text style={styles.originalLabel}>Pedido original do cliente</Text>
          <Text style={styles.originalText}>“{budget.customerMessage}”</Text>
        </View>
      ) : null}
    </Screen>

    <ShareSheet
      visible={shareOpen}
      text={buildBudgetText(budget, providerName)}
      pendingAction={pending}
      onClose={() => setShareOpen(false)}
      onSendText={() => void runAction('share')}
      onSendPdf={() => void runAction('pdf')}
    />

    <ProviderNameModal
      visible={providerModalOpen}
      initialName={providerName}
      onSave={setProviderName}
      onClose={() => setProviderModalOpen(false)}
    />

    {toast ? <Toast message={toast} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
  },
  noticeTitle: {
    fontFamily: fontFamily.semiBold,
    color: colors.warningText,
  },
  originalMessage: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  originalLabel: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  originalText: {
    fontFamily: fontFamily.regular,
    fontStyle: 'italic',
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
