import type { Company, Expense, Invoice, Payment, Product } from './index';

export interface ICompanyRepository {
  getCompanies(): Promise<Company[]>;
  getCompanyById(id: string): Promise<Company>;
  getCompanyFromApi(id: string): Promise<Company>;
  createCompany(input: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company>;
  deleteCompany(id: string): Promise<boolean>;
}

export interface IProductRepository {
  getProducts(): Promise<Product[]>;
}

export interface IInvoiceRepository {
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice>;
  getInvoicesByCompanyFromApi(companyId: string): Promise<Invoice[]>;
  createInvoice(input: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice>;
  updateInvoice(id: string, input: Partial<Invoice>): Promise<Invoice>;
  deleteInvoice(id: string): Promise<boolean>;
}

export interface IPaymentRepository {
  getPayments(): Promise<Payment[]>;
  getPaymentsByInvoiceId(invoiceId: string): Promise<Payment[]>;
  createPayment(input: Omit<Payment, 'id' | 'created_at'>): Promise<Payment>;
}

export interface IExpenseRepository {
  getExpenses(): Promise<Expense[]>;
  createExpense(input: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense>;
  updateExpense(id: string, input: Partial<Expense>): Promise<Expense>;
  deleteExpense(id: string): Promise<boolean>;
}
