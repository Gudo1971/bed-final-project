// ==============================================
// = HOST EARNINGS PAGE                          =
// = Overzicht van inkomsten voor de host        =
// ==============================================

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Alert,
  AlertIcon,
  SimpleGrid,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

import { useAuth } from "../../components/context/AuthContext.jsx";
import EarningsChart from "../../components/earnings/EarningsChart.jsx";

export default function HostEarningsPage() {
  // ==============================================
  // = AUTH + STATE                               =
  // ==============================================
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================================
  // = FIX: ALLE HOOKS BOVENAAN                   =
  // ==============================================
  const introColor = useColorModeValue("gray.600", "gray.300");
  const statBg = useColorModeValue("gray.50", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");

  // ==============================================
  // = DATA OPHALEN                               =
  // ==============================================
  useEffect(() => {
    async function fetchEarnings() {
      try {
        const res = await fetch(
          `http://localhost:3000/api/hosts/${user.hostId}/earnings`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

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

  // ==============================================
  // = LOADING STATE                              =
  // ==============================================
  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  // ==============================================
  // = ERROR STATE                                =
  // ==============================================
  if (!data) {
    return (
      <Alert status="error" mt={10}>
        <AlertIcon />
        Kon verdiensten niet laden.
      </Alert>
    );
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box maxW="900px" mx="auto" mt={10} px={4}>
      {/* ============================================== */}
      {/* = TERUG NAAR DASHBOARD                        = */}
      {/* ============================================== */}
      <Button
        as="a"
        href="/host/dashboard"
        variant="ghost"
        colorScheme="teal"
        size="sm"
        mb={4}
      >
        ← Terug naar dashboard
      </Button>

      {/* ============================================== */}
      {/* = TITEL + INTRO                               = */}
      {/* ============================================== */}
      <Heading size="lg" mb={2} textAlign={{ base: "center", sm: "left" }}>
        Verdiensten
      </Heading>

      <Text
        fontSize="lg"
        mb={6}
        textAlign={{ base: "center", sm: "left" }}
        color={introColor}
      >
        Overzicht van je inkomsten en prestaties als host.
      </Text>

      <Divider mb={8} />

      {/* ============================================== */}
      {/* = TOTALE STATISTIEKEN (RESPONSIVE GRID)       = */}
      {/* ============================================== */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={6}
        mb={10}
      >
        <Stat p={4} borderWidth="1px" borderRadius="lg" bg={statBg}>
          <StatLabel>Verdiend tot nu toe</StatLabel>
          <StatNumber>
            € {(data.totalEarningsToDate ?? 0).toFixed(2)}
          </StatNumber>
          <StatHelpText>Afgeronde verblijven</StatHelpText>
        </Stat>

        <Stat p={4} borderWidth="1px" borderRadius="lg" bg={statBg}>
          <StatLabel>Verwachte inkomsten</StatLabel>
          <StatNumber>
            € {(data.expectedEarnings ?? 0).toFixed(2)}
          </StatNumber>
          <StatHelpText>Inclusief toekomstige boekingen</StatHelpText>
        </Stat>

        <Stat p={4} borderWidth="1px" borderRadius="lg" bg={statBg}>
          <StatLabel>Totaal boekingen</StatLabel>
          <StatNumber>{data.totalBookings ?? 0}</StatNumber>
          <StatHelpText>Alle accommodaties</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Divider mb={8} />

      {/* ============================================== */}
      {/* = VERDIENSTEN PER ACCOMMODATIE (CHART)        = */}
      {/* ============================================== */}
      <Heading size="md" mb={4} textAlign={{ base: "center", sm: "left" }}>
        Verdiensten per accommodatie
      </Heading>

      <EarningsChart properties={data.properties} />

      <Divider my={8} />

      {/* ============================================== */}
      {/* = PROPERTY CARDS                              = */}
      {/* ============================================== */}
      <VStack align="stretch" spacing={4}>
        {data.properties.map((p) => (
          <Box
            key={p.propertyId}
            p={5}
            borderWidth="1px"
            borderRadius="lg"
            bg={cardBg}
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            <Heading
              size="sm"
              mb={2}
              textAlign={{ base: "center", sm: "left" }}
            >
              {p.title}
            </Heading>

            <VStack
              align={{ base: "center", sm: "start" }}
              spacing={1}
              fontSize="sm"
              textAlign={{ base: "center", sm: "left" }}
            >
              <Text>Afgeronde boekingen: {p.bookingsCompleted}</Text>
              <Text>Toekomstige boekingen: {p.bookingsUpcoming}</Text>
              <Text>Verdiend: € {(p.earningsToDate ?? 0).toFixed(2)}</Text>
              <Text>Verwacht: € {(p.expectedEarnings ?? 0).toFixed(2)}</Text>
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
