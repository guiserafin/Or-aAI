import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { BudgetListItem } from '@/components/BudgetListItem';
import { SectionLabel } from '@/components/SectionLabel';
import { useBudgets } from '@/store/budgets';
import { track } from '@/services/analytics';
import { colors, fontSize, radius, spacing } from '@/theme';

export function HomeScreen() {
  const router = useRouter();
  const { budgets } = useBudgets();
  const recent = budgets.slice(0, 3);

  useEffect(() => {
    track('app_opened');
  }, []);

  const startNewBudget = () => {
    track('new_budget_started', { from: 'home' });
    router.push('/new-budget');
  };

  return (
    <Screen contentStyle={styles.content}>
      <Text style={styles.brand}>OrçaAI</Text>

      <View style={styles.hero}>
        <Text style={styles.title}>Transforme pedidos em orçamentos profissionais.</Text>
        <Text style={styles.subtitle}>
          Cole a mensagem do seu cliente e deixe a IA organizar o orçamento para você.
        </Text>
      </View>

      <Button label="Criar orçamento" onPress={startNewBudget} />

      <DemoPreview />

      {recent.length > 0 ? (
        <View style={styles.recent}>
          <View style={styles.recentHeader}>
            <SectionLabel>Últimos orçamentos</SectionLabel>
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => router.push('/budgets')}
            >
              <Text style={styles.link}>Ver todos</Text>
            </Pressable>
          </View>

          {recent.map((budget) => (
            <BudgetListItem
              key={budget.id}
              budget={budget}
              onPress={() => {
                track('budget_opened', { from: 'home' });
                router.push(`/budget/${budget.id}`);
              }}
            />
          ))}
        </View>
      ) : (
        <Button
          label="Ver meus orçamentos"
          variant="ghost"
          onPress={() => router.push('/budgets')}
        />
      )}
    </Screen>
  );
}

/** Demonstração curta: mensagem crua de um lado, documento organizado do outro. */
function DemoPreview() {
  return (
    <View style={styles.demo}>
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>
          “Preciso pintar 3 quartos e uma sala…”
        </Text>
      </View>

      <Text style={styles.arrow}>↓</Text>

      <View style={styles.miniDoc}>
        <Text style={styles.miniDocLabel}>ORÇAMENTO Nº 0001</Text>
        <Text style={styles.miniDocLine}>1. Pintura de 3 quartos</Text>
        <Text style={styles.miniDocLine}>2. Pintura da sala</Text>
        <View style={styles.miniDocDivider} />
        <Text style={styles.miniDocTotal}>Orçamento profissional em segundos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.xl,
    gap: spacing.xl,
  },
  brand: {
    fontSize: fontSize.md,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: colors.primary,
  },
  hero: {
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textMuted,
    lineHeight: 25,
  },
  demo: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  bubble: {
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderBottomLeftRadius: radius.sm / 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bubbleText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    lineHeight: 21,
  },
  arrow: {
    fontSize: fontSize.lg,
    color: colors.textSubtle,
  },
  miniDoc: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs + 2,
  },
  miniDocLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.textSubtle,
    marginBottom: spacing.xs,
  },
  miniDocLine: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  miniDocDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  miniDocTotal: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  recent: {
    gap: spacing.md,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
});
