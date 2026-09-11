import type { Budget, BudgetItem } from '@/types/budget';
import { formatCurrency } from './currency';

/** Soma dos itens. Itens sem preço contam como 0. */
function calculateTotal(items: BudgetItem[]): number {
  return items.reduce((sum, item) => sum + (item.price ?? 0), 0);
}

/**
 * Total pronto para exibição. Enquanto nenhum item tiver preço mostramos
 * "A definir" — "R$ 0,00" daria a entender que o serviço é de graça.
 */
export function formatTotal(items: BudgetItem[]): string {
  const hasAnyPrice = items.some((item) => item.price !== undefined);
  return hasAnyPrice ? formatCurrency(calculateTotal(items)) : 'A definir';
}

/** `true` quando pelo menos um item ainda está sem preço. */
export function hasMissingPrices(items: BudgetItem[]): boolean {
  return items.some((item) => item.price === undefined);
}

/** Quantos itens ainda precisam de preço. */
export function countMissingPrices(items: BudgetItem[]): number {
  return items.filter((item) => item.price === undefined).length;
}

/** "3 quartos" / "120 m²" — usado ao lado da descrição do item. */
export function formatQuantity(item: BudgetItem): string | undefined {
  if (item.quantity === undefined) return undefined;
  const quantity = Number.isInteger(item.quantity)
    ? String(item.quantity)
    : String(item.quantity).replace('.', ',');
  return item.unit ? `${quantity} ${item.unit}` : quantity;
}

/** Número sequencial exibido no documento, ex.: "0007". */
export function nextBudgetNumber(existing: Budget[]): string {
  const highest = existing.reduce((max, budget) => {
    const parsed = Number(budget.number);
    return Number.isFinite(parsed) && parsed > max ? parsed : max;
  }, 0);
  return String(highest + 1).padStart(4, '0');
}
