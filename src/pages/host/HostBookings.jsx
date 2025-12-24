import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  Badge,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { getHostBookings } from "../../api/host.js";

export default function HostBookings() {
  const { getAccessTokenSilently } = useAuth0();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  async function fetchBookings() {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://staybnb.gudo.dev/api",
        },
      });

      const data = await getHostBookings(token);
      setBookings(data);
    } catch (err) {
      console.error(err);

      toast({
        title: "Fout bij ophalen",
        description: "Kon jouw boekingen niet laden.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <HStack>
        <Spinner />
        <Text>Boekingen laden...</Text>
      </HStack>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Mijn Boekingen
      </Heading>

      {bookings.length === 0 && (
        <Text>Er zijn nog geen boekingen op jouw properties.</Text>
      )}

      <VStack align="stretch" spacing={4}>
        {bookings.map((booking) => (
          <Box
            key={booking.id}
            border="1px solid #ddd"
            borderRadius="md"
            p={4}
            _hover={{ boxShadow: "md" }}
          >
            <HStack justify="space-between">
              <Heading size="sm">
                {booking.property?.title || "Onbekende property"}
              </Heading>

              <Badge colorScheme="blue">
                {booking.status || "Bevestigd"}
              </Badge>
            </HStack>

            <Divider my={2} />

            <Text>
              <strong>Gast:</strong> {booking.user?.name || "Anonieme gast"}
            </Text>

            <Text>
              <strong>Check-in:</strong>{" "}
              {new Date(booking.startDate).toLocaleDateString()}
            </Text>

            <Text>
              <strong>Check-out:</strong>{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </Text>

            <Text mt={2} fontWeight="bold">
              Totaal: € {booking.totalPrice}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
