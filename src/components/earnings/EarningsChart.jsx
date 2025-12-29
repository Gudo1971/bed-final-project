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
  Legend,
  CartesianGrid,
} from "recharts";

import { useColorModeValue } from "@chakra-ui/react";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function EarningsChart({ properties }) {
  // ==============================================
  // = DARK MODE COLORS                           =
  // ==============================================
  const earnedColor = useColorModeValue("#2B6CB0", "#63B3ED"); // blue.600 / blue.300
  const expectedColor = useColorModeValue("#68D391", "#9AE6B4"); // green.400 / green.200
  const axisColor = useColorModeValue("#2D3748", "#E2E8F0"); // gray.700 / gray.200
  const gridColor = useColorModeValue("#CBD5E0", "#4A5568"); // gray.300 / gray.600

  // ==============================================
  // = CHART DATA                                 =
  // ==============================================
  const chartData = properties.map((p) => ({
    name: p.title.length > 20 ? p.title.slice(0, 20) + "…" : p.title,
    earned: p.earningsToDate ?? 0,
    expected: p.expectedEarnings ?? 0,
  }));

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />

        <XAxis
          dataKey="name"
          stroke={axisColor}
          tick={{ fill: axisColor, fontSize: 12 }}
        />

        <YAxis
          stroke={axisColor}
          tick={{ fill: axisColor, fontSize: 12 }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: useColorModeValue("#ffffff", "#1A202C"),
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
          labelStyle={{ fontWeight: "bold" }}
        />

        <Legend />

        <Bar
          dataKey="earned"
          fill={earnedColor}
          name="Verdiend"
          radius={[4, 4, 0, 0]}
        />

        <Bar
          dataKey="expected"
          fill={expectedColor}
          name="Verwacht"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
