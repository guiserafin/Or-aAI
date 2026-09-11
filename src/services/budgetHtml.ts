import type { Budget } from '@/types/budget';
import { formatQuantity, formatTotal } from '@/utils/budget';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { buildInfoLines } from './budgetText';

/**
 * HTML do orçamento, usado para gerar o PDF.
 *
 * Fica separado de `share.ts` de propósito: não depende do React Native, então
 * pode ser conferido e testado sem subir o app. Precisa parecer o mesmo
 * documento da folha do app e do texto de WhatsApp — mesma tipografia,
 * mesmas réguas, mesmas marcas de registro nos cantos.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** HTML do PDF. Mantido simples de propósito: precisa parecer um documento sério. */
export function buildBudgetHtml(budget: Budget, providerName?: string): string {
  const total = formatTotal(budget.items);

  const rows = budget.items
    .map((item, index) => {
      const quantity = formatQuantity(item);
      const detail = quantity && item.unit !== 'un' ? `<span class="qty">${escapeHtml(quantity)}</span>` : '';
      const price = item.price !== undefined ? formatCurrency(item.price) : 'a definir';
      const priceClass = item.price === undefined ? 'price missing' : 'price';
      return `<tr>
        <td class="num">${index + 1}</td>
        <td>${escapeHtml(item.description)}${detail}</td>
        <td class="${priceClass}">${escapeHtml(price)}</td>
      </tr>`;
    })
    .join('');

  const info = buildInfoLines(budget)
    .map((line) => `<li>${escapeHtml(line)}</li>`)
    .join('');

  const providerColumn = providerName
    ? `<div>
        <div class="label">Prestador</div>
        <div class="value">${escapeHtml(providerName)}</div>
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@500;600&display=swap">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Barlow', -apple-system, Helvetica, Arial, sans-serif;
    color: #1D1F20;
    margin: 0;
    padding: 52px 48px;
    font-size: 13px;
    line-height: 1.5;
  }
  .sheet { position: relative; }
  .mark { position: absolute; width: 11px; height: 11px; opacity: .5; }
  .mark::before, .mark::after { content: ''; position: absolute; background: #1D1F20; }
  .mark::before { left: 5px; top: 0; width: 1px; height: 100%; }
  .mark::after { top: 5px; left: 0; height: 1px; width: 100%; }
  .mark.tl { top: -6px; left: -6px; }
  .mark.tr { top: -6px; right: -6px; }
  .mark.bl { bottom: -6px; left: -6px; }
  .mark.br { bottom: -6px; right: -6px; }
  .eyebrow { font-family: 'Barlow Condensed', sans-serif; font-weight: 600; letter-spacing: 2.4px; font-size: 11px; color: #5D5D60; text-transform: uppercase; }
  h1 { font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 30px; margin: 6px 0 2px; letter-spacing: -0.2px; }
  .number { font-size: 13px; color: #5D5D60; margin-bottom: 26px; font-variant-numeric: tabular-nums; }
  .meta { display: flex; gap: 40px; margin-bottom: 4px; padding-top: 16px; border-top: 1px solid #D4D4D7; }
  .label { font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #5D5D60; }
  .value { font-size: 17px; font-weight: 500; margin-top: 3px; }
  h2 { font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5D5D60;
       border-top: 1px solid #D4D4D7; padding-top: 16px; margin: 24px 0 10px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 10px 0; border-bottom: 1px solid #E7E7EA; vertical-align: top; }
  td.num { width: 22px; color: #5D5D60; font-variant-numeric: tabular-nums; }
  td.price { width: 110px; text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; font-weight: 500; }
  td.price.missing { font-style: italic; font-weight: 400; color: #5D5D60; }
  .qty { display: block; color: #5D5D60; font-size: 12px; margin-top: 2px; }
  ul { margin: 0; padding-left: 16px; color: #5D5D60; }
  .total { margin-top: 24px; border-top: 2px solid #1D1F20; padding-top: 14px;
           display: flex; justify-content: space-between; align-items: baseline; }
  .total .label { font-size: 13px; letter-spacing: 2.4px; color: #1D1F20; }
  .total .amount { font-family: 'Barlow Condensed', sans-serif; font-size: 32px; font-weight: 600; color: #1D1F20; font-variant-numeric: tabular-nums; }
  footer { margin-top: 30px; color: #5D5D60; font-size: 11px; }
</style>
</head>
<body>
  <div class="sheet">
    <span class="mark tl"></span><span class="mark tr"></span><span class="mark bl"></span><span class="mark br"></span>

    <div class="eyebrow">Orçamento</div>
    <h1>${escapeHtml(budget.serviceTitle)}</h1>
    <div class="number">Nº ${escapeHtml(budget.number)} &middot; ${escapeHtml(formatDate(budget.createdAt))}</div>

    <div class="meta">
      <div>
        <div class="label">Cliente</div>
        <div class="value">${escapeHtml(budget.customerName)}</div>
      </div>
      ${providerColumn}
    </div>

    <h2>Serviços</h2>
    <table>${rows}</table>

    ${info ? `<h2>Informações</h2><ul>${info}</ul>` : ''}

    <div class="total">
      <span class="label">VALOR TOTAL</span>
      <span class="amount">${escapeHtml(total)}</span>
    </div>

    <footer>Documento gerado pelo OrçaAI · os valores foram definidos pelo prestador do serviço.</footer>
  </div>
</body>
</html>`;
}
