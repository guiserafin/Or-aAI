import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BudgetListItem } from '@/components/BudgetListItem';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { useBudgets } from '@/store/budgets';
import { track } from '@/services/analytics';
import { formatTotal } from '@/utils/budget';
import { colors, fontSize, spacing } from '@/theme';

export function BudgetsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { budgets, isLoading } = useBudgets();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const total = formatTotal(budgets.flatMap((budget) => budget.items));

  return (
    <FlatList
      style={styles.list}
      data={budgets}
      keyExtractor={(budget) => budget.id}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xxl },
        budgets.length === 0 && styles.contentEmpty,
      ]}
      ListHeaderComponent={
        budgets.length > 0 ? (
          <View style={styles.summary}>
            <Text style={styles.summaryCount}>
              {budgets.length} {budgets.length === 1 ? 'orçamento criado' : 'orçamentos criados'}
            </Text>
            <Text style={styles.summaryTotal}>{total} no total</Text>
          </View>
        ) : null
      }
      ListEmptyComponent={
        <EmptyState
          title="Nenhum orçamento ainda"
          description="Cole a mensagem de um cliente e o OrçaAI monta o orçamento para você."
          actionLabel="Criar orçamento"
          onAction={() => {
            track('new_budget_started', { from: 'budgets_empty' });
            router.push('/new-budget');
          }}
        />
      }
      ListFooterComponent={
        budgets.length > 0 ? (
          <Button
            label="Criar novo orçamento"
            variant="secondary"
            style={styles.footerButton}
            onPress={() => {
              track('new_budget_started', { from: 'budgets_list' });
              router.push('/new-budget');
            }}
          />
        ) : null
      }
      renderItem={({ item }) => (
        <BudgetListItem
          budget={item}
          onPress={() => {
            track('budget_opened', { from: 'budgets_list' });
            router.push(`/budget/${item.id}`);
          }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  contentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  summary: {
    paddingBottom: spacing.sm,
    gap: 2,
  },
  summaryCount: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  summaryTotal: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  footerButton: {
    marginTop: spacing.sm,
  },
});
