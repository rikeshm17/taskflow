import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Task } from "../../types/task";

interface Props {
  tasks: Task[];
  title?: string;
}

const COLORS = {
  Urgent: "#EF4444",
  High: "#FC563C",
  Medium: "#997A80",
  Low: "#A4B5C3",
};

function PriorityChart({ tasks, title = "Tasks by Priority" }: Props) {
  const priorities = ["Urgent", "High", "Medium", "Low"];

  const data = priorities
    .map((priority) => ({
      name: priority,
      value: tasks.filter((t) => t.priority === priority).length,
    }))
    .filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h2>{title}</h2>
        <div className="chart-empty">
          <p>No priority data available yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h2>{title}</h2>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={true}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name as keyof typeof COLORS] || "#FC563C"}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth={2}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--glass-border)",
              borderRadius: "12px",
              boxShadow: "var(--glass-shadow)",
            }}
            labelStyle={{ color: "var(--text)", fontWeight: 600 }}
          />

          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => (
              <span style={{ color: "var(--text)", fontSize: "13px", fontWeight: 500 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriorityChart;
