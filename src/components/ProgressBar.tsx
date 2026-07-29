interface ProgressBarProps {
  completed: number;
  total: number;
}

function ProgressBar({ completed, total }: ProgressBarProps) {
  return (
    <section className="progress-section">
      <div className="progress-header">
        <h2>Task Progress</h2>

        <span>
          {completed} / {total} Completed
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width:
              total === 0
                ? "0%"
                : `${(completed / total) * 100}%`,
          }}
        ></div>
      </div>

      <p className="progress-text">
        {total === 0
          ? "0%"
          : `${Math.round(
              (completed / total) * 100
            )}% Complete`}
      </p>
    </section>
  );
}

export default ProgressBar;
