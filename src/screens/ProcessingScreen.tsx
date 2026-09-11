import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { ProcessingChecklist } from '@/components/ProcessingChecklist';
import { generateBudget } from '@/services/ai';
import { track } from '@/services/analytics';
import { isServiceTypeId } from '@/data/serviceTypes';
import { useBudgets } from '@/store/budgets';
import { colors, fontSize, spacing } from '@/theme';

const STEPS = ['Identificando serviços', 'Organizando informações', 'Montando orçamento'];
const STEP_INTERVAL_MS = 520;

/** Uma tela de loading vazia mata a percepção de valor — aqui mostramos o trabalho. */
export function ProcessingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    customerName?: string;
    customerMessage?: string;
    serviceType?: string;
  }>();
  const { createBudget } = useBudgets();

  const [completed, setCompleted] = useState(0);
  const [error, setError] = useState<string | undefined>();

  /** StrictMode/remontagens não podem gerar dois orçamentos. */
  const started = useRef(false);

  const customerMessage = params.customerMessage ?? '';
  const customerName = params.customerName ?? '';
  const serviceType = isServiceTypeId(params.serviceType) ? params.serviceType : 'outro';

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!customerMessage.trim()) {
      router.replace('/new-budget');
      return;
    }

    let active = true;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEPS.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          if (active) setCompleted(index + 1);
        }, STEP_INTERVAL_MS * (index + 1)),
      );
    });

    const minimumDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, STEP_INTERVAL_MS * STEPS.length),
    );

    Promise.all([
      generateBudget({ customerName, customerMessage, serviceType }),
      minimumDelay,
    ])
      .then(([generated]) => {
        if (!active) return;
        const budget = createBudget({ generated, serviceType, customerMessage });
        router.replace(`/budget/${budget.id}`);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        track('budget_generation_failed', { serviceType });
        setError(
          caught instanceof Error
            ? caught.message
            : 'Não consegui gerar o orçamento. Tente novamente.',
        );
      });

    return () => {
      active = false;
      timers.forEach(clearTimeout);
    };
  }, [createBudget, customerMessage, customerName, router, serviceType]);

  if (error) {
    return (
      <Screen
        scroll={false}
        contentStyle={styles.center}
        footer={
          <>
            <Button label="Tentar novamente" onPress={() => router.replace('/new-budget')} />
            <Button label="Voltar ao início" variant="ghost" onPress={() => router.replace('/')} />
          </>
        }
      >
        <Text style={styles.title}>Não deu certo dessa vez</Text>
        <Text style={styles.subtitle}>{error}</Text>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} contentStyle={styles.center}>
      <Text style={styles.title}>Analisando o pedido…</Text>
      <Text style={styles.subtitle}>
        Estou lendo a mensagem de {customerName.trim() || 'seu cliente'} e separando os serviços.
      </Text>

      <View style={styles.checklist}>
        <ProcessingChecklist steps={STEPS} completed={completed} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    lineHeight: 22,
  },
  checklist: {
    marginTop: spacing.xl,
  },
});
