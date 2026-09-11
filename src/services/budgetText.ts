import type { Budget } from '@/types/budget';
import { formatQuantity, formatTotal, hasMissingPrices } from '@/utils/budget';
import { formatCurrency } from '@/utils/currency';
import { addDays, formatDate } from '@/utils/date';

/** Texto do orçamento para colar no WhatsApp. */
export function buildBudgetText(budget: Budget): string {
  const lines: string[] = [];
  const total = formatTotal(budget.items);

  lines.push(`*ORÇAMENTO #${budget.number}*`);
  lines.push(budget.serviceTitle);
  lines.push('');
  lines.push(`Cliente: ${budget.customerName}`);
  lines.push(`Data: ${formatDate(budget.createdAt)}`);
  lines.push('');
  lines.push('*Serviços*');

  budget.items.forEach((item, index) => {
    const quantity = formatQuantity(item);
    const detail = quantity && item.unit !== 'un' ? ` (${quantity})` : '';
    const price = item.price !== undefined ? ` — ${formatCurrency(item.price)}` : '';
    lines.push(`${index + 1}. ${item.description}${detail}${price}`);
  });

  const info = buildInfoLines(budget);
  if (info.length > 0) {
    lines.push('');
    lines.push('*Informações*');
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
