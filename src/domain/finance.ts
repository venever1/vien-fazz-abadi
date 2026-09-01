import type { Expense, ExpenseCategory, Invoice, Payment, PaymentStatus, Product } from '../types';
import { getYearMonth, getMonthsRange } from '../utils/date';

export const calculateProgress = (paidAmount: number, totalAmount: number): number => {
  if (totalAmount <= 0) return 0;
  return (paidAmount / totalAmount) * 100;
};

export const derivePaymentStatus = (paidAmount: number, totalAmount: number): PaymentStatus => {
  if (totalAmount <= 0 || paidAmount <= 0) return 'Belum Bayar';
  if (paidAmount >= totalAmount) return 'Lunas';
  return 'Cicilan';
};

export const calculateReceivables = (invoices: Invoice[]): number =>
  invoices.reduce(
    (sum, invoice) => sum + Math.max(invoice.total_amount - invoice.paid_amount, 0),
    0,
  );

export const calculateTotalIncome = (payments: Payment[]): number =>
  payments.reduce((sum, payment) => sum + payment.amount, 0);

export const calculateTotalExpense = (expenses: Expense[]): number =>
  expenses.reduce((sum, expense) => sum + expense.amount, 0);

export const calculateNetCashflow = (totalIncome: number, totalExpense: number): number =>
  totalIncome - totalExpense;

export const validatePaymentAmount = (
  amount: number,
  invoice: Pick<Invoice, 'total_amount' | 'paid_amount'>,
): { valid: boolean; remaining: number; exceeds: boolean } => {
  const remaining = invoice.total_amount - invoice.paid_amount;
  const valid = Number.isFinite(amount) && amount > 0;
  const exceeds = amount > remaining;
  return { valid, remaining, exceeds };
};

export interface MonthlyCashflowPoint {
  yearMonth: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

const MONTH_LABELS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export interface CalculateMonthlyCashflowParams {
  payments: Payment[];
  expenses: Expense[];
  monthsBack: number;
  endingDate?: string | Date;
}

export const calculateMonthlyCashflow = ({
  payments,
  expenses,
  monthsBack,
  endingDate = new Date(),
}: CalculateMonthlyCashflowParams): MonthlyCashflowPoint[] => {
  const { start, end } = getMonthsRange(endingDate, monthsBack);
  const startYear = Number(start.slice(0, 4));
  const startMonth = Number(start.slice(5, 7));
  const endYear = Number(end.slice(0, 4));
  const endMonth = Number(end.slice(5, 7));
  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  const points: MonthlyCashflowPoint[] = [];
  for (let i = 0; i < totalMonths; i++) {
    const year = startYear + Math.floor((startMonth - 1 + i) / 12);
    const month = ((startMonth - 1 + i) % 12) + 1;
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    points.push({
      yearMonth,
      label: `${MONTH_LABELS_SHORT[month - 1]} ${year}`,
      income: 0,
      expense: 0,
      net: 0,
    });
  }
  const indexMap = new Map(points.map((p, i) => [p.yearMonth, i]));
  for (const payment of payments) {
    const ym = getYearMonth(payment.payment_date);
    const idx = indexMap.get(ym);
    if (idx !== undefined) {
      points[idx].income += payment.amount;
    }
  }
  for (const expense of expenses) {
    const ym = getYearMonth(expense.transaction_date);
    const idx = indexMap.get(ym);
    if (idx !== undefined) {
      points[idx].expense += expense.amount;
    }
  }
  for (const point of points) {
    point.net = point.income - point.expense;
  }
  return points;
};

export interface ProductContributionPoint {
  productId: string;
  productName: string;
  category: string;
  amount: number;
  percentage: number;
}

export interface CalculateProductContributionParams {
  payments: Payment[];
  invoices: Invoice[];
  products: Product[];
}

export const calculateProductContribution = ({
  payments,
  invoices,
  products,
}: CalculateProductContributionParams): ProductContributionPoint[] => {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const invoiceMap = new Map(invoices.map((inv) => [inv.id, inv]));
  const accumulated = new Map<string, number>();
  for (const payment of payments) {
    const invoice = invoiceMap.get(payment.invoice_id);
    if (!invoice) continue;
    const product = productMap.get(invoice.product_id);
    if (!product || !product.active) continue;
    accumulated.set(
      product.id,
      (accumulated.get(product.id) ?? 0) + payment.amount,
    );
  }
  const totalRevenue = [...accumulated.values()].reduce((sum, v) => sum + v, 0);
  return [...accumulated.entries()]
    .map(([productId, amount]) => {
      const product = productMap.get(productId)!;
      return {
        productId,
        productName: product.name,
        category: product.category,
        amount,
        percentage: totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0,
      };
    })
    .sort((a, b) => b.amount - a.amount);
};

export interface ExpenseCategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}

export interface CalculateExpenseCategorySummaryParams {
  expenses: Expense[];
  periodStart?: string;
  periodEnd?: string;
}

export const calculateExpenseCategorySummary = ({
  expenses,
  periodStart,
  periodEnd,
}: CalculateExpenseCategorySummaryParams): ExpenseCategorySummary[] => {
  const filtered = expenses;
  const accumulated = new Map<ExpenseCategory, number>();
  for (const expense of filtered) {
    const inPeriod =
      !periodStart ||
      !periodEnd ||
      (expense.transaction_date >= periodStart && expense.transaction_date <= periodEnd);
    if (!inPeriod) continue;
    accumulated.set(
      expense.category,
      (accumulated.get(expense.category) ?? 0) + expense.amount,
    );
  }
  const total = [...accumulated.values()].reduce((sum, v) => sum + v, 0);
  return [...accumulated.entries()]
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export type ReminderTier = 'overdue' | 'due-soon' | 'upcoming';

export interface DueReminderInfo {
  invoiceId: string;
  companyName: string;
  companyPhone: string;
  dueDate: string;
  daysUntilDue: number;
  tier: ReminderTier;
  status: PaymentStatus;
  totalAmount: number;
  remainingAmount: number;
}

export const daysUntilDue = (dueDate: string, referenceDate: string = new Date().toISOString().slice(0, 10)): number => {
  const due = new Date(dueDate + 'T00:00:00');
  const ref = new Date(referenceDate + 'T00:00:00');
  return Math.round((due.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
};

export const deriveReminderTier = (days: number): ReminderTier => {
  if (days < 0) return 'overdue';
  if (days <= 7) return 'due-soon';
  return 'upcoming';
};

export interface CashflowForecastPoint {
  yearMonth: string;
  label: string;
  income: number;
  expense: number;
  net: number;
}

export const calculateCashflowForecast = (
  history: MonthlyCashflowPoint[],
  monthsAhead = 3,
): CashflowForecastPoint[] => {
  const points = history.filter((p) => p.income !== 0 || p.expense !== 0);
  if (points.length === 0) return [];

  const avgIncome = points.reduce((s, p) => s + p.income, 0) / points.length;
  const avgExpense = points.reduce((s, p) => s + p.expense, 0) / points.length;

  const last = points[points.length - 1];
  const [lastYear, lastMonth] = last.yearMonth.split('-').map(Number);

  const forecasts: CashflowForecastPoint[] = [];
  for (let i = 1; i <= monthsAhead; i++) {
    const absoluteMonth = lastYear * 12 + (lastMonth - 1) + i;
    const year = Math.floor(absoluteMonth / 12);
    const month = (absoluteMonth % 12) + 1;
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    const income = Math.round(avgIncome);
    const expense = Math.round(avgExpense);
    forecasts.push({
      yearMonth,
      label: `${MONTH_LABELS_SHORT[month - 1]} ${year}`,
      income,
      expense,
      net: income - expense,
    });
  }
  return forecasts;
};