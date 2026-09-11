import type { Budget } from '@/types/budget';
import { formatQuantity, formatTotal } from '@/utils/budget';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { buildInfoLines } from './budgetText';

/**
 * HTML do orçamento, usado para gerar o PDF.
 *
 * Fica separado de `share.ts` de propósito: não depende do React Native, então
 * pode ser conferido e testado sem subir o app.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** HTML do PDF. Mantido simples de propósito: precisa parecer um documento sério. */
export function buildBudgetHtml(budget: Budget): string {
  const total = formatTotal(budget.items);

  const rows = budget.items
    .map((item, index) => {
      const quantity = formatQuantity(item);
      const detail = quantity && item.unit !== 'un' ? `<span class="qty">${escapeHtml(quantity)}</span>` : '';
      const price = item.price !== undefined ? formatCurrency(item.price) : '—';
      return `<tr>
        <td class="num">${index + 1}</td>
        <td>${escapeHtml(item.description)}${detail}</td>
        <td class="price">${escapeHtml(price)}</td>
      </tr>`;
    })
    .join('');

  const info = buildInfoLines(budget)
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #14181F;
    margin: 0;
    padding: 40px 36px;
    font-size: 13px;
    line-height: 1.5;
  }
  .eyebrow { letter-spacing: 2px; font-size: 11px; color: #5C6673; text-transform: uppercase; }
  h1 { font-size: 24px; margin: 4px 0 2px; }
  .number { font-size: 13px; color: #5C6673; margin-bottom: 28px; }
  .meta { display: flex; gap: 40px; margin-bottom: 24px; }
  .label { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #8A94A1; }
  .value { font-size: 14px; font-weight: 600; }
  h2 { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #5C6673;
       border-top: 1px solid #E1E5EA; padding-top: 14px; margin: 26px 0 10px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 9px 0; border-bottom: 1px solid #EFF1F4; vertical-align: top; }
  td.num { width: 26px; color: #8A94A1; }
  td.price { width: 110px; text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .qty { display: block; color: #5C6673; font-size: 11px; margin-top: 2px; }
  ul { margin: 0; padding-left: 16px; color: #5C6673; }
  .total { margin-top: 26px; border-top: 2px solid #14181F; padding-top: 14px;
           display: flex; justify-content: space-between; align-items: baseline; }
  .total .label { font-size: 12px; letter-spacing: 1.5px; color: #14181F; }
  .total .amount { font-size: 26px; font-weight: 700; color: #0B6E4F; }
  footer { margin-top: 34px; color: #8A94A1; font-size: 10px; text-align: center; }
</style>
</head>
<body>
  <div class="eyebrow">Orçamento</div>
  <h1>${escapeHtml(budget.serviceTitle)}</h1>
  <div class="number">Nº ${escapeHtml(budget.number)} &middot; ${escapeHtml(formatDate(budget.createdAt))}</div>

  <div class="meta">
    <div>
      <div class="label">Cliente</div>
      <div class="value">${escapeHtml(budget.customerName)}</div>
    </div>
  </div>

  <h2>Serviços</h2>
  <table>${rows}</table>

  ${info ? `<h2>Informações</h2><ul>${info}</ul>` : ''}

  <div class="total">
    <span class="label">VALOR TOTAL</span>
    <span class="amount">${escapeHtml(total)}</span>
  </div>

  <footer>Orçamento gerado com OrçaAI</footer>
</body>
</html>`;
}
