import type { ServiceTypeId } from '@/types/budget';

/**
 * Vocabulário usado pelo mock da IA para entender mensagens de WhatsApp em
 * português. Não é NLP de verdade — é uma heurística boa o suficiente para
 * validar o produto com prestadores reais.
 */

export type VocabEntry = {
  key: string;
  /** Formas aceitas na mensagem, do mais longo para o mais curto. */
  forms: string[];
  /** Rótulo no singular, já acentuado. */
  one: string;
  /** Rótulo no plural, já acentuado. */
  many: string;
  /** Gênero — usado para montar "da sala" / "do corredor". */
  gender: 'f' | 'm';
  /** Ambientes únicos viram "Pintura da sala" em vez de "Pintura de sala". */
  ambiente?: boolean;
  /** Itens genéricos ("a casa", "um móvel") somem quando algo específico aparece. */
  generic?: boolean;
  /** Descrição fixa, ignorando o verbo detectado (usado em marcenaria). */
  standalone?: string;
  /** Força um verbo, independente do que foi escrito. */
  forceStem?: string;
  /** Unidade padrão quando há quantidade explícita. */
  unit?: string;
};

export const VOCAB: VocabEntry[] = [
  // Ambientes
  { key: 'quarto', forms: ['quartos', 'quarto', 'dormitorios', 'dormitorio'], one: 'quarto', many: 'quartos', gender: 'm', ambiente: true },
  { key: 'sala', forms: ['salas', 'sala de estar', 'sala'], one: 'sala', many: 'salas', gender: 'f', ambiente: true },
  { key: 'cozinha', forms: ['cozinhas', 'cozinha'], one: 'cozinha', many: 'cozinhas', gender: 'f', ambiente: true },
  { key: 'banheiro', forms: ['banheiros', 'banheiro', 'lavabos', 'lavabo'], one: 'banheiro', many: 'banheiros', gender: 'm', ambiente: true },
  { key: 'corredor', forms: ['corredores', 'corredor'], one: 'corredor', many: 'corredores', gender: 'm', ambiente: true },
  { key: 'varanda', forms: ['varandas', 'varanda', 'sacadas', 'sacada'], one: 'varanda', many: 'varandas', gender: 'f', ambiente: true },
  { key: 'area-servico', forms: ['area de servico', 'lavanderias', 'lavanderia'], one: 'área de serviço', many: 'áreas de serviço', gender: 'f', ambiente: true },
  { key: 'escritorio', forms: ['escritorios', 'escritorio', 'home office'], one: 'escritório', many: 'escritórios', gender: 'm', ambiente: true },
  { key: 'garagem', forms: ['garagens', 'garagem'], one: 'garagem', many: 'garagens', gender: 'f', ambiente: true },
  { key: 'fachada', forms: ['fachadas', 'fachada'], one: 'fachada', many: 'fachadas', gender: 'f', ambiente: true },
  { key: 'teto', forms: ['tetos', 'teto', 'forros', 'forro'], one: 'teto', many: 'tetos', gender: 'm', ambiente: true },
  { key: 'parede', forms: ['paredes', 'parede'], one: 'parede', many: 'paredes', gender: 'f' },
  { key: 'muro', forms: ['muros', 'muro'], one: 'muro', many: 'muros', gender: 'm', ambiente: true },
  { key: 'casa', forms: ['apartamentos', 'apartamento', 'casas', 'casa', 'imoveis', 'imovel'], one: 'imóvel', many: 'imóveis', gender: 'm', ambiente: true, generic: true },

  // Esquadrias e superfícies
  { key: 'porta', forms: ['portas', 'porta'], one: 'porta', many: 'portas', gender: 'f', unit: 'un' },
  { key: 'janela', forms: ['janelas', 'janela'], one: 'janela', many: 'janelas', gender: 'f', unit: 'un' },
  { key: 'portao', forms: ['portoes', 'portao'], one: 'portão', many: 'portões', gender: 'm', unit: 'un' },
  { key: 'rodape', forms: ['rodapes', 'rodape'], one: 'rodapé', many: 'rodapés', gender: 'm' },
  { key: 'grade', forms: ['grades', 'grade'], one: 'grade', many: 'grades', gender: 'f', unit: 'un' },

  // Elétrica
  { key: 'tomada', forms: ['tomadas', 'tomada'], one: 'tomada', many: 'tomadas', gender: 'f', unit: 'un' },
  { key: 'interruptor', forms: ['interruptores', 'interruptor'], one: 'interruptor', many: 'interruptores', gender: 'm', unit: 'un' },
  { key: 'luminaria', forms: ['luminarias', 'luminaria', 'lustres', 'lustre'], one: 'luminária', many: 'luminárias', gender: 'f', unit: 'un' },
  { key: 'lampada', forms: ['lampadas', 'lampada'], one: 'lâmpada', many: 'lâmpadas', gender: 'f', unit: 'un' },
  { key: 'ponto-luz', forms: ['pontos de luz', 'ponto de luz'], one: 'ponto de luz', many: 'pontos de luz', gender: 'm', unit: 'un' },
  { key: 'disjuntor', forms: ['disjuntores', 'disjuntor'], one: 'disjuntor', many: 'disjuntores', gender: 'm', unit: 'un' },
  { key: 'quadro', forms: ['quadros de energia', 'quadro de energia', 'quadros de luz', 'quadro de luz'], one: 'quadro de energia', many: 'quadros de energia', gender: 'm', unit: 'un' },
  { key: 'chuveiro', forms: ['chuveiros', 'chuveiro'], one: 'chuveiro', many: 'chuveiros', gender: 'm', unit: 'un' },
  { key: 'ventilador', forms: ['ventiladores de teto', 'ventilador de teto', 'ventiladores', 'ventilador'], one: 'ventilador de teto', many: 'ventiladores de teto', gender: 'm', unit: 'un' },

  // Marcenaria
  { key: 'armario', forms: ['armarios', 'armario', 'guarda-roupas', 'guarda roupas', 'guarda-roupa', 'guarda roupa'], one: 'armário', many: 'armários', gender: 'm', standalone: 'Armário planejado', unit: 'un' },
  { key: 'bancada', forms: ['bancadas', 'bancada'], one: 'bancada', many: 'bancadas', gender: 'f', standalone: 'Bancada planejada', unit: 'un' },
  { key: 'prateleira', forms: ['prateleiras', 'prateleira'], one: 'prateleira', many: 'prateleiras', gender: 'f', standalone: 'Prateleira sob medida', unit: 'un' },
  { key: 'estante', forms: ['estantes', 'estante'], one: 'estante', many: 'estantes', gender: 'f', standalone: 'Estante planejada', unit: 'un' },
  { key: 'painel', forms: ['paineis', 'painel'], one: 'painel', many: 'painéis', gender: 'm', standalone: 'Painel sob medida', unit: 'un' },
  { key: 'closet', forms: ['closets', 'closet'], one: 'closet', many: 'closets', gender: 'm', standalone: 'Closet planejado', unit: 'un' },
  { key: 'movel', forms: ['moveis planejados', 'movel planejado', 'moveis', 'movel'], one: 'móvel planejado', many: 'móveis planejados', gender: 'm', standalone: 'Móvel planejado sob medida', generic: true, unit: 'un' },

  // Hidráulica / manutenção
  { key: 'torneira', forms: ['torneiras', 'torneira'], one: 'torneira', many: 'torneiras', gender: 'f', unit: 'un' },
  { key: 'pia', forms: ['pias', 'pia'], one: 'pia', many: 'pias', gender: 'f', unit: 'un' },
  { key: 'vaso', forms: ['vasos sanitarios', 'vaso sanitario', 'privadas', 'privada'], one: 'vaso sanitário', many: 'vasos sanitários', gender: 'm', unit: 'un' },
  { key: 'registro', forms: ['registros', 'registro'], one: 'registro', many: 'registros', gender: 'm', unit: 'un' },
  { key: 'caixa-agua', forms: ["caixas d'agua", "caixa d'agua", 'caixas de agua', 'caixa de agua'], one: "caixa d'água", many: "caixas d'água", gender: 'f', unit: 'un' },
  { key: 'vazamento', forms: ['vazamentos', 'vazamento', 'infiltracoes', 'infiltracao'], one: 'vazamento', many: 'vazamentos', gender: 'm', forceStem: 'Reparo', unit: 'un' },
  { key: 'telhado', forms: ['telhados', 'telhado'], one: 'telhado', many: 'telhados', gender: 'm', ambiente: true },
  { key: 'piso', forms: ['pisos', 'piso'], one: 'piso', many: 'pisos', gender: 'm', ambiente: true },

  // Instalação / linha branca
  { key: 'ar-condicionado', forms: ['ares condicionados', 'ar condicionado', 'splits', 'split'], one: 'ar-condicionado', many: 'aparelhos de ar-condicionado', gender: 'm', unit: 'un' },
  { key: 'tv', forms: ['televisoes', 'televisao', 'tvs', 'tv'], one: 'TV', many: 'TVs', gender: 'f', unit: 'un' },
  { key: 'suporte', forms: ['suportes', 'suporte'], one: 'suporte', many: 'suportes', gender: 'm', unit: 'un' },
  { key: 'cortina', forms: ['cortinas', 'cortina', 'persianas', 'persiana'], one: 'cortina', many: 'cortinas', gender: 'f', unit: 'un' },
  { key: 'fechadura', forms: ['fechaduras', 'fechadura'], one: 'fechadura', many: 'fechaduras', gender: 'f', unit: 'un' },

  // Limpeza
  { key: 'pos-obra', forms: ['limpeza pos obra', 'pos-obra', 'pos obra'], one: 'limpeza pós-obra', many: 'limpezas pós-obra', gender: 'f', standalone: 'Limpeza pós-obra' },
  { key: 'vidro', forms: ['vidros', 'vidro'], one: 'vidro', many: 'vidros', gender: 'm', unit: 'un' },
  { key: 'sofa', forms: ['sofas', 'sofa'], one: 'sofá', many: 'sofás', gender: 'm', unit: 'un' },
  { key: 'carpete', forms: ['carpetes', 'carpete', 'tapetes', 'tapete'], one: 'carpete', many: 'carpetes', gender: 'm', unit: 'un' },
];

/** Verbos escritos pelo cliente → como o serviço aparece no orçamento. */
export const VERB_STEMS: { forms: string[]; stem: string }[] = [
  { forms: ['pintar', 'pintura', 'repintar', 'pintando'], stem: 'Pintura' },
  { forms: ['instalar', 'instalacao', 'colocar', 'instalando'], stem: 'Instalação' },
  { forms: ['trocar', 'troca', 'substituir', 'substituicao', 'trocando'], stem: 'Troca' },
  { forms: ['consertar', 'conserto', 'arrumar', 'reparar', 'reparo', 'concertar'], stem: 'Conserto' },
  { forms: ['limpar', 'limpeza', 'higienizar', 'lavar'], stem: 'Limpeza' },
  { forms: ['montar', 'montagem'], stem: 'Montagem' },
  { forms: ['retirar', 'remover', 'tirar', 'demolir', 'remocao'], stem: 'Remoção' },
  { forms: ['fazer', 'construir', 'fabricar', 'criar', 'projetar'], stem: 'Confecção' },
  { forms: ['revisar', 'revisao', 'manutencao'], stem: 'Manutenção' },
  { forms: ['reformar', 'reforma'], stem: 'Reforma' },
];

/** Verbo padrão quando a mensagem não deixa claro o que fazer. */
export const DEFAULT_STEM: Record<ServiceTypeId, string> = {
  pintura: 'Pintura',
  eletrica: 'Instalação',
  marcenaria: 'Confecção',
  manutencao: 'Manutenção',
  limpeza: 'Limpeza',
  instalacao: 'Instalação',
  outro: 'Serviço',
};

/** Números escritos por extenso que aparecem em pedidos do dia a dia. */
export const NUMBER_WORDS: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  quatorze: 14,
  catorze: 14,
  quinze: 15,
  dezesseis: 16,
  dezessete: 17,
  dezoito: 18,
  dezenove: 19,
  vinte: 20,
  trinta: 30,
};

/** Observações que vale a pena destacar no documento. */
export const NOTE_PATTERNS: { pattern: RegExp; note: string }[] = [
  { pattern: /\burgent\w*\b|\bcom pressa\b|\bpra ontem\b/, note: 'Cliente sinalizou urgência.' },
  { pattern: /\bmaterial (?:por conta|e por conta|fica por conta) (?:do|da) cliente\b|\beu compro o material\b/, note: 'Material por conta do cliente.' },
  { pattern: /\bcom material\b|\bmaterial incluso\b|\bmaterial incluido\b/, note: 'Material incluso no valor.' },
  { pattern: /\bfim de semana\b|\bsabado\b|\bdomingo\b/, note: 'Cliente mencionou atendimento em fim de semana.' },
  { pattern: /\bfinal de mes\b|\bmes que vem\b|\bproxima semana\b/, note: 'Cliente mencionou uma data preferida — confirmar agenda.' },
];
