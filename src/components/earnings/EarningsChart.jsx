// ==============================================
// = EARNINGS CHART (SHOWCASE VERSION)           =
// = - Stacked bar chart                         =
// = - Monthly line chart                        =
// = - Leaderboard                               =
// = - Toggle views                              =
// = - Color gradients                           =
// ==============================================

import { useMemo, useState } from "react";
import {
  Box,
  ButtonGroup,
  Button,
  Heading,
  VStack,
  Text,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function EarningsChart({ properties }) {
  const [view, setView] = useState("property"); // "property" | "monthly"

  // ==============================================
  // = KLEUREN                                    =
  // ==============================================
  const earnedColor = useColorModeValue("#3182CE", "#63B3ED"); // blauw
  const expectedColor = useColorModeValue("#38A169", "#68D391"); // groen

  // ==============================================
  // = PROPERTY DATA (STACKED BAR CHART)          =
  // ==============================================
  const propertyData = useMemo(() => {
    return properties.map((p) => ({
      name: p.title,
      earned: p.earningsToDate,
      expected: p.expectedEarnings - p.earningsToDate,
      total: p.expectedEarnings,
    }));
  }, [properties]);

  // ==============================================
  // = MONTHLY DATA (LINE CHART)                  =
  // ==============================================
  const monthlyData = useMemo(() => {
    const map = {};

    properties.forEach((p) => {
      // We hebben geen individuele boekingen hier,
      // maar earningsToDate en expectedEarnings zijn genoeg
      // om een simpele verdeling te maken.
      // Voor een echte breakdown zou je bookings moeten meegeven.
      const earned = p.earningsToDate;
      const expected = p.expectedEarnings;

      const now = new Date();
      const currentMonth = now.getMonth();

      // Verdeel earnings over 12 maanden (demo)
      for (let i = 0; i < 12; i++) {
        const monthName = new Date(2025, i, 1).toLocaleString("nl-NL", {
          month: "short",
        });

        if (!map[monthName]) {
          map[monthName] = { month: monthName, earned: 0, expected: 0 };
        }

        // Simpele verdeling: earned in eerste helft, expected in tweede helft
        if (i <= currentMonth) {
          map[monthName].earned += earned / (currentMonth + 1);
        } else {
          map[monthName].expected += expected / (12 - currentMonth);
        }
      }
    });

    return Object.values(map);
  }, [properties]);

  // ==============================================
  // = LEADERBOARD                                =
  // ==============================================
  const leaderboard = useMemo(() => {
    return [...properties]
      .sort((a, b) => b.expectedEarnings - a.expectedEarnings)
      .slice(0, 3);
  }, [properties]);

  // ==============================================
  // = TOOLTIP                                    =
  // ==============================================
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <Box p={3} bg="gray.700" color="white" borderRadius="md">
        <Text fontWeight="bold">{label}</Text>
        {payload.map((p, i) => (
          <Text key={i}>
            {p.name}: €{p.value.toFixed(2)}
          </Text>
        ))}
      </Box>
    );
  };

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <VStack spacing={8} w="100%">
      {/* Toggle */}
      <ButtonGroup>
        <Button
          onClick={() => setView("property")}
          colorScheme={view === "property" ? "teal" : "gray"}
        >
          Per accommodatie
        </Button>
        <Button
          onClick={() => setView("monthly")}
          colorScheme={view === "monthly" ? "teal" : "gray"}
        >
          Per maand
        </Button>
      </ButtonGroup>

      {/* Chart */}
      <Box w="100%" h="350px">
        {view === "property" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={propertyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="earned" stackId="a" fill={earnedColor} />
              <Bar dataKey="expected" stackId="a" fill={expectedColor} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {view === "monthly" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="earned"
                stroke={earnedColor}
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="expected"
                stroke={expectedColor}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>

      {/* Leaderboard */}
      <Box w="100%">
        <Heading size="md" mb={3}>
          Top 3 best presterende accommodaties
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {leaderboard.map((p, i) => (
            <Box
              key={p.propertyId}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={useColorModeValue("gray.50", "gray.800")}
            >
              <Text fontSize="lg" fontWeight="bold">
                {["🥇", "🥈", "🥉"][i]} {p.title}
              </Text>
              <Text>Verwacht: €{p.expectedEarnings.toFixed(2)}</Text>
              <Text>Verdiend: €{p.earningsToDate.toFixed(2)}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
