import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#facc15", "#22c55e"];

export default function StatusPieChart({ data }) {
  const chartData = [
    { name: "Todo", value: data.todo || 0 },
    { name: "In Progress", value: data["in-progress"] || 0 },
    { name: "Done", value: data.done || 0 },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm text-gray-300 mb-3">Task Status</h3>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
