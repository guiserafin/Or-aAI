import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { EmptyState } from '@/components/EmptyState';
import { ItemEditorRow } from '@/components/ItemEditorRow';
import { Notice } from '@/components/Notice';
import { SectionLabel } from '@/components/SectionLabel';
import { useBudget, useBudgets } from '@/store/budgets';
import type { Budget, BudgetItem } from '@/types/budget';
import { countMissingPrices, formatTotal } from '@/utils/budget';
import { currencyInputValue, parseCurrencyInput } from '@/utils/currency';
import { createId } from '@/utils/id';
import { colors, fontSize, spacing } from '@/theme';

/**
 * Revisão + precificação (Opção A do MVP).
 *
 * Os campos de preço guardam o texto cru enquanto o usuário digita — converter
 * a cada tecla faria "1," virar "1" e impediria de escrever centavos.
 */
export function EditBudgetScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const budget = useBudget(id);
  const { isLoading } = useBudgets();

  // O formulário só monta com o orçamento em mãos — assim o estado inicial dos
  // campos nunca começa vazio enquanto o AsyncStorage ainda está respondendo.
  if (!budget) {
    return (
      <Screen>
        <EmptyState
          title={isLoading ? 'Carregando…' : 'Orçamento não encontrado'}
          description={
            isLoading ? 'Só um instante.' : 'Esse orçamento não está mais salvo neste aparelho.'
          }
          actionLabel={isLoading ? undefined : 'Voltar ao início'}
          onAction={isLoading ? undefined : () => router.replace('/')}
        />
      </Screen>
    );
  }

  return <BudgetForm key={budget.id} budget={budget} />;
}

function BudgetForm({ budget }: { budget: Budget }) {
  const router = useRouter();
  const { updateBudget } = useBudgets();

  const [customerName, setCustomerName] = useState(budget.customerName);
  const [serviceTitle, setServiceTitle] = useState(budget.serviceTitle);
  const [items, setItems] = useState<BudgetItem[]>(budget.items);
  const [priceTexts, setPriceTexts] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      budget.items.map((item) => [item.id, currencyInputValue(item.price)]),
    ),
  );
  const [observations, setObservations] = useState(budget.observations ?? '');
  const [estimatedDeadline, setEstimatedDeadline] = useState(budget.estimatedDeadline ?? '');
  const [validityText, setValidityText] = useState(String(budget.validityDays ?? 10));

  const pricedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        price: parseCurrencyInput(priceTexts[item.id] ?? ''),
      })),
    [items, priceTexts],
  );

  const total = formatTotal(pricedItems);
  const missing = countMissingPrices(pricedItems);

  const updateDescription = (itemId: string, description: string) => {
    setItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, description } : item)),
    );
  };

  const removeItem = (itemId: string) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
    setPriceTexts((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
  };

  const addItem = () => {
    const item: BudgetItem = { id: createId('item'), description: '' };
    setItems((current) => [...current, item]);
    setPriceTexts((current) => ({ ...current, [item.id]: '' }));
  };

  const save = () => {
    const validityDays = Number(validityText.replace(/\D/g, ''));

    updateBudget(budget.id, {
      customerName: customerName.trim() || 'Cliente',
      serviceTitle: serviceTitle.trim() || 'Prestação de serviço',
      items: pricedItems
        .filter((item) => item.description.trim().length > 0)
        .map((item) => ({ ...item, description: item.description.trim() })),
      observations: observations.trim() || undefined,
      estimatedDeadline: estimatedDeadline.trim() || undefined,
      validityDays: Number.isFinite(validityDays) && validityDays > 0 ? validityDays : 10,
    });

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/budget/${budget.id}`);
    }
  };

  return (
    <Screen
      footer={
        <>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{total}</Text>
          </View>
          <Button label="Salvar orçamento" onPress={save} />
        </>
      }
    >
      {missing > 0 ? (
        <Notice>
          {missing === 1
            ? 'Falta o valor de 1 item.'
            : `Faltam os valores de ${missing} itens.`}{' '}
          Os valores devem ser revisados antes do envio ao cliente.
        </Notice>
      ) : (
        <Notice tone="info">Os valores devem ser revisados antes do envio ao cliente.</Notice>
      )}

      <Field
        label="Nome do cliente"
        value={customerName}
        onChangeText={setCustomerName}
        placeholder="Ex.: João Silva"
        autoCapitalize="words"
        maxLength={80}
      />

      <Field
        label="Título do orçamento"
        value={serviceTitle}
        onChangeText={setServiceTitle}
        placeholder="Ex.: Pintura residencial"
        maxLength={80}
      />

      <View style={styles.itemsSection}>
        <SectionLabel>Serviços e valores</SectionLabel>

        {items.length === 0 ? (
          <Text style={styles.emptyItems}>
            Nenhum serviço na lista. Adicione pelo menos um item.
          </Text>
        ) : (
          items.map((item, index) => (
            <ItemEditorRow
              key={item.id}
              item={item}
              index={index}
              priceText={priceTexts[item.id] ?? ''}
              canRemove={items.length > 1}
              onChangeDescription={(value) => updateDescription(item.id, value)}
              onChangePrice={(value) =>
                setPriceTexts((current) => ({ ...current, [item.id]: value }))
              }
              onRemove={() => removeItem(item.id)}
            />
          ))
        )}

        <Pressable
          accessibilityRole="button"
          onPress={addItem}
          style={({ pressed }) => [styles.addItem, pressed && styles.addItemPressed]}
        >
          <Text style={styles.addItemLabel}>+ Adicionar item</Text>
        </Pressable>
      </View>

      <Field
        label="Observações"
        value={observations}
        onChangeText={setObservations}
        placeholder="Ex.: Área aproximada: 120 m²"
        hint="Uma informação por linha. Aparecem no bloco “Informações” do orçamento."
        multiline
        style={styles.observations}
        maxLength={400}
      />

      <Field
        label="Prazo estimado"
        value={estimatedDeadline}
        onChangeText={setEstimatedDeadline}
        placeholder="Ex.: 5 dias úteis"
        maxLength={40}
      />

      <Field
        label="Validade do orçamento (dias)"
        value={validityText}
        onChangeText={(value) => setValidityText(value.replace(/\D/g, '').slice(0, 3))}
        placeholder="10"
        keyboardType="number-pad"
        inputMode="numeric"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  itemsSection: {
    gap: spacing.md,
  },
  emptyItems: {
    fontSize: fontSize.sm,
    color: colors.textSubtle,
  },
  addItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg - 2,
    borderRadius: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
  },
  addItemPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  addItemLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  observations: {
    minHeight: 96,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  totalLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  totalValue: {
    flexShrink: 1,
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
});
