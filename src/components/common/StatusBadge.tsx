import type { PaymentStatus } from '../../types';

interface StatusBadgeProps {
  status: PaymentStatus;
}

const BADGE_MAP: Record<PaymentStatus, { variant: string; label: string }> = {
  'Belum Bayar': { variant: 'danger', label: 'Belum Bayar' },
  Cicilan: { variant: 'amber', label: 'Cicilan' },
  Lunas: { variant: 'ok', label: 'Lunas' },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = BADGE_MAP[status] ?? { variant: 'muted', label: status };

  return (
    <span className={`badge badge--${config.variant}`}>
      <span className="badge__dot" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
};
