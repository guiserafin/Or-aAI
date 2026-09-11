import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Budget } from '@/types/budget';
import { buildInfoLines } from '@/services/budgetText';
import { formatQuantity, formatTotal, hasMissingPrices } from '@/utils/budget';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { colors, fontSize, radius, spacing, shadow } from '@/theme';
import { SectionLabel } from './SectionLabel';

/**
 * A tela mais importante do MVP: o orçamento precisa parecer um documento que
 * o prestador tem orgulho de mandar para o cliente. Por isso a "folha branca",
 * as réguas finas e o total em destaque.
 */
export function BudgetDocument({ budget }: { budget: Budget }) {
  const total = formatTotal(budget.items);
  const missingPrices = hasMissingPrices(budget.items);
  const infoLines = buildInfoLines(budget);

  return (
    <View style={styles.sheet}>
      <SectionLabel>Orçamento</SectionLabel>
      <Text style={styles.title}>{budget.serviceTitle}</Text>
      <Text style={styles.number}>
        Nº {budget.number} · {formatDate(budget.createdAt)}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaBlock}>
          <Text style={styles.metaLabel}>Cliente</Text>
          <Text style={styles.metaValue}>{budget.customerName}</Text>
        </View>
      </View>

      <View style={styles.divider} />
      <SectionLabel>Serviços</SectionLabel>

      <View style={styles.items}>
        {budget.items.map((item, index) => {
          const quantity = formatQuantity(item);
          const showQuantity = quantity && item.unit !== 'un';
          const isLast = index === budget.items.length - 1;

          return (
            <View key={item.id} style={[styles.item, isLast && styles.itemLast]}>
              <Text style={styles.itemIndex}>{index + 1}</Text>
              <View style={styles.itemBody}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                {showQuantity ? <Text style={styles.itemQuantity}>{quantity}</Text> : null}
              </View>
              <Text style={[styles.itemPrice, item.price === undefined && styles.itemPriceMissing]}>
                {item.price === undefined ? 'a definir' : formatCurrency(item.price)}
              </Text>
            </View>
          );
        })}
      </View>

      {infoLines.length > 0 ? (
        <>
          <View style={styles.divider} />
          <SectionLabel>Informações</SectionLabel>
          <View style={styles.infoList}>
            {infoLines.map((line) => (
              <Text key={line} style={styles.infoLine}>
                {line}
              </Text>
            ))}
          </View>
        </>
      ) : null}

      <View style={styles.totalDivider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>VALOR TOTAL</Text>
        <Text style={styles.totalValue}>{total}</Text>
      </View>

      {missingPrices ? (
        <Text style={styles.totalHint}>Total parcial — há itens sem valor definido.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    ...shadow.card,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.xs,
    lineHeight: 32,
  },
  number: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  metaBlock: {
    minWidth: 120,
  },
  metaLabel: {
    fontSize: fontSize.xs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textSubtle,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },
  items: {
    marginTop: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemIndex: {
    fontSize: fontSize.sm,
    color: colors.textSubtle,
    width: 16,
    lineHeight: 21,
  },
  itemBody: {
    flex: 1,
  },
  itemDescription: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 21,
  },
  itemQuantity: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 21,
  },
  itemPriceMissing: {
    fontWeight: '400',
    color: colors.textSubtle,
    fontStyle: 'italic',
  },
  infoList: {
    marginTop: spacing.md,
    gap: spacing.sm - 2,
  },
  infoLine: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    lineHeight: 21,
  },
  totalDivider: {
    height: 2,
    backgroundColor: colors.text,
    marginTop: spacing.xl,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  totalLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.text,
  },
  totalValue: {
    flexShrink: 1,
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
  totalHint: {
    fontSize: fontSize.xs,
    color: colors.textSubtle,
    marginTop: spacing.sm,
    textAlign: 'right',
  },
});
