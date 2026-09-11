import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  /** Cor da marca — geralmente a mesma da borda/texto do elemento enquadrado. */
  color: string;
};

const SIZE = 11;
const THICK = 1;
const OFFSET = -6;

/**
 * Marcas de registro nos quatro cantos — a assinatura do design system
 * Industry. Usadas só na folha do orçamento, no mini documento da Home e no
 * CTA principal de cada tela: em tudo, viram sujeira visual.
 */
export function CornerMarks({ color }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Corner color={color} style={{ top: OFFSET, left: OFFSET }} />
      <Corner color={color} style={{ top: OFFSET, right: OFFSET }} />
      <Corner color={color} style={{ bottom: OFFSET, left: OFFSET }} />
      <Corner color={color} style={{ bottom: OFFSET, right: OFFSET }} />
    </View>
  );
}

function Corner({ color, style }: { color: string; style: object }) {
  return (
    <View style={[styles.corner, style]}>
      <View style={[styles.vertical, { backgroundColor: color }]} />
      <View style={[styles.horizontal, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  corner: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    opacity: 0.5,
  },
  vertical: {
    position: 'absolute',
    left: (SIZE - THICK) / 2,
    top: 0,
    width: THICK,
    height: SIZE,
  },
  horizontal: {
    position: 'absolute',
    top: (SIZE - THICK) / 2,
    left: 0,
    width: SIZE,
    height: THICK,
  },
});
