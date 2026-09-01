export type PaymentStatus = 'Belum Bayar' | 'Cicilan' | 'Lunas';

export type ExpenseCategory =
  | 'Bahan Baku Sabun'
  | 'Bahan Baku Shampo'
  | 'Bahan Baku Semir'
  | 'Kemasan & Botol'
  | 'Operasional'
  | 'Lainnya';

export interface Company {
  id: string;
  company_name: string;
  business_description: string;
  contact_person: string;
  phone: string;
  address: string;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  active: boolean;
}

export interface Invoice {
  id: string;
  company_id: string;
  invoice_number: string;
  product_id: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  paid_amount: number;
  status: PaymentStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  reference: string;
  notes: string;
  created_at: string;
}

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  transaction_date: string;
  amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export * from './repository';