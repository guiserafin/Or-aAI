import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Budget } from '@/types/budget';
import { countMissingPrices, formatTotal } from '@/utils/budget';
import { formatDate } from '@/utils/date';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  budget: Budget;
  onPress: () => void;
};

export function BudgetListItem({ budget, onPress }: Props) {
  const total = formatTotal(budget.items);
  const missing = countMissingPrices(budget.items);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Orçamento de ${budget.customerName}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.info}>
        <Text style={styles.customer} numberOfLines={1}>
          {budget.customerName}
        </Text>
        <Text style={styles.service} numberOfLines={1}>
          {budget.serviceTitle}
        </Text>
        <Text style={styles.meta}>
          Nº {budget.number} · {formatDate(budget.createdAt)}
        </Text>
      </View>

      <View style={styles.amountBlock}>
        <Text style={styles.amount}>{total}</Text>
        {missing > 0 ? (
          <Text style={styles.pending}>
            {missing} {missing === 1 ? 'item sem valor' : 'itens sem valor'}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  customer: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  service: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  meta: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    marginTop: 2,
  },
  amountBlock: {
    alignItems: 'flex-end',
    maxWidth: '42%',
  },
  amount: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
  pending: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    textAlign: 'right',
    marginTop: 2,
  },
});
