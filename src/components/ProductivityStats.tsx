interface ProductivityStatsProps {
  highPriority: number;
  overdue: number;
  completionRate: number;
  loading?: boolean;
}

function ProductivityStats({
  highPriority,
  overdue,
  completionRate,
  loading = false,
}: ProductivityStatsProps) {
  return (
    <section className="productivity">
      <div className="productivity-card">
        <h3>High + Urgent</h3>
        {loading ? (
          <div className="skeleton skeleton-number" />
        ) : (
          <h2>{highPriority}</h2>
        )}
      </div>

      <div className="productivity-card">
        <h3>⚠️ Overdue</h3>
        {loading ? (
          <div className="skeleton skeleton-number" />
        ) : (
          <h2>{overdue}</h2>
        )}
      </div>

      <div className="productivity-card">
        <h3>📈 Completion Rate</h3>
        {loading ? (
          <div className="skeleton skeleton-number" />
        ) : (
          <h2>{completionRate}%</h2>
        )}
      </div>
    </section>
  );
}

export default ProductivityStats;