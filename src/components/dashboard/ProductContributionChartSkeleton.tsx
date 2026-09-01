import { Skeleton } from '../common/Skeleton';

export const ProductContributionChartSkeleton = () => {
  return (
    <div className="product-chart-skeleton" role="status" aria-busy="true" aria-label="Memuat kontribusi produk">
      <div className="product-chart-skeleton__donut">
        <Skeleton variant="avatar" width="140px" height="140px" />
      </div>
      <div className="product-chart-skeleton__legend">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="product-chart-skeleton__item">
            <Skeleton variant="avatar" width="10px" height="10px" />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text-short" />
              <Skeleton variant="text" width="80%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
