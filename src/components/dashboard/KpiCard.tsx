export type KpiAccent = 'ok' | 'danger' | 'amber' | 'teal';

interface KpiCardProps {
  label: string;
  value: string;
  hint: string;
  accent: KpiAccent;
}

export const KpiCard = ({ label, value, hint, accent }: KpiCardProps) => {
  return (
    <article className={`kpi-card kpi-card--${accent}`}>
      <p className="kpi-card__label">{label}</p>
      <p className="kpi-card__value">{value}</p>
      <p className="kpi-card__hint">{hint}</p>
    </article>
  );
};