import type { Payment } from '../../types';
import { apiClient } from '../api/client';

export const getPayments = async (): Promise<Payment[]> => {
  return apiClient.get<Payment[]>('/payments');
};

export const getPaymentsByInvoiceId = async (invoiceId: string): Promise<Payment[]> => {
  return apiClient.get<Payment[]>(`/invoices/${invoiceId}/payments`);
};

export const getPaymentsByInvoiceFromApi = async (invoiceId: string): Promise<Payment[]> => {
  return apiClient.get<Payment[]>(`/invoices/${invoiceId}/payments`);
};

export const createPayment = async (
  input: Omit<Payment, 'id' | 'created_at'>,
): Promise<Payment> => {
  return apiClient.post<Payment>('/payments', input);
};
