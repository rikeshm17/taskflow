interface ProductivityStatsProps {
  highPriority: number;
  overdue: number;
  completionRate: number;
}

function ProductivityStats({
  highPriority,
  overdue,
  completionRate,
}: ProductivityStatsProps) {
  return (
    <section className="productivity">
      <div className="productivity-card">
        <h3>🔥 High Priority</h3>
        <h2>{highPriority}</h2>
      </div>

      <div className="productivity-card">
        <h3>⚠️ Overdue</h3>
        <h2>{overdue}</h2>
      </div>

      <div className="productivity-card">
        <h3>📈 Completion Rate</h3>
        <h2>{completionRate}%</h2>
      </div>
    </section>
  );
}

export default ProductivityStats;