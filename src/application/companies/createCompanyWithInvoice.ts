import type { PaymentStatus } from '../../types';
import { derivePaymentStatus } from '../../domain/finance';
import { createCompany } from '../../services/repositories/companyRepository';
import { createInvoice } from '../../services/repositories/invoiceRepository';

export interface CreateCompanyWithInvoiceInput {
  company_name: string;
  business_description?: string;
  product_id: string;
  total_amount: number;
  due_date: string;
  status: PaymentStatus;
}

export interface CompanyWithInvoiceValidationErrors extends Record<string, string | undefined> {
  company_name?: string;
  product_id?: string;
  total_amount?: string;
  due_date?: string;
  status?: string;
}

export const validateCompanyWithInvoiceInput = (
  input: Partial<CreateCompanyWithInvoiceInput>,
): CompanyWithInvoiceValidationErrors => {
  const errors: CompanyWithInvoiceValidationErrors = {};

  if (!input.company_name || input.company_name.trim() === '') {
    errors.company_name = 'Nama perusahaan wajib diisi.';
  }

  if (!input.product_id || input.product_id.trim() === '') {
    errors.product_id = 'Produk wajib dipilih.';
  }

  if (input.total_amount === undefined || input.total_amount === null || isNaN(input.total_amount)) {
    errors.total_amount = 'Jumlah tagihan wajib diisi.';
  } else if (input.total_amount <= 0) {
    errors.total_amount = 'Jumlah tagihan harus lebih dari 0.';
  }

  if (!input.due_date || input.due_date.trim() === '') {
    errors.due_date = 'Jatuh tempo wajib diisi.';
  }

  if (!input.status) {
    errors.status = 'Status wajib diisi.';
  } else if (
    input.status !== 'Belum Bayar' &&
    input.status !== 'Cicilan' &&
    input.status !== 'Lunas'
  ) {
    errors.status = 'Status tidak valid.';
  }

  return errors;
};

export const createCompanyWithInvoice = async (
  input: CreateCompanyWithInvoiceInput,
) => {
  const errors = validateCompanyWithInvoiceInput(input);
  if (Object.keys(errors).length > 0) {
    throw new Error('Validasi gagal.');
  }

  const initialStatus = input.status;
  const initialPaidAmount = initialStatus === 'Lunas' ? input.total_amount : 0;

  // 1. Save company
  const company = await createCompany({
    company_name: input.company_name.trim(),
    business_description: input.business_description?.trim() ?? '',
    contact_person: '',
    phone: '',
    address: '',
    status: initialStatus,
  });

  // 2. Save initial invoice
  const today = new Date().toISOString().slice(0, 10);
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const invoice = await createInvoice({
    company_id: company.id,
    invoice_number: invoiceNumber,
    product_id: input.product_id,
    invoice_date: today,
    due_date: input.due_date,
    total_amount: input.total_amount,
    paid_amount: initialPaidAmount,
    status: derivePaymentStatus(initialPaidAmount, input.total_amount),
    notes: '',
  });

  return { company, invoice };
};
