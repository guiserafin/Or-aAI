import type { Budget } from '@/types/budget';
import { formatQuantity, formatTotal, hasMissingPrices } from '@/utils/budget';
import { formatCurrency } from '@/utils/currency';
import { addDays, formatDate } from '@/utils/date';

/**
 * Texto do orçamento para colar no WhatsApp — precisa parecer o mesmo
 * documento da folha e do PDF: mesmos rótulos em caixa alta, mesmo total
 * na última linha.
 */
export function buildBudgetText(budget: Budget, providerName?: string): string {
  const lines: string[] = [];
  const total = formatTotal(budget.items);

  lines.push(`*ORÇAMENTO Nº ${budget.number}*`);
  lines.push(`${budget.serviceTitle} · ${formatDate(budget.createdAt)}`);
  lines.push(`Cliente: ${budget.customerName}`);
  if (providerName) lines.push(`Prestador: ${providerName}`);
  lines.push('');

  budget.items.forEach((item, index) => {
    const quantity = formatQuantity(item);
    const detail = quantity && item.unit !== 'un' ? ` (${quantity})` : '';
    const price = item.price === undefined ? 'a definir' : formatCurrency(item.price);
    lines.push(`${index + 1}. ${item.description}${detail} — ${price}`);
  });

  const info = buildInfoLines(budget);
  if (info.length > 0) {
    lines.push('');
    info.forEach((line) => lines.push(line));
  }

  lines.push('');
  lines.push(`*VALOR TOTAL: ${total}*`);

  if (hasMissingPrices(budget.items)) {
    lines.push('');
    lines.push('_Há itens sem valor definido._');
  }

  return lines.join('\n');
}

/** Linhas do bloco "Informações" — compartilhadas entre app, texto e PDF. */
export function buildInfoLines(budget: Budget): string[] {
  const lines: string[] = [];

  if (budget.observations) {
    budget.observations.split('\n').forEach((line) => {
      if (line.trim()) lines.push(line.trim());
    });
  }

  if (budget.estimatedDeadline) {
    lines.push(`Prazo estimado: ${budget.estimatedDeadline}`);
  }

  if (budget.validityDays !== undefined) {
    const until = formatDate(addDays(budget.createdAt, budget.validityDays));
    lines.push(`Validade: ${budget.validityDays} dias${until ? ` (até ${until})` : ''}`);
  }

  return lines;
}
