import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";

import { useAuth } from "../../components/context/AuthContext.jsx";
import { getHostBookings, getHostProperties } from "../../api/host.js";

export default function HostEarnings() {
  const { user, token } = useAuth();
  const toast = useToast();

  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Niet-hosts blokkeren
  if (user && !user.isHost) {
    window.location.href = "/profile";
    return null;
  }

  async function fetchData() {
    try {
      const [bookingsData, propertiesData] = await Promise.all([
        getHostBookings(token),
        getHostProperties(token),
      ]);

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setProperties(Array.isArray(propertiesData) ? propertiesData : []);
    } catch (err) {
      toast({
        title: "Fout bij ophalen",
        description: "Kon earnings data niet laden.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <HStack>
        <Spinner />
        <Text>Gegevens laden...</Text>
      </HStack>
    );
  }

  // Earnings berekeningen
  const totalEarnings = bookings.reduce(
    (sum, b) => sum + (b.totalPrice || 0),
    0
  );

  const totalBookings = bookings.length;
  const totalProperties = properties.length;

  // Earnings per property
  const earningsByProperty = properties.map((property) => {
    const propertyBookings = bookings.filter(
      (b) => b.propertyId === property.id
    );

    const earnings = propertyBookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0
    );

    return {
      id: property.id,
      title: property.title,
      bookings: propertyBookings.length,
      earnings,
    };
  });

  return (
    <Box maxW="900px" mx="auto" mt={10} px={4}>
      <Heading size="lg" mb={6}>
        Verdiensten Overzicht
      </Heading>

      <SimpleGrid columns={[1, 3]} spacing={6} mb={10}>
        <Stat p={4} borderWidth="1px" borderRadius="lg">
          <StatLabel>Totaal verdiend</StatLabel>
          <StatNumber>€ {totalEarnings}</StatNumber>
          <StatHelpText>Alle boekingen</StatHelpText>
        </Stat>

        <Stat p={4} borderWidth="1px" borderRadius="lg">
          <StatLabel>Aantal boekingen</StatLabel>
          <StatNumber>{totalBookings}</StatNumber>
          <StatHelpText>Op jouw properties</StatHelpText>
        </Stat>

        <Stat p={4} borderWidth="1px" borderRadius="lg">
          <StatLabel>Aantal properties</StatLabel>
          <StatNumber>{totalProperties}</StatNumber>
          <StatHelpText>Actief in jouw account</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Divider mb={8} />

      <Heading size="md" mb={4}>
        Verdiensten per accommodatie
      </Heading>

      <VStack align="stretch" spacing={4}>
        {earningsByProperty.map((p) => (
          <Box
            key={p.id}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            _hover={{ boxShadow: "md" }}
          >
            <Heading size="sm" mb={2}>
              {p.title}
            </Heading>

            <Text>
              <strong>Boekingen:</strong> {p.bookings}
            </Text>

            <Text>
              <strong>Verdiensten:</strong> € {p.earnings}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
