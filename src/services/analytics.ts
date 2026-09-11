/**
 * Ponto único de instrumentação.
 *
 * O MVP não envia nada para lugar nenhum — só registra no console durante o
 * desenvolvimento. Quando chegar a hora de medir de verdade (PostHog, Amplitude,
 * Firebase...), basta implementar `track` aqui: todas as telas já chamam os
 * eventos certos.
 *
 * Métricas que queremos responder na validação:
 *   budget_created  → quantos orçamentos foram criados
 *   budget_edited   → quantos foram editados
 *   budget_shared   → quantos foram compartilhados (Share ou PDF)
 *   budget_opened   → quantos voltaram a ser abertos pelo histórico
 */

export type AnalyticsEvent =
  | 'app_opened'
  | 'new_budget_started'
  | 'example_selected'
  | 'budget_generation_requested'
  | 'budget_generation_failed'
  | 'budget_created'
  | 'budget_edited'
  | 'budget_opened'
  | 'budget_shared'
  | 'budget_pdf_generated';

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(`[analytics] ${event}`, properties ?? {});
  }
  // TODO: enviar para o provedor escolhido depois da validação.
}
