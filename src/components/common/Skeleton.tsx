import type { CSSProperties } from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'text-short' | 'bar' | 'avatar' | 'label' | 'value' | 'hint';
  width?: string;
  height?: string;
  className?: string;
  style?: CSSProperties;
}

const VARIANT_DEFAULTS: Record<string, { width: string; height: string }> = {
  text: { width: '100%', height: '13px' },
  'text-short': { width: '60%', height: '13px' },
  bar: { width: '100%', height: '8px' },
  avatar: { width: '32px', height: '32px' },
  label: { width: '45%', height: '12px' },
  value: { width: '70%', height: '26px' },
  hint: { width: '55%', height: '12px' },
};

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  style: overrideStyle,
}: SkeletonProps) => {
  const defaults = VARIANT_DEFAULTS[variant] || VARIANT_DEFAULTS.text;
  const style = {
    width: width || defaults.width,
    height: height || defaults.height,
    borderRadius: variant === 'avatar' ? '50%' : variant === 'bar' ? '999px' : '4px',
    ...overrideStyle,
  };

  return (
    <span
      className={['skeleton', `skeleton--${variant}`, className].filter(Boolean).join(' ')}
      style={style}
      aria-hidden="true"
    />
  );
};

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const TableSkeleton = ({ rows = 5, columns = 5 }: TableSkeletonProps) => {
  return (
    <div role="status" aria-label="Memuat data tabel" aria-busy="true">
      {Array.from({ length: rows }).map((_, r) => (
        <div className="table-skeleton-row" key={r}>
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton
              key={c}
              variant={c === 0 ? 'text' : 'text-short'}
              width={c === 0 ? '25%' : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
