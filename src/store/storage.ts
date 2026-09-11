import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Budget } from '@/types/budget';

const STORAGE_KEY = '@orcaai/budgets/v1';

/**
 * Persistência local. Sem backend no MVP: tudo vive no aparelho do prestador.
 * Toda falha de leitura é tratada como "lista vazia" — nunca deve travar o app.
 */

export async function loadBudgets(): Promise<Budget[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isBudget);
  } catch {
    return [];
  }
}

export async function saveBudgets(budgets: Budget[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  } catch {
    // Sem espaço ou storage indisponível: o app segue funcionando em memória.
  }
}

/** Guarda mínima contra dados antigos ou corrompidos. */
function isBudget(value: unknown): value is Budget {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Budget>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.customerName === 'string' &&
    Array.isArray(candidate.items)
  );
}
