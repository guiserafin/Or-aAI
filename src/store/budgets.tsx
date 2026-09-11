import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Budget, BudgetDraft, GeneratedBudget, ServiceTypeId } from '@/types/budget';
import { createId } from '@/utils/id';
import { nextBudgetNumber } from '@/utils/budget';
import { track } from '@/services/analytics';
import { loadBudgets, saveBudgets } from './storage';

type CreateBudgetInput = {
  generated: GeneratedBudget;
  serviceType: ServiceTypeId;
  customerMessage: string;
};

type BudgetsContextValue = {
  budgets: Budget[];
  /** `false` só depois que o AsyncStorage respondeu. */
  isLoading: boolean;
  getBudget: (id: string) => Budget | undefined;
  createBudget: (input: CreateBudgetInput) => Budget;
  updateBudget: (id: string, draft: BudgetDraft) => void;
  registerShare: (id: string, channel: 'share' | 'pdf') => void;
};

const BudgetsContext = createContext<BudgetsContextValue | undefined>(undefined);

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /** Espelho síncrono da lista: `createBudget` precisa devolver o orçamento na hora. */
  const budgetsRef = useRef<Budget[]>([]);

  const commit = useCallback((next: Budget[]) => {
    budgetsRef.current = next;
    setBudgets(next);
    void saveBudgets(next);
  }, []);

  useEffect(() => {
    let active = true;

    loadBudgets().then((stored) => {
      if (!active) return;
      budgetsRef.current = stored;
      setBudgets(stored);
      setIsLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const getBudget = useCallback(
    (id: string) => budgetsRef.current.find((budget) => budget.id === id),
    [],
  );

  const createBudget = useCallback(
    ({ generated, serviceType, customerMessage }: CreateBudgetInput) => {
      const now = new Date().toISOString();
      const budget: Budget = {
        id: createId(),
        number: nextBudgetNumber(budgetsRef.current),
        createdAt: now,
        updatedAt: now,
        customerName: generated.customerName,
        serviceType,
        serviceTitle: generated.serviceTitle,
        customerMessage,
        items: generated.items,
        observations: generated.observations,
        estimatedDeadline: generated.estimatedDeadline,
        validityDays: generated.validityDays ?? 10,
        editCount: 0,
        shareCount: 0,
      };

      commit([budget, ...budgetsRef.current]);
      track('budget_created', { serviceType, itemCount: budget.items.length });
      return budget;
    },
    [commit],
  );

  const updateBudget = useCallback(
    (id: string, draft: BudgetDraft) => {
      const next = budgetsRef.current.map((budget) =>
        budget.id === id
          ? {
              ...budget,
              ...draft,
              updatedAt: new Date().toISOString(),
              editCount: budget.editCount + 1,
            }
          : budget,
      );

      commit(next);
      track('budget_edited', { budgetId: id });
    },
    [commit],
  );

  const registerShare = useCallback(
    (id: string, channel: 'share' | 'pdf') => {
      const next = budgetsRef.current.map((budget) =>
        budget.id === id ? { ...budget, shareCount: budget.shareCount + 1 } : budget,
      );

      commit(next);
      track(channel === 'pdf' ? 'budget_pdf_generated' : 'budget_shared', { budgetId: id });
    },
    [commit],
  );

  const value = useMemo<BudgetsContextValue>(
    () => ({ budgets, isLoading, getBudget, createBudget, updateBudget, registerShare }),
    [budgets, isLoading, getBudget, createBudget, updateBudget, registerShare],
  );

  return <BudgetsContext.Provider value={value}>{children}</BudgetsContext.Provider>;
}

export function useBudgets(): BudgetsContextValue {
  const context = useContext(BudgetsContext);
  if (!context) {
    throw new Error('useBudgets precisa estar dentro de <BudgetsProvider>.');
  }
  return context;
}

/** Acesso a um orçamento específico, já reagindo a edições. */
export function useBudget(id: string | undefined): Budget | undefined {
  const { budgets } = useBudgets();
  return useMemo(
    () => (id ? budgets.find((budget) => budget.id === id) : undefined),
    [budgets, id],
  );
}
