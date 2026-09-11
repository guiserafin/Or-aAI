import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, spacing } from '@/theme';
import { Icon } from './Icon';

type Props = {
  children: React.ReactNode;
  tone?: 'warning' | 'info';
};

/**
 * Aviso discreto, pendurado como uma faixa sob o cabeçalho — usado para
 * "faltam preços" (atenção) e "confira os valores" (informativo).
 */
export function Notice({ children, tone = 'warning' }: Props) {
  const isInfo = tone === 'info';
  return (
    <View style={[styles.base, isInfo && styles.info]}>
      <Icon
        name={isInfo ? 'info' : 'alert-triangle'}
        size={20}
        color={isInfo ? colors.primary : colors.warning}
      />
      <Text style={[styles.text, isInfo && styles.infoText]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
    backgroundColor: colors.warningSoft,
    borderWidth: 1,
    borderColor: colors.warningSoftBorder,
    borderTopWidth: 2,
    borderTopColor: colors.warning,
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: spacing.lg - 2,
    paddingVertical: spacing.md,
  },
  info: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoftBorder,
    borderTopColor: colors.primary,
  },
  text: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 20,
    color: colors.warningText,
  },
  infoText: {
    color: colors.primaryDark,
  },
});
