import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, spacing } from '@/theme';
import { Icon } from './Icon';

/** Confirmação discreta no rodapé — usada depois de compartilhar/salvar. */
export function Toast({ message }: { message: string }) {
  return (
    <View style={styles.toast}>
      <Icon name="check" size={18} color={colors.background} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    backgroundColor: colors.ink,
    borderRadius: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  text: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.background,
  },
});
