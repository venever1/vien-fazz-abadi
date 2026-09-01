import type { Invoice, PaymentStatus } from '../../types';
import { calculateProgress, derivePaymentStatus } from '../../domain/finance';
import { getCompanies } from '../../services/repositories/companyRepository';
import { getInvoices } from '../../services/repositories/invoiceRepository';
import { getProducts } from '../../services/repositories/productRepository';

export interface PaymentRow {
  invoiceId: string;
  companyId: string;
  companyName: string;
  businessDescription: string;
  productName: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  progress: number;
  status: PaymentStatus;
}

export const getPaymentRows = async (): Promise<PaymentRow[]> => {
  const [invoices, companies, products] = await Promise.all([
    getInvoices(),
    getCompanies(),
    getProducts(),
  ]);

  const companyMap = new Map(companies.map((c) => [c.id, c]));
  const productMap = new Map(products.map((p) => [p.id, p]));

  return invoices.map((invoice) => {
    const company = companyMap.get(invoice.company_id);
    const product = productMap.get(invoice.product_id);
    return {
      invoiceId: invoice.id,
      companyId: invoice.company_id,
      companyName: company?.company_name ?? 'Perusahaan tidak diketahui',
      businessDescription: company?.business_description ?? '',
      productName: product?.name ?? 'Produk tidak diketahui',
      totalAmount: invoice.total_amount,
      paidAmount: invoice.paid_amount,
      dueDate: invoice.due_date,
      progress: calculateProgress(invoice.paid_amount, invoice.total_amount),
      status: invoice.status,
    };
  });
};

export const filterPaymentRows = (
  rows: PaymentRow[],
  search: string,
  statusFilter: PaymentStatus | 'Semua',
): PaymentRow[] => {
  const normalizedSearch = search.trim().toLowerCase();
  return rows.filter((row) => {
    const matchesSearch =
      normalizedSearch === '' ||
      row.companyName.toLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === 'Semua' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
};

export const buildPaidInvoiceUpdate = (
  invoice: Pick<Invoice, 'total_amount'>,
): { paid_amount: number; status: PaymentStatus } => ({
  paid_amount: invoice.total_amount,
  status: derivePaymentStatus(invoice.total_amount, invoice.total_amount),
});
