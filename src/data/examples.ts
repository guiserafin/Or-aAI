import type { ServiceTypeId } from '@/types/budget';

export type BudgetExample = {
  id: string;
  customerName: string;
  serviceType: ServiceTypeId;
  customerMessage: string;
};

/**
 * Exemplos reais de mensagens de WhatsApp para demonstrar o produto em segundos.
 * Ficam disponíveis na tela "Novo orçamento" — um toque preenche o formulário.
 */
export const BUDGET_EXAMPLES: BudgetExample[] = [
  {
    id: 'exemplo-pintura',
    customerName: 'Carlos',
    serviceType: 'pintura',
    customerMessage:
      'Preciso pintar minha casa. São 2 quartos, sala, cozinha e corredor. Também quero pintar as portas.',
  },
  {
    id: 'exemplo-eletrica',
    customerName: 'Marcos',
    serviceType: 'eletrica',
    customerMessage:
      'Preciso instalar 6 tomadas, trocar 3 interruptores e instalar duas luminárias.',
  },
  {
    id: 'exemplo-marcenaria',
    customerName: 'Ana',
    serviceType: 'marcenaria',
    customerMessage:
      'Queria fazer um móvel planejado para o quarto, com armário de 2,5 metros e uma bancada para estudo.',
  },
];
