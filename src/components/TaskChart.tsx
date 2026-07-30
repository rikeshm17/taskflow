import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TaskChartProps {
  completed: number;
  pending: number;
  loading?: boolean;
}

function TaskChart({
  completed,
  pending,
  loading = false,
}: TaskChartProps) {

  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  const COLORS = ["#FC563C", "#172A39"];

  return (
    <section className="chart-card">
      <h2>Task Completion</h2>

      {loading ? (
        <div className="skeleton" style={{ height: 320 }} />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={110}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

export default TaskChart;
