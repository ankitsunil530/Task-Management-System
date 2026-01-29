import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PriorityBarChart({ data }) {
  const chartData = [
    { name: "Low", value: data.low || 0 },
    { name: "Medium", value: data.medium || 0 },
    { name: "High", value: data.high || 0 },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm text-gray-300 mb-3">Task Priority</h3>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
