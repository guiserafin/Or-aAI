import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily } from '@/theme';
import { Icon } from './Icon';

type Props = {
  title: string;
  onBack: () => void;
};

/** Barra de topo com voltar — todas as telas menos Home e Processando. */
export function Header({ title, onBack }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        onPress={onBack}
        hitSlop={6}
        style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
      >
        <Icon name="chevron-left" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  backPressed: {
    backgroundColor: 'rgba(29,31,32,0.07)',
  },
  title: {
    flex: 1,
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 19,
    color: colors.text,
  },
});
