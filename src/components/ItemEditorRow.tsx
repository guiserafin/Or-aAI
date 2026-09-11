import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { BudgetItem } from '@/types/budget';
import { colors, fontFamily, radius, spacing } from '@/theme';
import { Icon } from './Icon';

type Props = {
  item: BudgetItem;
  index: number;
  priceText: string;
  onChangeDescription: (value: string) => void;
  onChangePrice: (value: string) => void;
  onRemove: () => void;
  /** Desabilita a remoção quando só resta um item. */
  canRemove: boolean;
};

/**
 * Linha de revisão: o prestador confere o que a IA entendeu e informa o preço.
 * É aqui que o orçamento deixa de ser "texto do WhatsApp" e vira documento.
 */
export function ItemEditorRow({
  item,
  index,
  priceText,
  onChangeDescription,
  onChangePrice,
  onRemove,
  canRemove,
}: Props) {
  const hasPrice = priceText.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.index}>Item {index + 1}</Text>
        {canRemove ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remover item ${index + 1}`}
            hitSlop={10}
            onPress={onRemove}
            style={styles.removeButton}
          >
            <Icon name="x" size={16} color={colors.danger} />
            <Text style={styles.remove}>Remover</Text>
          </Pressable>
        ) : null}
      </View>

      <TextInput
        value={item.description}
        onChangeText={onChangeDescription}
        placeholder="Descrição do serviço"
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={`Descrição do item ${index + 1}`}
        multiline
        style={styles.description}
      />

      <View style={styles.priceField}>
        <Text style={styles.priceLabel}>Valor</Text>
        <View style={[styles.priceRow, hasPrice && styles.priceRowFilled]}>
          <View style={styles.currencyBox}>
            <Text style={styles.currency}>R$</Text>
          </View>
          <TextInput
            value={priceText}
            onChangeText={onChangePrice}
            placeholder="0,00"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel={`Valor do item ${index + 1}`}
            keyboardType="decimal-pad"
            inputMode="decimal"
            returnKeyType="done"
            style={styles.price}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  index: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 36,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  remove: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.danger,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.text,
    lineHeight: 21,
    padding: 0,
    minHeight: 22,
  },
  priceField: {
    gap: 5,
  },
  priceLabel: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  priceRowFilled: {
    borderColor: colors.primary,
  },
  currencyBox: {
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  currency: {
    fontFamily: fontFamily.medium,
    fontSize: 17,
    color: colors.textMuted,
  },
  price: {
    flex: 1,
    minHeight: 56,
    fontFamily: fontFamily.medium,
    fontSize: 22,
    fontVariant: ['tabular-nums'],
    color: colors.text,
    paddingHorizontal: spacing.lg - 2,
  },
});
