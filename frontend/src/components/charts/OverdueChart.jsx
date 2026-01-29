import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function OverdueChart({ overdue, completed }) {
  const chartData = [
    { name: "Overdue", value: overdue },
    { name: "Completed", value: completed },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm text-gray-300 mb-3">Overdue vs Completed</h3>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <Tooltip />
          <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
