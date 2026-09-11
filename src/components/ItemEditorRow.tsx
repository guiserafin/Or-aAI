import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { BudgetItem } from '@/types/budget';
import { colors, fontSize, radius, spacing } from '@/theme';

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
          >
            <Text style={styles.remove}>Remover</Text>
          </Pressable>
        ) : null}
      </View>

      <TextInput
        value={item.description}
        onChangeText={onChangeDescription}
        placeholder="Descrição do serviço"
        placeholderTextColor={colors.textSubtle}
        accessibilityLabel={`Descrição do item ${index + 1}`}
        multiline
        style={styles.description}
      />

      <View style={styles.priceRow}>
        <Text style={styles.currency}>R$</Text>
        <TextInput
          value={priceText}
          onChangeText={onChangePrice}
          placeholder="0,00"
          placeholderTextColor={colors.textSubtle}
          accessibilityLabel={`Valor do item ${index + 1}`}
          keyboardType="decimal-pad"
          inputMode="decimal"
          returnKeyType="done"
          style={styles.price}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
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
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textSubtle,
  },
  remove: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.danger,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 21,
    padding: 0,
    minHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  currency: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.textMuted,
  },
  price: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    paddingVertical: spacing.md,
  },
});
