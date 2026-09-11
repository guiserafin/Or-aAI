import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontFamily } from '@/theme';

/** Rótulo de seção em caixa alta — o tom "documento" do produto. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
});
