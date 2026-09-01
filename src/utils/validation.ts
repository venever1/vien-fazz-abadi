import type {
  Company,
  Expense,
  ExpenseCategory,
  Invoice,
  PaymentStatus,
} from '../types';

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

const ok: ValidationResult = { valid: true, issues: [] };

const fail = (issues: ValidationIssue[]): ValidationResult => ({ valid: false, issues });

const isBlank = (value: string | undefined | null): boolean =>
  value === undefined || value === null || value.trim() === '';

const positiveAmount = (value: number): boolean => Number.isFinite(value) && value > 0;

export const validateCompany = (input: Partial<Company>): ValidationResult => {
  const issues: ValidationIssue[] = [];
  if (isBlank(input.company_name)) {
    issues.push({ field: 'company_name', message: 'Nama perusahaan wajib diisi.' });
  }
  if (isBlank(input.status)) {
    issues.push({ field: 'status', message: 'Status pembayaran wajib diisi.' });
  } else if (!isPaymentStatus(input.status)) {
    issues.push({ field: 'status', message: 'Status tidak dikenali.' });
  }
  return issues.length ? fail(issues) : ok;
};

export const validateInvoice = (input: Partial<Invoice>): ValidationResult => {
  const issues: ValidationIssue[] = [];
  if (isBlank(input.company_id)) {
    issues.push({ field: 'company_id', message: 'Perusahaan wajib dipilih.' });
  }
  if (isBlank(input.product_id)) {
    issues.push({ field: 'product_id', message: 'Produk wajib dipilih.' });
  }
  if (!positiveAmount(input.total_amount ?? 0)) {
    issues.push({ field: 'total_amount', message: 'Total tagihan harus lebih dari 0.' });
  }
  if (input.paid_amount !== undefined && input.paid_amount < 0) {
    issues.push({ field: 'paid_amount', message: 'Nominal terbayar tidak boleh negatif.' });
  }
  if (isBlank(input.due_date)) {
    issues.push({ field: 'due_date', message: 'Jatuh tempo wajib diisi.' });
  }
  if (isBlank(input.status)) {
    issues.push({ field: 'status', message: 'Status wajib diisi.' });
  } else if (
    input.status !== 'Belum Bayar' &&
    input.status !== 'Cicilan' &&
    input.status !== 'Lunas'
  ) {
    issues.push({ field: 'status', message: 'Status tidak dikenali.' });
  }
  return issues.length ? fail(issues) : ok;
};

export interface PaymentDraft {
  invoice_id: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  reference?: string;
  notes?: string;
}

export const validatePayment = (input: Partial<PaymentDraft>): ValidationResult => {
  const issues: ValidationIssue[] = [];
  if (isBlank(input.invoice_id)) {
    issues.push({ field: 'invoice_id', message: 'Tagihan wajib dipilih.' });
  }
  if (!positiveAmount(input.amount ?? 0)) {
    issues.push({ field: 'amount', message: 'Nominal pembayaran harus lebih dari 0.' });
  }
  if (isBlank(input.payment_date)) {
    issues.push({ field: 'payment_date', message: 'Tanggal pembayaran wajib diisi.' });
  }
  return issues.length ? fail(issues) : ok;
};

export const validateExpense = (input: Partial<Expense>): ValidationResult => {
  const issues: ValidationIssue[] = [];
  if (isBlank(input.description)) {
    issues.push({ field: 'description', message: 'Keterangan pengeluaran wajib diisi.' });
  }
  if (isBlank(input.category)) {
    issues.push({ field: 'category', message: 'Kategori pengeluaran wajib diisi.' });
  }
  if (!positiveAmount(input.amount ?? 0)) {
    issues.push({ field: 'amount', message: 'Nominal pengeluaran harus lebih dari 0.' });
  }
  if (isBlank(input.transaction_date)) {
    issues.push({ field: 'transaction_date', message: 'Tanggal transaksi wajib diisi.' });
  }
  return issues.length ? fail(issues) : ok;
};

export const validatePaymentAmountAgainstInvoice = (
  amount: number,
  invoice: Pick<Invoice, 'total_amount' | 'paid_amount'>,
): ValidationResult => {
  const issues: ValidationIssue[] = [];
  if (!positiveAmount(amount)) {
    issues.push({ field: 'amount', message: 'Nominal pembayaran harus lebih dari 0.' });
  }
  const remaining = invoice.total_amount - invoice.paid_amount;
  if (amount > remaining) {
    issues.push({
      field: 'amount',
      message: 'Nominal pembayaran melebihi sisa tagihan.',
    });
  }
  return issues.length ? fail(issues) : ok;
};

export const isPaymentStatus = (value: unknown): value is PaymentStatus =>
  value === 'Belum Bayar' || value === 'Cicilan' || value === 'Lunas';

export const isExpenseCategory = (value: unknown): value is ExpenseCategory =>
  typeof value === 'string' && value.length > 0;
