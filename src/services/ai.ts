import type { GenerateBudgetInput, GeneratedBudget } from '@/types/budget';
import { parseCustomerMessage } from './mockAi';

/**
 * Camada de IA do OrçaAI.
 *
 * Hoje roda 100% local (mock). O contrato de `generateBudget` é o mesmo que a
 * API real deverá expor, então trocar o mock pelo backend não exige mudança
 * nenhuma nas telas:
 *
 *   const response = await fetch(`${API_URL}/api/ai/generate-budget`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(input),
 *   });
 *   return (await response.json()) as GeneratedBudget;
 */

/** Troque para 'remote' quando a API existir. */
const AI_MODE: 'mock' | 'remote' = 'mock';

/** Tempo do mock — o suficiente para a tela de processamento fazer sentido. */
const MOCK_LATENCY_MS = 1400;

export class BudgetGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BudgetGenerationError';
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateBudget(input: GenerateBudgetInput): Promise<GeneratedBudget> {
  if (!input.customerMessage.trim()) {
    throw new BudgetGenerationError('Cole a mensagem do cliente para gerar o orçamento.');
  }

  if (AI_MODE === 'remote') {
    // TODO: implementar quando a API estiver no ar.
    throw new BudgetGenerationError('Modo remoto ainda não configurado.');
  }

  await delay(MOCK_LATENCY_MS);

  try {
    return parseCustomerMessage(input);
  } catch (error) {
    throw new BudgetGenerationError(
      'Não consegui organizar essa mensagem. Tente descrever o pedido com mais detalhes.',
    );
  }
}
