import { useMemo } from 'react';
import { calculateCashflowForecast, type MonthlyCashflowPoint } from '../../domain/finance';
import { formatRupiah } from '../../utils/currency';
import { EmptyState } from '../common/EmptyState';

interface ForecastSectionProps {
  cashflow: MonthlyCashflowPoint[];
}

export const ForecastSection = ({ cashflow }: ForecastSectionProps) => {
  const forecast = useMemo(() => calculateCashflowForecast(cashflow, 3), [cashflow]);

  if (forecast.length === 0) {
    return (
      <div className="panel section-gap">
        <div className="panel__header">
          <h2 className="panel__title">Forecast Arus Kas</h2>
        </div>
        <div className="panel__body">
          <EmptyState
            title="Belum ada data untuk forecast."
            description="Forecast muncul setelah ada minimal satu bulan transaksi."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="panel section-gap">
      <div className="panel__header">
        <h2 className="panel__title">Forecast Arus Kas</h2>
      </div>
      <div className="panel__body">
        <p className="forecast__note">
          Estimasi 3 bulan ke depan berdasarkan rata-rata pemasukan &amp; pengeluaran periode lalu.
        </p>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Bulan</th>
                <th>Pemasukan</th>
                <th>Pengeluaran</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((f) => (
                <tr key={f.yearMonth}>
                  <td>{f.label}</td>
                  <td className="table__cell--mono">{formatRupiah(f.income)}</td>
                  <td className="table__cell--mono">{formatRupiah(f.expense)}</td>
                  <td
                    className="table__cell--mono"
                    style={{ color: f.net < 0 ? 'var(--danger)' : 'var(--ok)' }}
                  >
                    {formatRupiah(f.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
