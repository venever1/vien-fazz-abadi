import { getInvoices } from '../../services/repositories/invoiceRepository';
import { getCompanies } from '../../services/repositories/companyRepository';
import { daysUntilDue, deriveReminderTier, type DueReminderInfo } from '../../domain/finance';

export interface GetDueRemindersParams {
  daysAhead?: number;
  referenceDate?: string;
}

export const getDueReminders = async ({
  daysAhead = 14,
  referenceDate,
}: GetDueRemindersParams = {}): Promise<DueReminderInfo[]> => {
  const [invoices, companies] = await Promise.all([getInvoices(), getCompanies()]);
  const companyMap = new Map(companies.map((c) => [c.id, c]));

  const reminders: DueReminderInfo[] = invoices
    .filter((inv) => inv.status !== 'Lunas')
    .map((inv) => {
      const days = daysUntilDue(inv.due_date, referenceDate);
      return {
        invoiceId: inv.id,
        companyName: companyMap.get(inv.company_id)?.company_name ?? 'Perusahaan tidak diketahui',
        companyPhone: companyMap.get(inv.company_id)?.phone ?? '',
        dueDate: inv.due_date,
        daysUntilDue: days,
        tier: deriveReminderTier(days),
        status: inv.status,
        totalAmount: inv.total_amount,
        remainingAmount: Math.max(inv.total_amount - inv.paid_amount, 0),
      };
    })
    .filter((r) => r.tier !== 'upcoming' || r.daysUntilDue <= daysAhead)
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

  return reminders;
};
