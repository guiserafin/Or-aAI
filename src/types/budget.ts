/** Tipos de serviço oferecidos no MVP. */
export type ServiceTypeId =
  | 'pintura'
  | 'eletrica'
  | 'marcenaria'
  | 'manutencao'
  | 'limpeza'
  | 'instalacao'
  | 'outro';

export type ServiceType = {
  id: ServiceTypeId;
  label: string;
  /** Título sugerido para o documento quando a IA não encontra algo melhor. */
  defaultTitle: string;
  /** Prazo padrão sugerido; o prestador sempre pode editar. */
  defaultDeadline: string;
};

/** Item do orçamento. `price` é opcional: a IA nunca inventa valores. */
export type BudgetItem = {
  id: string;
  description: string;
  quantity?: number;
  unit?: string;
  price?: number;
};

/** Entrada do "cérebro" do produto. */
export type GenerateBudgetInput = {
  customerName: string;
  customerMessage: string;
  serviceType: ServiceTypeId;
};

/**
 * Saída da camada de IA.
 * Repare que `price` e `totalPrice` são opcionais por design (Opção A do MVP):
 * a IA identifica o que fazer, o prestador define quanto custa.
 */
export type GeneratedBudget = {
  customerName: string;
  serviceTitle: string;
  items: BudgetItem[];
  observations?: string;
  estimatedDeadline?: string;
  validityDays?: number;
  totalPrice?: number;
};

/** Orçamento persistido localmente. */
export type Budget = {
  id: string;
  /** Número sequencial exibido no documento, ex.: "0001". */
  number: string;
  createdAt: string;
  updatedAt: string;

  customerName: string;
  serviceType: ServiceTypeId;
  serviceTitle: string;
  /** Mensagem original colada pelo prestador — útil para revisar o que foi pedido. */
  customerMessage: string;

  items: BudgetItem[];
  observations?: string;
  estimatedDeadline?: string;
  validityDays?: number;

  /** Contadores usados para medir o MVP manualmente. */
  editCount: number;
  shareCount: number;
};

/** Campos que o usuário pode alterar na tela de revisão. */
export type BudgetDraft = Pick<
  Budget,
  | 'customerName'
  | 'serviceTitle'
  | 'items'
  | 'observations'
  | 'estimatedDeadline'
  | 'validityDays'
>;
