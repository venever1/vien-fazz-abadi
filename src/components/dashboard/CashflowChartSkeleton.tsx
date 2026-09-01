import { Skeleton } from '../common/Skeleton';

export const CashflowChartSkeleton = () => {
  return (
    <div className="cashflow-chart-skeleton" role="status" aria-busy="true" aria-label="Memuat grafik arus kas">
      <div className="cashflow-chart-skeleton__bars">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="cashflow-chart-skeleton__bar">
            <Skeleton variant="bar" />
            <Skeleton variant="text-short" />
          </div>
        ))}
      </div>
      <div className="cashflow-chart-skeleton__legend">
        <Skeleton variant="text-short" width="80px" />
        <Skeleton variant="text-short" width="80px" />
      </div>
    </div>
  );
};
