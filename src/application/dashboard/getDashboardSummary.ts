import {
  calculateMonthlyCashflow,
  calculateNetCashflow,
  calculateProductContribution,
  calculateReceivables,
  calculateTotalExpense,
  calculateTotalIncome,
  type MonthlyCashflowPoint,
  type ProductContributionPoint,
} from '../../domain/finance';
import { getExpenses } from '../../services/repositories/expenseRepository';
import { getInvoices } from '../../services/repositories/invoiceRepository';
import { getPayments } from '../../services/repositories/paymentRepository';
import { getProducts } from '../../services/repositories/productRepository';
import { getMonthsRange, getYearMonth, isWithinPeriod } from '../../utils/date';

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  receivables: number;
  netCashflow: number;
  cashflow: MonthlyCashflowPoint[];
  productContribution: ProductContributionPoint[];
  periodStart: string;
  periodEnd: string;
}

export interface GetDashboardSummaryParams {
  monthsBack?: number;
  endingDate?: string | Date;
  selectedMonth?: string | null;
}

export const getDashboardSummary = async ({
  monthsBack = 6,
  endingDate = new Date(),
  selectedMonth = null,
}: GetDashboardSummaryParams = {}): Promise<DashboardSummary> => {
  const [invoices, payments, expenses, products] = await Promise.all([
    getInvoices(),
    getPayments(),
    getExpenses(),
    getProducts(),
  ]);

  const { start, end } = getMonthsRange(endingDate, monthsBack);

  const matchesFilter = (date: string): boolean => {
    if (!selectedMonth) return isWithinPeriod(date, start, end);
    return getYearMonth(date) === selectedMonth;
  };

  const paymentsInPeriod = payments.filter((payment) => matchesFilter(payment.payment_date));
  const expensesInPeriod = expenses.filter((expense) => matchesFilter(expense.transaction_date));

  const totalIncome = calculateTotalIncome(paymentsInPeriod);
  const totalExpense = calculateTotalExpense(expensesInPeriod);
  const receivables = calculateReceivables(invoices);

  const cashflow = calculateMonthlyCashflow({
    payments,
    expenses,
    monthsBack,
    endingDate,
  });

  const productContribution = calculateProductContribution({
    payments: paymentsInPeriod,
    invoices,
    products,
  });

  return {
    totalIncome,
    totalExpense,
    receivables,
    netCashflow: calculateNetCashflow(totalIncome, totalExpense),
    cashflow,
    productContribution,
    periodStart: start,
    periodEnd: end,
  };
};
