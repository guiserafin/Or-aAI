import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { BudgetDocument } from '@/components/BudgetDocument';
import { EmptyState } from '@/components/EmptyState';
import { Notice } from '@/components/Notice';
import { useBudget, useBudgets } from '@/store/budgets';
import { shareBudgetPdf, shareBudgetText } from '@/services/share';
import { track } from '@/services/analytics';
import { countMissingPrices } from '@/utils/budget';
import { colors, fontSize, spacing } from '@/theme';

type PendingAction = 'share' | 'pdf' | undefined;

export function BudgetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const budget = useBudget(id);
  const { registerShare, isLoading } = useBudgets();

  const [pending, setPending] = useState<PendingAction>();

  if (!budget) {
    return (
      <Screen>
        <EmptyState
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

  const runAction = async (action: Exclude<PendingAction, undefined>) => {
    setPending(action);
    try {
      const result =
        action === 'pdf' ? await shareBudgetPdf(budget) : await shareBudgetText(budget);
      if (result === 'shared') registerShare(budget.id, action);
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
    <Screen
      footer={
        <>
          <Button
            label="Compartilhar"
            icon="↗"
            onPress={() => void runAction('share')}
            loading={pending === 'share'}
            disabled={pending === 'pdf'}
          />
          <View style={styles.secondaryRow}>
            <Button
              label="Editar orçamento"
              variant="secondary"
              onPress={() => openEditor('footer')}
              style={styles.secondaryButton}
            />
            <Button
              label={Platform.OS === 'web' ? 'Imprimir / PDF' : 'Gerar PDF'}
              variant="secondary"
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
            </Text>
            {'\n'}
            Toque aqui para informar os preços e calcular o total.
          </Notice>
        </Pressable>
      ) : (
        <Notice tone="info">
          Confira os valores antes de enviar ao cliente — o OrçaAI organiza o pedido, quem
          define o preço é você.
        </Notice>
      )}

      <BudgetDocument budget={budget} />

      {budget.customerMessage ? (
        <View style={styles.originalMessage}>
          <Text style={styles.originalLabel}>Pedido original do cliente</Text>
          <Text style={styles.originalText}>“{budget.customerMessage}”</Text>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  secondaryRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
  },
  noticeTitle: {
    fontWeight: '700',
  },
  originalMessage: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  originalLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.textSubtle,
  },
  originalText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
