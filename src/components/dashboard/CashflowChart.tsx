import { useState } from 'react';
import type { MonthlyCashflowPoint } from '../../domain/finance';
import { formatRupiah, formatRupiahCompact } from '../../utils/currency';
import { EmptyState } from '../common/EmptyState';

interface CashflowChartProps {
  data: MonthlyCashflowPoint[];
  onMonthClick?: (yearMonth: string) => void;
}

const CHART_HEIGHT = 180;

export const CashflowChart = ({ data, onMonthClick }: CashflowChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length === 0 || data.every((point) => point.income === 0 && point.expense === 0)) {
    return (
      <EmptyState
        title="Belum ada transaksi pada periode ini."
        description="Grafik arus kas akan muncul setelah ada pembayaran atau pengeluaran yang tercatat."
      />
    );
  }

  const maxValue = Math.max(
    1,
    ...data.map((point) => Math.max(point.income, point.expense)),
  );

  const activePoint = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="cashflow-chart">
      <div className="cashflow-chart__bars" role="img" aria-label="Grafik arus kas per bulan">
        {data.map((point, index) => {
          const incomeHeight = (point.income / maxValue) * CHART_HEIGHT;
          const expenseHeight = (point.expense / maxValue) * CHART_HEIGHT;
          const isActive = activeIndex === index;

          return (
            <div
              key={point.yearMonth}
              className={`cashflow-chart__group${isActive ? ' cashflow-chart__group--active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              onClick={() => onMonthClick?.(point.yearMonth)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && onMonthClick) {
                  e.preventDefault();
                  onMonthClick(point.yearMonth);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${point.label}: pemasukan ${formatRupiah(point.income)}, pengeluaran ${formatRupiah(point.expense)}, net ${formatRupiah(point.net)}`}
            >
              <div className="cashflow-chart__track" style={{ height: CHART_HEIGHT }}>
                <div
                  className="cashflow-chart__bar cashflow-chart__bar--income"
                  style={{ height: `${incomeHeight}px` }}
                />
                <div
                  className="cashflow-chart__bar cashflow-chart__bar--expense"
                  style={{ height: `${expenseHeight}px` }}
                />
              </div>
              <span className="cashflow-chart__label">{point.label}</span>
            </div>
          );
        })}
      </div>

      <div className="cashflow-chart__legend">
        <span className="cashflow-chart__legend-item">
          <span className="cashflow-chart__legend-dot cashflow-chart__legend-dot--income" />
          Pemasukan
        </span>
        <span className="cashflow-chart__legend-item">
          <span className="cashflow-chart__legend-dot cashflow-chart__legend-dot--expense" />
          Pengeluaran
        </span>
      </div>

      {activePoint ? (
        <div className="cashflow-chart__tooltip" role="status">
          <p className="cashflow-chart__tooltip-title">{activePoint.label}</p>
          <p className="cashflow-chart__tooltip-row">
            <span>Pemasukan</span>
            <span className="table__cell--mono">{formatRupiah(activePoint.income)}</span>
          </p>
          <p className="cashflow-chart__tooltip-row">
            <span>Pengeluaran</span>
            <span className="table__cell--mono">{formatRupiah(activePoint.expense)}</span>
          </p>
          <p className="cashflow-chart__tooltip-row cashflow-chart__tooltip-row--net">
            <span>Net</span>
            <span className="table__cell--mono">{formatRupiahCompact(activePoint.net)}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
};
