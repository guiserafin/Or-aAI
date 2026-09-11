import type { BudgetItem, GenerateBudgetInput, GeneratedBudget } from '@/types/budget';
import { getServiceType } from '@/data/serviceTypes';
import { createId } from '@/utils/id';
import {
  DEFAULT_STEM,
  NOTE_PATTERNS,
  NUMBER_WORDS,
  VERB_STEMS,
  VOCAB,
  type VocabEntry,
} from './vocabulary';

/**
 * Mock da IA do OrçaAI.
 *
 * Lê a mensagem do cliente e devolve um orçamento estruturado com os serviços
 * identificados. Propositalmente NÃO estima preços: no MVP quem precifica é o
 * prestador (Opção A). Trocar isto por uma chamada real de LLM não deve exigir
 * nenhuma mudança nas telas — veja `services/ai.ts`.
 */

const ACCENTED = 'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ';
const PLAIN = 'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN';

/** Remove acentos preservando o tamanho da string (os índices precisam bater). */
function deaccent(text: string): string {
  let output = '';
  for (const char of text) {
    const index = ACCENTED.indexOf(char);
    output += index >= 0 ? PLAIN[index] : char;
  }
  return output;
}

function normalize(text: string): string {
  return deaccent(text).toLowerCase();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toNumber(token: string): number | undefined {
  const word = NUMBER_WORDS[token];
  if (word !== undefined) return word;
  const parsed = Number(token.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : undefined;
}

type Match = {
  entry: VocabEntry;
  index: number;
  end: number;
  quantity?: number;
  unit?: string;
  stem: string;
  isPlural: boolean;
  /** "um armário para o quarto" — o quarto é onde, não o quê. */
  isLocation: boolean;
};

const NUMBER_TOKEN = `(?:\\d+(?:[.,]\\d+)?|${Object.keys(NUMBER_WORDS).join('|')})`;
const QUANTITY_BEFORE = new RegExp(`\\b(${NUMBER_TOKEN})\\s+(?:[a-z]+\\s+)?$`);
const MEASURE_AFTER = /^\s*(?:de\s+|com\s+)?(\d+(?:[.,]\d+)?)\s*(m2|m²|metros quadrados|metros|metro|m|cm|centimetros)\b/;
const AREA_PATTERN = /\b(\d+(?:[.,]\d+)?)\s*(m2|m²|metros quadrados|metros|metro|m)\b/g;
/** Preposição de lugar logo antes do ambiente. */
const LOCATION_BEFORE = /\b(?:para|pra|pro|no|na|nos|nas|em|dentro de)\s+(?:o|a|os|as|um|uma|meu|minha|seu|sua)?\s*$/;
/** "suporte de tv", "ponto de luz da sala" — complemento do item anterior. */
const COMPLEMENT_GAP = /^\s*(?:de|da|do|dos|das|para|pra|com)\s*$/;

/** Procura o verbo mais próximo antes do substantivo ("trocar 3 interruptores"). */
function findStem(normalized: string, index: number, fallback: string): string {
  const window = normalized.slice(Math.max(0, index - 80), index);
  let best: { position: number; stem: string } | undefined;

  for (const { forms, stem } of VERB_STEMS) {
    for (const form of forms) {
      const position = window.lastIndexOf(form);
      if (position === -1) continue;
      if (!best || position > best.position) best = { position, stem };
    }
  }

  return best?.stem ?? fallback;
}

function collectMatches(normalized: string, fallbackStem: string): Match[] {
  const matches: Match[] = [];
  const taken: boolean[] = new Array(normalized.length).fill(false);

  const markTaken = (start: number, end: number) => {
    for (let i = Math.max(0, start); i < end; i += 1) taken[i] = true;
  };
  const isTaken = (start: number, end: number) =>
    taken.slice(Math.max(0, start), end).some(Boolean);

  for (const entry of VOCAB) {
    for (const form of entry.forms) {
      const pattern = new RegExp(`\\b${escapeRegex(form)}\\b`, 'g');
      let found: RegExpExecArray | null;

      while ((found = pattern.exec(normalized)) !== null) {
        const start = found.index;
        const end = start + found[0].length;

        // Uma palavra só pode pertencer a um item ("guarda-roupa" não vira "roupa").
        if (isTaken(start, end)) continue;
        markTaken(start, end);

        const before = normalized.slice(0, start);
        const quantityMatch = QUANTITY_BEFORE.exec(before);
        const measureMatch = MEASURE_AFTER.exec(normalized.slice(end));

        let quantity: number | undefined;
        let unit: string | undefined;

        // O número só conta se ainda não foi usado por outro item.
        if (quantityMatch && !isTaken(start - quantityMatch[0].length, start)) {
          quantity = toNumber(quantityMatch[1]);
          unit = entry.unit ?? 'un';
          markTaken(start - quantityMatch[0].length, start);
        }

        if (measureMatch) {
          const measure = toNumber(measureMatch[1]);
          if (measure !== undefined) {
            const rawUnit = measureMatch[2];
            const isArea = rawUnit === 'm2' || rawUnit === 'm²' || rawUnit === 'metros quadrados';
            quantity = measure;
            unit = isArea ? 'm²' : rawUnit.startsWith('c') ? 'cm' : 'm';
            markTaken(end, end + measureMatch[0].length);
          }
        }

        matches.push({
          entry,
          index: start,
          end,
          quantity,
          unit,
          stem: entry.forceStem ?? findStem(normalized, start, fallbackStem),
          isPlural: form.endsWith('s') && entry.many.length > entry.one.length,
          isLocation:
            entry.ambiente === true && quantity === undefined && LOCATION_BEFORE.test(before),
        });
      }
    }
  }

  return matches.sort((a, b) => a.index - b.index);
}

function describe(match: Match): string {
  const { entry, stem, quantity, unit } = match;
  const isMeasure = unit === 'm' || unit === 'cm';

  if (entry.standalone) return entry.standalone;

  // "2 tomadas" precisa do número; "1 tomada" fica mais natural sem ele.
  if (quantity !== undefined && quantity > 1 && !isMeasure) {
    return `${stem} de ${quantity} ${entry.many}`;
  }

  if (match.isPlural && quantity === undefined) return `${stem} de ${entry.many}`;
  if (entry.ambiente) return `${stem} ${entry.gender === 'f' ? 'da' : 'do'} ${entry.one}`;
  return `${stem} de ${entry.one}`;
}

function buildItems(normalized: string, matches: Match[]): BudgetItem[] {
  const services = matches.filter((match) => !match.isLocation);
  const specific = services.filter((match) => !match.entry.generic);
  const usable = specific.length > 0 ? specific : services;

  const byKey = new Map<string, BudgetItem>();
  let previous: { match: Match; item: BudgetItem } | undefined;

  for (const match of usable) {
    // "suporte de tv" vira um item só, em vez de "suporte" + "TV".
    if (previous && COMPLEMENT_GAP.test(normalized.slice(previous.match.end, match.index))) {
      previous.item.description += ` de ${match.entry.one}`;
      continue;
    }

    const key = `${match.entry.key}:${match.stem}`;
    const existing = byKey.get(key);

    // "3 tomadas na sala e mais 2 na cozinha" — soma em vez de duplicar.
    if (existing) {
      if (match.quantity !== undefined) {
        const total = (existing.quantity ?? 1) + match.quantity;
        existing.quantity = total;
        existing.unit = existing.unit ?? match.unit;
        existing.description = describe({ ...match, quantity: total });
      }
      continue;
    }

    const item: BudgetItem = {
      id: createId('item'),
      description: describe(match),
      quantity: match.quantity,
      unit: match.quantity !== undefined ? match.unit : undefined,
    };

    byKey.set(key, item);
    previous = { match, item };
  }

  return Array.from(byKey.values());
}

/** Plano B: quebra a mensagem em pedidos curtos quando nada do vocabulário casa. */
function buildItemsFromClauses(message: string): BudgetItem[] {
  const clauses = message
    .split(/[.;\n]|\se\s|,/)
    .map((clause) =>
      clause
        .trim()
        .replace(/^(?:oi|ola|olá|bom dia|boa tarde|boa noite)[,!\s]*/i, '')
        .replace(/^(?:eu\s+)?(?:preciso|precisava|quero|queria|gostaria|gostava)\s+(?:de\s+)?/i, '')
        .replace(/^(?:um\s+|uma\s+)?(?:or[çc]amento)\s+(?:de\s+|para\s+|pra\s+|pro\s+)?/i, '')
        .replace(/^(?:que\s+voc[êe]\s+)?(?:fa[çc]a|fizesse)\s+/i, '')
        .replace(/[?!.]+$/, '')
        .trim(),
    )
    .filter((clause) => clause.length >= 4 && /[a-zà-ú]/i.test(clause))
    .slice(0, 6);

  return clauses.map((clause) => ({
    id: createId('item'),
    description: clause.charAt(0).toUpperCase() + clause.slice(1),
  }));
}

function findArea(normalized: string, matches: Match[]): number | undefined {
  AREA_PATTERN.lastIndex = 0;
  let found: RegExpExecArray | null;

  while ((found = AREA_PATTERN.exec(normalized)) !== null) {
    const value = toNumber(found[1]);
    if (value === undefined) continue;

    const explicitArea =
      found[2] === 'm2' || found[2] === 'm²' || found[2] === 'metros quadrados';

    // "armário de 2,5 metros" é medida linear, não área — o corte em 15 evita o engano.
    if (!explicitArea && value < 15) continue;

    // Ignora medidas que já pertencem a um item ("armário de 2,5 metros").
    const index = found.index;
    const belongsToItem = matches.some(
      (match) =>
        (match.unit === 'm' || match.unit === 'cm') &&
        index >= match.end &&
        index <= match.end + 8,
    );
    if (belongsToItem) continue;

    return value;
  }

  return undefined;
}

function buildObservations(
  normalized: string,
  area: number | undefined,
  locations: Match[],
): string | undefined {
  const notes: string[] = [];

  if (area !== undefined) {
    const formatted = Number.isInteger(area) ? String(area) : String(area).replace('.', ',');
    notes.push(`Área aproximada: ${formatted} m²`);
  }

  if (locations.length > 0) {
    const names = Array.from(new Set(locations.map((match) => match.entry.one)));
    notes.push(`Ambiente: ${names.join(', ')}`);
  }

  for (const { pattern, note } of NOTE_PATTERNS) {
    if (pattern.test(normalized)) notes.push(note);
  }

  return notes.length > 0 ? notes.join('\n') : undefined;
}

function buildTitle(input: GenerateBudgetInput, itemCount: number): string {
  const serviceType = getServiceType(input.serviceType);
  if (input.serviceType === 'pintura' && itemCount > 2) return 'Pintura residencial';
  return serviceType.defaultTitle;
}

/** Analisa a mensagem e monta o orçamento. Síncrono e testável isoladamente. */
export function parseCustomerMessage(input: GenerateBudgetInput): GeneratedBudget {
  const serviceType = getServiceType(input.serviceType);
  const message = input.customerMessage.trim();
  const normalized = normalize(message);

  const matches = message ? collectMatches(normalized, DEFAULT_STEM[input.serviceType]) : [];
  let items = buildItems(normalized, matches);

  if (items.length === 0) items = buildItemsFromClauses(message);
  if (items.length === 0) {
    items = [{ id: createId('item'), description: serviceType.defaultTitle }];
  }

  const area = findArea(normalized, matches);
  const locations = matches.filter((match) => match.isLocation);

  return {
    customerName: input.customerName.trim() || 'Cliente',
    serviceTitle: buildTitle(input, items.length),
    items,
    observations: buildObservations(normalized, area, locations),
    estimatedDeadline: serviceType.defaultDeadline,
    validityDays: 10,
    // Sem preço: quem precifica é o prestador. Ver README, seção "IA".
    totalPrice: undefined,
  };
}
