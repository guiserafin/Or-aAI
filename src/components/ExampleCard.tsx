import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BudgetExample } from '@/data/examples';
import { getServiceType } from '@/data/serviceTypes';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  example: BudgetExample;
  onPress: () => void;
};

/** Um toque preenche o formulário — é o caminho mais rápido para a demo. */
export function ExampleCard({ example, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Usar exemplo de ${example.customerName}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.customer}>{example.customerName}</Text>
        <Text style={styles.tag}>{getServiceType(example.serviceType).label}</Text>
      </View>
      <Text style={styles.message} numberOfLines={3}>
        “{example.customerMessage}”
      </Text>
      <Text style={styles.action}>Usar este exemplo</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  customer: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  tag: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.textMuted,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md - 2,
    paddingVertical: 3,
    overflow: 'hidden',
  },
  message: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  action: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
});
