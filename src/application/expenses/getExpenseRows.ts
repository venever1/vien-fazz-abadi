import type { Expense, ExpenseCategory } from '../../types';
import { getExpenses } from '../../services/repositories/expenseRepository';

export interface FilterExpensesParams {
  search?: string;
  category?: ExpenseCategory | 'Semua';
  month?: string; // YYYY-MM or 'Semua'
}

export const filterExpenses = (
  expenses: Expense[],
  { search = '', category = 'Semua', month = 'Semua' }: FilterExpensesParams,
): Expense[] => {
  const query = search.trim().toLowerCase();
  return expenses.filter((e) => {
    const matchesSearch =
      !query ||
      e.description.toLowerCase().includes(query) ||
      (e.notes && e.notes.toLowerCase().includes(query));

    const matchesCategory = category === 'Semua' || e.category === category;

    const matchesMonth =
      month === 'Semua' || e.transaction_date.startsWith(month);

    return matchesSearch && matchesCategory && matchesMonth;
  });
};

export const getExpenseRows = async (
  filters: FilterExpensesParams = {},
): Promise<{ all: Expense[]; filtered: Expense[] }> => {
  const all = await getExpenses();
  const filtered = filterExpenses(all, filters);
  return { all, filtered };
};
