import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';
import { Header } from './Header';

type Props = {
  children: React.ReactNode;
  /** Título da barra de topo. Sem título, a tela não tem cabeçalho (Home, Processando). */
  title?: string;
  /** Sobrescreve o botão de voltar padrão (router.back). */
  onBack?: () => void;
  /** Conteúdo fixo no rodapé (CTAs que não devem rolar). */
  footer?: React.ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Casca padrão das telas: fundo, cabeçalho, safe area, rolagem e teclado
 * tratados num lugar só, para que nenhuma tela precise repetir isso.
 */
export function Screen({ children, title, onBack, footer, scroll = true, contentStyle }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const goBack = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.content, contentStyle]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.content, contentStyle]}>{children}</View>
  );

  return (
    <View style={styles.outer}>
      {title !== undefined ? (
        <Header title={title} onBack={goBack} />
      ) : (
        <View style={{ height: insets.top }} />
      )}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        {body}
        {footer ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
});
