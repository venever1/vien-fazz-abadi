import { useState } from 'react';
import type { ProductContributionPoint } from '../../domain/finance';
import { formatRupiah } from '../../utils/currency';
import { EmptyState } from '../common/EmptyState';

interface ProductContributionChartProps {
  data: ProductContributionPoint[];
}

const DONUT_SIZE = 140;
const DONUT_RADIUS = DONUT_SIZE / 2;
const STROKE_WIDTH = 18;
const OUTER_RADIUS = DONUT_RADIUS - 2;
const INNER_RADIUS = OUTER_RADIUS - STROKE_WIDTH;
const MID_RADIUS = (OUTER_RADIUS + INNER_RADIUS) / 2;
const CIRCUMFERENCE = 2 * Math.PI * MID_RADIUS;

const PRODUCT_COLORS: Record<string, string> = {
  Shampo: 'var(--accent)',
  Semir: 'var(--accent-2)',
  Sabun: 'var(--ok)',
  Kombinasi: 'var(--purple)',
};

const COLORS_FALLBACK = ['var(--accent)', 'var(--accent-2)', 'var(--ok)', 'var(--purple)', 'var(--ink-dim)'];

const getColor = (category: string, index: number): string => PRODUCT_COLORS[category] ?? COLORS_FALLBACK[index % COLORS_FALLBACK.length];

export const ProductContributionChart = ({ data }: ProductContributionChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length === 0 || data.every((p) => p.amount === 0)) {
    return (
      <EmptyState
        title="Belum ada kontribusi produk."
        description="Grafik akan muncul setelah ada transaksi penjualan yang tercatat."
      />
    );
  }

  const visibleData = data.filter((p) => p.amount > 0);
  const total = visibleData.reduce((sum, p) => sum + p.amount, 0);

  let offset = 0;
  const segments = visibleData.map((point, index) => {
    const fraction = total > 0 ? point.amount / total : 0;
    const dash = fraction * CIRCUMFERENCE;
    const gap = CIRCUMFERENCE - dash;
    const color = getColor(point.category, index);
    const isActive = activeIndex === index;

    const segment = {
      key: point.productId,
      color,
      dasharray: `${dash} ${gap}`,
      dashoffset: -offset,
      point,
      isActive,
      index,
    };

    offset += dash;
    return segment;
  });

  const activePoint = activeIndex !== null ? visibleData[activeIndex] : null;

  return (
    <div className="product-chart">
      <div className="product-chart__donut-wrapper">
        <svg
          width={DONUT_SIZE}
          height={DONUT_SIZE}
          viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
          className="product-chart__donut"
          role="img"
          aria-label="Grafik kontribusi produk"
        >
          <circle
            cx={DONUT_RADIUS}
            cy={DONUT_RADIUS}
            r={MID_RADIUS}
            fill="none"
            stroke="var(--panel-2)"
            strokeWidth={STROKE_WIDTH}
          />
          {segments.map((seg) => (
            <circle
              key={seg.key}
              cx={DONUT_RADIUS}
              cy={DONUT_RADIUS}
              r={MID_RADIUS}
              fill="none"
              stroke={seg.color}
              strokeWidth={seg.isActive ? STROKE_WIDTH + 4 : STROKE_WIDTH}
              strokeDasharray={seg.dasharray}
              strokeDashoffset={seg.dashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${DONUT_RADIUS} ${DONUT_RADIUS})`}
              className="product-chart__segment"
              style={{
                opacity: activeIndex === null || seg.isActive ? 1 : 0.4,
                transition: 'opacity 140ms ease, stroke-width 140ms ease',
              }}
              onMouseEnter={() => setActiveIndex(seg.index)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          ))}
          <text
            x={DONUT_RADIUS}
            y={DONUT_RADIUS - 6}
            textAnchor="middle"
            className="product-chart__center-value"
          >
            {activePoint ? `${activePoint.percentage.toFixed(1)}%` : '100%'}
          </text>
          <text
            x={DONUT_RADIUS}
            y={DONUT_RADIUS + 12}
            textAnchor="middle"
            className="product-chart__center-label"
          >
            {activePoint ? activePoint.productName : 'Total'}
          </text>
        </svg>
      </div>

      <ul className="product-chart__legend" role="list">
        {segments.map((seg) => (
          <li
            key={seg.key}
            className={`product-chart__legend-item${seg.isActive ? ' product-chart__legend-item--active' : ''}`}
            onMouseEnter={() => setActiveIndex(seg.index)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(seg.index)}
            onBlur={() => setActiveIndex(null)}
            tabIndex={0}
          >
            <span className="product-chart__legend-dot" style={{ backgroundColor: seg.color }} />
            <span className="product-chart__legend-text">
              <span className="product-chart__legend-name">{seg.point.productName}</span>
              <span className="product-chart__legend-meta">
                {seg.point.percentage.toFixed(1)}% · {formatRupiah(seg.point.amount)}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {activePoint && (
        <div className="product-chart__tooltip" role="status">
          <p className="product-chart__tooltip-title">{activePoint.productName}</p>
          <p className="product-chart__tooltip-row">
            <span>Nominal</span>
            <span className="table__cell--mono">{formatRupiah(activePoint.amount)}</span>
          </p>
          <p className="product-chart__tooltip-row">
            <span>Kontribusi</span>
            <span className="table__cell--mono">{activePoint.percentage.toFixed(2)}%</span>
          </p>
        </div>
      )}
    </div>
  );
};
