import { useCallback, useEffect, useState } from 'react';
import { getDashboardSummary, type DashboardSummary } from '../../application/dashboard/getDashboardSummary';
import { KpiCards } from '../../components/dashboard/KpiCards';
import { KpiCardsSkeleton } from '../../components/dashboard/KpiCardsSkeleton';
import { CashflowChart } from '../../components/dashboard/CashflowChart';
import { CashflowChartSkeleton } from '../../components/dashboard/CashflowChartSkeleton';
import { ProductContributionChart } from '../../components/dashboard/ProductContributionChart';
import { ProductContributionChartSkeleton } from '../../components/dashboard/ProductContributionChartSkeleton';
import { DueDateReminderSection } from '../../components/dashboard/DueDateReminderSection';
import { ForecastSection } from '../../components/dashboard/ForecastSection';
import { PeriodSelector } from '../../components/common/PeriodSelector';
import { PaymentSection } from '../../components/payments/PaymentSection';
import { ExpenseSection } from '../../components/expenses/ExpenseSection';
import { AuditLogSection } from '../../components/audit/AuditLogSection';
import { useAuth } from '../../components/auth/AuthContext';

type DashboardState =
  | { status: 'loading' }
  | { status: 'success'; summary: DashboardSummary }
  | { status: 'error'; message: string };

export const DashboardPage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [monthsBack, setMonthsBack] = useState(6);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [state, setState] = useState<DashboardState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    setState({ status: 'loading' });

    getDashboardSummary({ monthsBack, selectedMonth })
      .then((summary) => {
        if (active) setState({ status: 'success', summary });
      })
      .catch(() => {
        if (active) setState({ status: 'error', message: 'Data gagal dimuat. Coba lagi.' });
      });

    return () => {
      active = false;
    };
  }, [monthsBack, selectedMonth]);

  const handlePeriodChange = useCallback((value: number) => {
    setMonthsBack(value);
    setSelectedMonth(null);
  }, []);

  const handleMonthClick = useCallback((yearMonth: string) => {
    setSelectedMonth((prev) => (prev === yearMonth ? null : yearMonth));
  }, []);

  return (
    <div className="dashboard">
      <div className="user-bar">
        <div className="user-bar__info">
          <span className="user-bar__name">{user?.username}</span>
          <span className={`user-bar__role ${user?.role === 'Admin/Owner' ? 'user-bar__role--admin' : 'user-bar__role--staff'}`}>
            {user?.role}
          </span>
        </div>
        <button className="btn btn--secondary btn--sm" onClick={logout}>
          Keluar
        </button>
      </div>

      <div className="dashboard__header">
        <div>
          <p className="page-header__eyebrow">Rekap Keuangan</p>
          <h1 className="page-header__title">Dashboard Penjualan Shampo · Sabun · Semir</h1>
          <p className="page-header__subtitle">Ringkasan pemasukan, pengeluaran, piutang, dan arus kas</p>
        </div>
        <div className="dashboard__period">
          <PeriodSelector monthsBack={monthsBack} onChange={handlePeriodChange} />
        </div>
      </div>

      {state.status === 'loading' && (
        <>
          <KpiCardsSkeleton />
          <div className="dashboard__charts section-gap">
            <div className="panel">
              <div className="panel__header">
                <h2 className="panel__title">Arus Kas</h2>
              </div>
              <div className="panel__body">
                <CashflowChartSkeleton />
              </div>
            </div>
            <div className="panel">
              <div className="panel__header">
                <h2 className="panel__title">Kontribusi Produk</h2>
              </div>
              <div className="panel__body">
                <ProductContributionChartSkeleton />
              </div>
            </div>
          </div>
        </>
      )}

      {state.status === 'success' && (
        <>
          {selectedMonth && (
            <div className="dashboard__filter-chip">
              <span>Filter bulan: <strong>{selectedMonth}</strong></span>
              <button
                className="btn btn--secondary btn--sm"
                type="button"
                onClick={() => setSelectedMonth(null)}
                aria-label="Hapus filter bulan"
              >
                Hapus Filter
              </button>
            </div>
          )}
          <KpiCards summary={state.summary} />
          <div className="dashboard__charts section-gap">
            <div className="panel">
              <div className="panel__header">
                <h2 className="panel__title">Arus Kas</h2>
              </div>
              <div className="panel__body">
                <CashflowChart
                  data={state.summary.cashflow}
                  onMonthClick={handleMonthClick}
                />
                {selectedMonth && (
                  <p className="cashflow-chart__hint">
                    Grafik menampilkan filter bulan aktif. Klik bar lagi untuk menghapus filter.
                  </p>
                )}
              </div>
            </div>
            <div className="panel">
              <div className="panel__header">
                <h2 className="panel__title">Kontribusi Produk</h2>
              </div>
              <div className="panel__body">
                <ProductContributionChart data={state.summary.productContribution} />
              </div>
            </div>
          </div>

          <ForecastSection cashflow={state.summary.cashflow} />

          <DueDateReminderSection />

          <PaymentSection />
          <ExpenseSection monthsBack={monthsBack} />

          {isAdmin && <AuditLogSection />}
        </>
      )}

      {state.status === 'error' && (
        <div className="inline-alert inline-alert--error" role="alert">
          {state.message}
        </div>
      )}
    </div>
  );
};
