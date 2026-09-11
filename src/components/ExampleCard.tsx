import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BudgetExample } from '@/data/examples';
import { getServiceType } from '@/data/serviceTypes';
import { colors, fontFamily, radius, spacing } from '@/theme';

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
        <Text style={styles.head}>
          {example.customerName} · {getServiceType(example.serviceType).label}
        </Text>
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
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  pressed: {
    borderColor: colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  head: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  message: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  action: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
});
