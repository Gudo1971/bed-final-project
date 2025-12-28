// ==============================================
// = EARNINGS CHART                              =
// = Verdiend vs verwacht per accommodatie       =
// ==============================================

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function EarningsChart({ properties }) {
  // ==============================================
  // = CHART DATA                                 =
  // ==============================================
  const chartData = properties.map((p) => ({
    name: p.title,
    earned: p.earningsToDate ?? 0,
    expected: p.expectedEarnings ?? 0,
  }));

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />

        <Bar dataKey="earned" fill="#3182CE" name="Verdiend" />
        <Bar dataKey="expected" fill="#63B3ED" name="Verwacht" />
      </BarChart>
    </ResponsiveContainer>
  );
}
