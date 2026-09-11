/**
 * Formatação e parsing de valores em BRL.
 * Evitamos Intl.NumberFormat com locale pt-BR porque o suporte varia entre
 * runtimes do React Native (Hermes sem ICU completo em versões antigas).
 */

export function formatCurrency(value: number | undefined): string {
  if (value === undefined || Number.isNaN(value)) return 'R$ —';
  return `R$ ${formatAmount(value)}`;
}

/** Apenas o número, ex.: 3800 -> "3.800,00". */
export function formatAmount(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const negative = safe < 0;
  const [intPart, decimalPart] = Math.abs(safe).toFixed(2).split('.');
  const withSeparators = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negative ? '-' : ''}${withSeparators},${decimalPart}`;
}

/**
 * Converte o que o usuário digitou ("1.250,50", "1250.5", "R$ 300") em número.
 * Retorna `undefined` para entrada vazia — isso é diferente de zero e mantém
 * a semântica de "preço ainda não informado".
 */
export function parseCurrencyInput(input: string): number | undefined {
  const cleaned = input.replace(/[^\d,.-]/g, '').trim();
  if (!cleaned) return undefined;

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  let normalized: string;

  if (lastComma > lastDot) {
    // Formato brasileiro: "1.250,50"
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (lastDot > lastComma) {
    // Formato com ponto decimal: "1250.50" (ou milhar "1,250")
    normalized = cleaned.replace(/,/g, '');
  } else {
    normalized = cleaned;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Texto para o campo de preço: número vira string editável, undefined vira "". */
export function currencyInputValue(value: number | undefined): string {
  if (value === undefined) return '';
  return formatAmount(value);
}
