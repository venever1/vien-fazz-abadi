import { apiClient } from '../../services/api/client';
import type { Payment } from '../../types';

export interface RecordPaymentInput {
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  reference?: string;
  notes?: string;
  allowOverpayment?: boolean;
}

export const recordPayment = async (input: RecordPaymentInput): Promise<Payment> => {
  const result = await apiClient.post<{ id: string; paid_amount: number; status: string }>(
    '/payments/record',
    {
      invoice_id: input.invoice_id,
      amount: input.amount,
      payment_date: input.payment_date,
      payment_method: input.payment_method,
      reference: input.reference,
      notes: input.notes,
    },
  );
  return {
    id: result.id,
    invoice_id: input.invoice_id,
    payment_date: input.payment_date,
    amount: input.amount,
    payment_method: input.payment_method || 'Transfer',
    reference: input.reference || '',
    notes: input.notes || '',
    created_at: new Date().toISOString(),
  };
};
