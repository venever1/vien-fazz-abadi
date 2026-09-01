import type { DashboardSummary } from '../../application/dashboard/getDashboardSummary';
import { formatRupiah } from '../../utils/currency';
import { KpiCard } from './KpiCard';

interface KpiCardsProps {
  summary: DashboardSummary;
}

export const KpiCards = ({ summary }: KpiCardsProps) => {
  const cards = [
    {
      id: 'income',
      label: 'Total Pemasukan',
      value: formatRupiah(summary.totalIncome),
      hint: 'Dari pembayaran yang tercatat',
      accent: 'ok' as const,
    },
    {
      id: 'expense',
      label: 'Total Pengeluaran',
      value: formatRupiah(summary.totalExpense),
      hint: 'Seluruh transaksi pengeluaran',
      accent: 'danger' as const,
    },
    {
      id: 'receivable',
      label: 'Piutang',
      value: formatRupiah(summary.receivables),
      hint: 'Belum Bayar + Cicilan',
      accent: 'amber' as const,
    },
    {
      id: 'net',
      label: 'Net Cashflow',
      value: formatRupiah(summary.netCashflow),
      hint: summary.netCashflow >= 0 ? 'Pemasukan lebih besar dari pengeluaran' : 'Pengeluaran lebih besar dari pemasukan',
      accent: 'teal' as const,
    },
  ];

  return (
    <section className="kpi-grid" aria-label="Ringkasan keuangan">
      {cards.map((card) => (
        <KpiCard key={card.id} {...card} />
      ))}
    </section>
  );
};