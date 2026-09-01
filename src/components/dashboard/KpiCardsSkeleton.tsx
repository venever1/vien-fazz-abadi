export const KpiCardsSkeleton = () => {
  const cards = [0, 1, 2, 3];

  return (
    <section className="kpi-grid" aria-label="Memuat ringkasan keuangan" aria-busy="true">
      {cards.map((index) => (
        <div className="kpi-card kpi-card--skeleton" key={index}>
          <span className="skeleton skeleton--label" />
          <span className="skeleton skeleton--value" />
          <span className="skeleton skeleton--hint" />
        </div>
      ))}
    </section>
  );
};