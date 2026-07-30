import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Task } from "../../types/task";

interface Props {
  tasks: Task[];
}

const COLORS = [
  "#FC563C",
  "#172A39",
  "#6E7575",
  "#6BCB77",
  "#FFD93D",
  "#845EC2",
];

function CategoryChart({ tasks }: Props) {
  const categories = [
    "Work",
    "Study",
    "Personal",
    "Fitness",
    "Shopping",
    "Other",
  ];

  const data = categories.map((category) => ({
    name: category,
    value: tasks.filter((t) => t.category === category).length,
  }));

  return (
    <div className="chart-card">
      <h2>Tasks by Category</h2>

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
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;