import { calculateExpenseCategorySummary } from '../../domain/finance';
import type { Expense } from '../../types';
import { formatRupiah } from '../../utils/currency';
import { ProgressBar } from '../common';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export const ExpenseSummary = ({ expenses }: ExpenseSummaryProps) => {
  const summary = calculateExpenseCategorySummary({ expenses });

  return (
    <div className="expense-summary">
      <div className="panel__header">
        <h2 className="panel__title">Rekap per Kategori</h2>
      </div>
      <div className="panel__body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {summary.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--ink-dim)', margin: '20px 0' }}>
            Tidak ada pengeluaran.
          </p>
        ) : (
          summary.map((item) => (
            <div key={item.category} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 600 }}>{item.category}</span>
                <span className="table__cell--mono">{formatRupiah(item.amount)}</span>
              </div>
              <ProgressBar progress={item.percentage} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
