// features/admin/components/Analytics.jsx

import { PieChart, Pie, Cell } from "recharts";
import { getTicketStats } from "../utils/analytics";

const COLORS = ["#facc15", "#22c55e"];

const Analytics = ({ tickets }) => {
  const stats = getTicketStats(tickets);

  const data = [
    { name: "Open", value: stats.open },
    { name: "Closed", value: stats.closed },
  ];

  return (
    <div className="bg-white p-4 rounded shadow">
      <PieChart width={300} height={200}>
        <Pie data={data} dataKey="value">
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};

export default Analytics;