import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Budget } from '@/types/budget';
import { buildInfoLines } from '@/services/budgetText';
import { formatQuantity, formatTotal, hasMissingPrices } from '@/utils/budget';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { colors, fontFamily, spacing } from '@/theme';
import { CornerMarks } from './CornerMarks';
import { SectionLabel } from './SectionLabel';

type Props = {
  budget: Budget;
  /** Nome do prestador — mostrado ao lado do cliente quando existe. */
  providerName?: string;
  /** Se informado, o bloco "Prestador" vira tocável para adicionar/editar o nome. */
  onEditProvider?: () => void;
};

/**
 * A tela mais importante do MVP: o orçamento precisa parecer um documento que
 * o prestador tem orgulho de mandar para o cliente. Por isso a folha branca,
 * as réguas finas e o total em destaque — sem cor de marca, só tinta.
 */
export function BudgetDocument({ budget, providerName, onEditProvider }: Props) {
  const total = formatTotal(budget.items);
  const missingPrices = hasMissingPrices(budget.items);
  const allMissing = budget.items.every((item) => item.price === undefined);
  const infoLines = buildInfoLines(budget);

  return (
    <View style={styles.sheet}>
      <CornerMarks color={colors.ink} />

      <SectionLabel>Orçamento</SectionLabel>
      <Text style={styles.title}>{budget.serviceTitle}</Text>
      <Text style={styles.number}>
        Nº {budget.number} · {formatDate(budget.createdAt)}
      </Text>

      <View style={[styles.block, styles.metaRow]}>
        <View style={styles.metaCol}>
          <Text style={styles.blockLabel}>Cliente</Text>
          <Text style={styles.blockValue}>{budget.customerName}</Text>
        </View>
        {onEditProvider ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar nome do prestador"
            onPress={onEditProvider}
            style={styles.metaCol}
          >
            <Text style={styles.blockLabel}>Prestador</Text>
            {providerName ? (
              <Text style={styles.blockValue}>{providerName}</Text>
            ) : (
              <Text style={styles.providerPlaceholder}>Toque para adicionar seu nome</Text>
            )}
          </Pressable>
        ) : providerName ? (
          <View style={styles.metaCol}>
            <Text style={styles.blockLabel}>Prestador</Text>
            <Text style={styles.blockValue}>{providerName}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.block}>
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
      </View>

      {infoLines.length > 0 ? (
        <View style={styles.block}>
          <SectionLabel>Informações</SectionLabel>
          <View style={styles.infoList}>
            {infoLines.map((line) => (
              <Text key={line} style={styles.infoLine}>
                {line}
              </Text>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.totalDivider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>VALOR TOTAL</Text>
        <Text style={[styles.totalValue, allMissing && styles.totalValueMuted]}>{total}</Text>
      </View>

      {missingPrices && !allMissing ? (
        <Text style={styles.totalHint}>Total parcial — há itens sem valor definido.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'relative',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    paddingTop: spacing.xl + 2,
  },
  title: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 31,
    letterSpacing: -0.2,
    color: colors.text,
    marginTop: spacing.xs + 2,
  },
  number: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
    marginTop: spacing.xs,
  },
  block: {
    marginTop: spacing.xl - 2,
    paddingTop: spacing.md + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
  },
  metaCol: {
    flex: 1,
    minWidth: 120,
  },
  providerPlaceholder: {
    fontFamily: fontFamily.regular,
    fontStyle: 'italic',
    fontSize: 15,
    lineHeight: 20,
    color: colors.textMuted,
    marginTop: 4,
  },
  blockLabel: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  blockValue: {
    fontFamily: fontFamily.medium,
    fontSize: 19,
    lineHeight: 24,
    color: colors.text,
    marginTop: 4,
  },
  items: {
    marginTop: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md + 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemIndex: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
    width: 16,
    lineHeight: 21,
  },
  itemBody: {
    flex: 1,
  },
  itemDescription: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.text,
    lineHeight: 21,
  },
  itemQuantity: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  itemPrice: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.text,
    fontVariant: ['tabular-nums'],
    lineHeight: 21,
    textAlign: 'right',
  },
  itemPriceMissing: {
    fontFamily: fontFamily.regular,
    fontStyle: 'italic',
    color: colors.textMuted,
  },
  infoList: {
    marginTop: spacing.md,
    gap: spacing.xs + 1,
  },
  infoLine: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 21,
  },
  totalDivider: {
    height: 2,
    backgroundColor: colors.ink,
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
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 13,
    letterSpacing: 2.2,
    color: colors.text,
  },
  totalValue: {
    flexShrink: 1,
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 34,
    color: colors.text,
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
  totalValueMuted: {
    color: colors.textMuted,
  },
  totalHint: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.warning,
    marginTop: spacing.sm,
    textAlign: 'right',
  },
});
