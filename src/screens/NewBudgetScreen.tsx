import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { ChipGroup } from '@/components/ChipGroup';
import { ExampleCard } from '@/components/ExampleCard';
import { SectionLabel } from '@/components/SectionLabel';
import { SERVICE_TYPES } from '@/data/serviceTypes';
import { BUDGET_EXAMPLES, type BudgetExample } from '@/data/examples';
import type { ServiceTypeId } from '@/types/budget';
import { track } from '@/services/analytics';
import { colors, fontSize, spacing } from '@/theme';

/** Mensagens maiores que isso são raras e atrapalham a heurística. */
const MESSAGE_MAX_LENGTH = 1500;

export function NewBudgetScreen() {
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [serviceType, setServiceType] = useState<ServiceTypeId>('pintura');
  const [error, setError] = useState<string | undefined>();

  const applyExample = (example: BudgetExample) => {
    track('example_selected', { exampleId: example.id });
    setCustomerName(example.customerName);
    setCustomerMessage(example.customerMessage);
    setServiceType(example.serviceType);
    setError(undefined);
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
    <Screen footer={<Button label="✨  Gerar orçamento" onPress={submit} />}>
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

      <View style={styles.examples}>
        <SectionLabel>Exemplos</SectionLabel>
        <Text style={styles.examplesHint}>
          Sem uma mensagem à mão? Toque em um exemplo para testar em segundos.
        </Text>
        {BUDGET_EXAMPLES.map((example) => (
          <ExampleCard
            key={example.id}
            example={example}
            onPress={() => applyExample(example)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textMuted,
  },
  examples: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  examplesHint: {
    fontSize: fontSize.sm,
    color: colors.textSubtle,
    lineHeight: 19,
    marginTop: -spacing.xs,
  },
});
