import type { Invoice } from '../../types';
import { apiClient } from '../api/client';

export const getInvoices = async (): Promise<Invoice[]> => {
  return apiClient.get<Invoice[]>('/invoices');
};

export const getInvoiceById = async (id: string): Promise<Invoice | undefined> => {
  return apiClient.get<Invoice>(`/invoices/${id}`);
};

export const getInvoicesByCompanyFromApi = async (companyId: string): Promise<Invoice[]> => {
  return apiClient.get<Invoice[]>(`/companies/${companyId}/invoices`);
};

export const createInvoice = async (input: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice> => {
  return apiClient.post<Invoice>('/invoices', input);
};

export const updateInvoice = async (id: string, input: Partial<Invoice>): Promise<Invoice | undefined> => {
  return apiClient.patch<Invoice>(`/invoices/${id}`, input);
};

export const deleteInvoice = async (id: string): Promise<boolean> => {
  await apiClient.delete<{ id: string }>(`/invoices/${id}`);
  return true;
};
