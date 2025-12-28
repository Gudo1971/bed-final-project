import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useAuth } from "../../components/context/AuthContext.jsx";
import EarningsChart from "../../components/earnings/EarningsChart.jsx";

export default function HostEarningsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch(`/hosts/${user.hostId}/earnings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching earnings:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.hostId) {
      fetchEarnings();
    }
  }, [user]);

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!data) {
    return (
      <Alert status="error" mt={10}>
        <AlertIcon />
        Kon verdiensten niet laden.
      </Alert>
    );
  }

  return (
    <Box maxW="900px" mx="auto" mt={10} px={4}>
      <Heading size="lg" mb={4}>
        Verdiensten
      </Heading>

      <Text fontSize="lg" mb={6}>
        Overzicht van je inkomsten en prestaties als host.
      </Text>

      <Divider mb={8} />

      {/* Totale statistieken */}
      <HStack spacing={10} mb={10}>
        <Stat>
          <StatLabel>Verdiend tot nu toe</StatLabel>
          <StatNumber>
            € {(data.totalEarningsToDate ?? 0).toFixed(2)}
          </StatNumber>
          <StatHelpText>Afgeronde verblijven</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Verwachte inkomsten</StatLabel>
          <StatNumber>
            € {(data.expectedEarnings ?? 0).toFixed(2)}
          </StatNumber>
          <StatHelpText>Inclusief toekomstige boekingen</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Totaal boekingen</StatLabel>
          <StatNumber>{data.totalBookings ?? 0}</StatNumber>
          <StatHelpText>Alle accommodaties</StatHelpText>
        </Stat>
      </HStack>

      <Divider mb={8} />

      {/* Earnings Chart */}
      <Heading size="md" mb={4}>
        Verdiensten per accommodatie
      </Heading>

      <EarningsChart properties={data.properties} />

      <Divider my={8} />

      {/* Earnings per property cards */}
      <VStack align="stretch" spacing={4}>
        {data.properties.map((p) => (
          <Box
            key={p.propertyId}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
          >
            <Heading size="sm">{p.title}</Heading>

            <Text>Afgeronde boekingen: {p.bookingsCompleted}</Text>
            <Text>Toekomstige boekingen: {p.bookingsUpcoming}</Text>

            <Text>
              Verdiend: € {(p.earningsToDate ?? 0).toFixed(2)}
            </Text>

            <Text>
              Verwacht: € {(p.expectedEarnings ?? 0).toFixed(2)}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
