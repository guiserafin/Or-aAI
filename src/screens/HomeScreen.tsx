import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { BudgetListItem } from '@/components/BudgetListItem';
import { SectionLabel } from '@/components/SectionLabel';
import { CornerMarks } from '@/components/CornerMarks';
import { Icon } from '@/components/Icon';
import { useBudgets } from '@/store/budgets';
import { track } from '@/services/analytics';
import { colors, fontFamily, spacing } from '@/theme';

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
      <BrandBar />

      <View style={styles.hero}>
        <Text style={styles.title}>Transforme pedidos em orçamentos profissionais.</Text>
        <Text style={styles.subtitle}>
          Cole a mensagem do seu cliente e deixe a IA organizar o orçamento para você.
        </Text>
      </View>

      <Button label="Criar orçamento" icon="arrow-right" corners onPress={startNewBudget} />

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
          style={styles.ghostAlign}
          onPress={() => router.push('/budgets')}
        />
      )}
    </Screen>
  );
}

/** Faixa de marca persistente no topo — só a Home tem isso. */
function BrandBar() {
  return (
    <View style={styles.brandBar}>
      <Text style={styles.brand}>OrçaAI</Text>
      <View style={styles.brandRule} />
      <Text style={styles.brandTag}>Orçamentos de serviço</Text>
    </View>
  );
}

/** Demonstração curta: mensagem crua de um lado, documento organizado do outro. */
function DemoPreview() {
  return (
    <View style={styles.demo}>
      <View style={styles.demoCaption}>
        <SectionLabel>Como o cliente manda</SectionLabel>
        <View style={styles.demoRule} />
      </View>
      <View style={styles.bubble}>
        <Text style={styles.bubbleText}>“Preciso pintar 3 quartos e uma sala…”</Text>
      </View>

      <View style={styles.demoArrow}>
        <Icon name="arrow-down" size={22} color={colors.textMuted} />
      </View>

      <View style={styles.demoCaption}>
        <SectionLabel>Como o cliente recebe</SectionLabel>
        <View style={styles.demoRule} />
      </View>
      <View style={styles.miniDoc}>
        <CornerMarks color={colors.text} />
        <Text style={styles.miniDocLabel}>ORÇAMENTO Nº 0001</Text>
        <View style={styles.miniDocRow}>
          <Text style={styles.miniDocLine}>1. Pintura de 3 quartos</Text>
          <Text style={styles.miniDocPrice}>R$ 1.500,00</Text>
        </View>
        <View style={[styles.miniDocRow, styles.miniDocRowLast]}>
          <Text style={styles.miniDocLine}>2. Pintura da sala</Text>
          <Text style={styles.miniDocPrice}>R$ 900,00</Text>
        </View>
        <Text style={styles.miniDocTotal}>Orçamento profissional em segundos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
    gap: spacing.xl,
  },
  brandBar: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  brand: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 22,
    color: colors.text,
  },
  brandRule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  brandTag: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  hero: {
    gap: spacing.md,
  },
  title: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 36,
    lineHeight: 37,
    letterSpacing: -0.5,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    color: colors.textMuted,
    lineHeight: 25,
    maxWidth: 320,
  },
  demo: {
    gap: spacing.sm,
  },
  demoCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  demoRule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  demoArrow: {
    alignItems: 'center',
    paddingVertical: 2,
  },
  bubble: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bubbleText: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 21,
  },
  miniDoc: {
    position: 'relative',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md + 2,
  },
  miniDocLabel: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  miniDocRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.sm + 2,
    paddingBottom: spacing.sm - 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  miniDocRowLast: {
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    paddingBottom: spacing.sm,
  },
  miniDocLine: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.text,
  },
  miniDocPrice: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  miniDocTotal: {
    fontFamily: fontFamily.condensedSemiBold,
    fontSize: 13,
    color: colors.primary,
    marginTop: spacing.sm,
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
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
  ghostAlign: {
    alignSelf: 'flex-start',
  },
});
