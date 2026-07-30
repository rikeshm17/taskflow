interface StatsCardProps {
  total: number;
  completed: number;
  pending: number;
  loading?: boolean;
}

function StatsCard({ total, completed, pending, loading = false }: StatsCardProps) {
  return (
    <section className="cards">
      <div className="card">
        <h2>Total Tasks</h2>
        {loading ? (
          <div className="skeleton skeleton-number" />
        ) : (
          <div className="number">{total}</div>
        )}
      </div>

      <div className="card">
        <h2>Completed</h2>
        {loading ? (
          <div className="skeleton skeleton-number" />
        ) : (
          <div className="number">{completed}</div>
        )}
      </div>

      <div className="card">
        <h2>Pending</h2>
        {loading ? (
          <div className="skeleton skeleton-number" />
        ) : (
          <div className="number">{pending}</div>
        )}
      </div>
    </section>
  );
}

export default StatsCard;
