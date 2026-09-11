import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Budget } from '@/types/budget';
import { countMissingPrices, formatTotal } from '@/utils/budget';
import { formatDate } from '@/utils/date';
import { colors, fontFamily, radius, spacing } from '@/theme';

type Props = {
  budget: Budget;
  onPress: () => void;
};

export function BudgetListItem({ budget, onPress }: Props) {
  const total = formatTotal(budget.items);
  const missing = countMissingPrices(budget.items);
  const allMissing = missing === budget.items.length;

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
        <Text style={[styles.amount, allMissing && styles.amountMuted]}>{total}</Text>
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
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  pressed: {
    borderColor: colors.textMuted,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  customer: {
    fontFamily: fontFamily.medium,
    fontSize: 17,
    color: colors.text,
  },
  service: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  meta: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  amountBlock: {
    alignItems: 'flex-end',
    gap: 4,
    maxWidth: '42%',
  },
  amount: {
    fontFamily: fontFamily.semiBold,
    fontSize: 17,
    color: colors.text,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
  amountMuted: {
    color: colors.textMuted,
  },
  pending: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.warning,
    textAlign: 'right',
  },
});
