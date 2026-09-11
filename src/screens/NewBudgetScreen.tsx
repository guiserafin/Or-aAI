import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { ChipGroup } from '@/components/ChipGroup';
import { ExampleCard } from '@/components/ExampleCard';
import { SectionLabel } from '@/components/SectionLabel';
import { Icon } from '@/components/Icon';
import { SERVICE_TYPES } from '@/data/serviceTypes';
import { BUDGET_EXAMPLES, type BudgetExample } from '@/data/examples';
import type { ServiceTypeId } from '@/types/budget';
import { track } from '@/services/analytics';
import { colors, fontFamily, spacing } from '@/theme';

/** Mensagens maiores que isso são raras e atrapalham a heurística. */
const MESSAGE_MAX_LENGTH = 1500;

export function NewBudgetScreen() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [serviceType, setServiceType] = useState<ServiceTypeId>('pintura');
  const [error, setError] = useState<string | undefined>();
  const [showExamples, setShowExamples] = useState(false);

  const applyExample = (example: BudgetExample) => {
    track('example_selected', { exampleId: example.id });
    setCustomerName(example.customerName);
    setCustomerMessage(example.customerMessage);
    setServiceType(example.serviceType);
    setError(undefined);
    setShowExamples(false);
  };

  const submit = () => {
    if (customerMessage.trim().length < 10) {
      setError('Cole a mensagem do cliente para a IA entender o pedido.');
      return;
    }

    setError(undefined);
    track('budget_generation_requested', { serviceType });

    router.push({
      pathname: '/processing',
      params: {
        customerName: customerName.trim(),
        customerMessage: customerMessage.trim(),
        serviceType,
      },
    });
  };

  return (
    <Screen
      title="Novo orçamento"
      footer={<Button label="Gerar orçamento" icon="arrow-right" corners onPress={submit} />}
    >
      <Field
        label="Nome do cliente"
        value={customerName}
        onChangeText={setCustomerName}
        placeholder="Ex.: João Silva"
        autoCapitalize="words"
        returnKeyType="next"
        maxLength={80}
      />

      <Field
        label="Pedido do cliente"
        value={customerMessage}
        onChangeText={(text) => {
          setCustomerMessage(text);
          if (error) setError(undefined);
        }}
        placeholder="Ex.: Preciso pintar minha casa. São 3 quartos, sala e corredor…"
        hint="Pode colar a mensagem do WhatsApp exatamente como o cliente mandou."
        error={error}
        multiline
        maxLength={MESSAGE_MAX_LENGTH}
        textAlignVertical="top"
      />

      <View style={styles.section}>
        <Text style={styles.label}>Tipo de serviço</Text>
        <ChipGroup options={SERVICE_TYPES} value={serviceType} onChange={setServiceType} />
      </View>

      <View style={styles.examplesSection}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: showExamples }}
          onPress={() => setShowExamples((v) => !v)}
          style={styles.examplesToggle}
        >
          <View style={styles.examplesToggleText}>
            <SectionLabel>Exemplos</SectionLabel>
            <Text style={styles.examplesHint}>Sem mensagem à mão? Use uma de teste.</Text>
          </View>
          <View style={[styles.chevron, showExamples && styles.chevronOpen]}>
            <Icon name="chevron-down" size={22} color={colors.primary} />
          </View>
        </Pressable>

        {showExamples ? (
          <View style={styles.examplesList}>
            {BUDGET_EXAMPLES.map((example) => (
              <ExampleCard
                key={example.id}
                example={example}
                onPress={() => applyExample(example)}
              />
            ))}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.textMuted,
  },
  examplesSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md + 2,
  },
  examplesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    minHeight: 48,
  },
  examplesToggleText: {
    flex: 1,
    gap: 2,
  },
  examplesHint: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  examplesList: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});
