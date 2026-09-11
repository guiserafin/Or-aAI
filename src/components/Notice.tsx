import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  children: React.ReactNode;
  tone?: 'warning' | 'info';
};

/** Aviso discreto — usado para "revise os valores antes de enviar". */
export function Notice({ children, tone = 'warning' }: Props) {
  return (
    <View style={[styles.base, tone === 'info' && styles.info]}>
      <Text style={[styles.text, tone === 'info' && styles.infoText]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  info: {
    backgroundColor: colors.primarySoft,
  },
  text: {
    fontSize: fontSize.sm,
    lineHeight: 19,
    color: colors.warning,
  },
  infoText: {
    color: colors.primaryDark,
  },
});
