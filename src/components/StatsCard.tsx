interface StatsCardProps {
  total: number;
  completed: number;
  pending: number;
}

function StatsCard({ total, completed, pending }: StatsCardProps) {
  return (
    <section className="cards">
      <div className="card">
        <h2>Total Tasks</h2>
        <div className="number">{total}</div>
      </div>

      <div className="card">
        <h2>Completed</h2>
        <div className="number">{completed}</div>
      </div>

      <div className="card">
        <h2>Pending</h2>
        <div className="number">{pending}</div>
      </div>
    </section>
  );
}

export default StatsCard;
