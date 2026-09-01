import type { Expense } from '../../types';
import { apiClient } from '../api/client';

export const getExpenses = async (): Promise<Expense[]> => {
  return apiClient.get<Expense[]>('/expenses');
};

export const createExpense = async (
  input: Omit<Expense, 'id' | 'created_at' | 'updated_at'>,
): Promise<Expense> => {
  return apiClient.post<Expense>('/expenses', input);
};

export const updateExpense = async (
  id: string,
  input: Partial<Expense>,
): Promise<Expense | undefined> => {
  return apiClient.patch<Expense>(`/expenses/${id}`, input);
};

export const deleteExpense = async (id: string): Promise<boolean> => {
  await apiClient.delete<{ id: string }>(`/expenses/${id}`);
  return true;
};
