import type { Expense } from '../types';
import type { PaymentRow } from '../application/payments/getPaymentRows';
import { formatDateId } from './date';
import { exportToCsv } from './exportCsv';
import { exportToExcel, exportToPdf } from './exportSpreadsheet';

export interface PaymentExportRow extends PaymentRow {
  remaining: number;
}

const paymentColumns = [
  { header: 'Perusahaan', getValue: (r: PaymentExportRow) => r.companyName },
  { header: 'Jenis Usaha', getValue: (r: PaymentExportRow) => r.businessDescription },
  { header: 'Produk', getValue: (r: PaymentExportRow) => r.productName },
  { header: 'Tagihan', getValue: (r: PaymentExportRow) => r.totalAmount },
  { header: 'Dibayar', getValue: (r: PaymentExportRow) => r.paidAmount },
  { header: 'Sisa', getValue: (r: PaymentExportRow) => r.remaining },
  { header: 'Progress', getValue: (r: PaymentExportRow) => `${r.progress.toFixed(0)}%` },
  { header: 'Status', getValue: (r: PaymentExportRow) => r.status },
  { header: 'Jatuh Tempo', getValue: (r: PaymentExportRow) => formatDateId(r.dueDate) },
];

const expenseColumns = [
  { header: 'Keterangan', getValue: (e: Expense) => e.description },
  { header: 'Kategori', getValue: (e: Expense) => e.category },
  { header: 'Tanggal', getValue: (e: Expense) => formatDateId(e.transaction_date) },
  { header: 'Jumlah', getValue: (e: Expense) => e.amount },
  { header: 'Catatan', getValue: (e: Expense) => e.notes },
];

export const buildPaymentCsv = (rows: PaymentRow[], filename: string): void => {
  exportToCsv<PaymentExportRow>(
    rows.map((r) => ({ ...r, remaining: Math.max(r.totalAmount - r.paidAmount, 0) })),
    paymentColumns,
    filename,
  );
};

export const buildPaymentExcel = (rows: PaymentRow[], filename: string): void => {
  exportToExcel<PaymentExportRow>(
    rows.map((r) => ({ ...r, remaining: Math.max(r.totalAmount - r.paidAmount, 0) })),
    paymentColumns,
    filename,
  );
};

export const buildPaymentPdf = (rows: PaymentRow[], filename: string): void => {
  exportToPdf<PaymentExportRow>(
    rows.map((r) => ({ ...r, remaining: Math.max(r.totalAmount - r.paidAmount, 0) })),
    paymentColumns,
    filename,
  );
};

export const buildExpenseCsv = (expenses: Expense[], filename: string): void => {
  exportToCsv(expenses, expenseColumns, filename);
};

export const buildExpenseExcel = (expenses: Expense[], filename: string): void => {
  exportToExcel(expenses, expenseColumns, filename);
};

export const buildExpensePdf = (expenses: Expense[], filename: string): void => {
  exportToPdf(expenses, expenseColumns, filename);
};