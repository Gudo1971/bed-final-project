import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  useToast,
  Skeleton,
  Button,
} from "@chakra-ui/react";

import { useAuth } from "../../components/context/AuthContext.jsx";
import {
  getHostBookings,
  confirmBooking,
  rejectBooking,
} from "../../api/host.js";

export default function HostBookings() {
  const { user, token } = useAuth();
  const toast = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Sort & Filter state
  const [sortBy, setSortBy] = useState("date");
  const [filter, setFilter] = useState("all");

  // Niet-hosts blokkeren
  if (user && !user.isHost) {
    window.location.href = "/profile";
    return null;
  }

  async function fetchBookings() {
    try {
      const data = await getHostBookings(token);
      const list = Array.isArray(data) ? data : [];
      setBookings(list);
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

  // ⭐ FILTER LOGICA
  const now = new Date();

  const filteredBookings = bookings.filter((booking) => {
    const end = new Date(booking.endDate);

    if (filter === "future") return end >= now;
    if (filter === "past") return end < now;
    if (filter === "hidePast") return end >= now;

    return true; // "all"
  });

  // ⭐ SORTEER LOGICA
  const sortedBookings = [...filteredBookings].sort((a, b) => {
  // 1. PENDING altijd bovenaan
  if (a.bookingStatus === "PENDING" && b.bookingStatus !== "PENDING") return -1;
  if (b.bookingStatus === "PENDING" && a.bookingStatus !== "PENDING") return 1;

  // 2. CONFIRMED sorteren op check-in datum
  if (a.bookingStatus === "CONFIRMED" && b.bookingStatus === "CONFIRMED") {
    return new Date(a.startDate) - new Date(b.startDate);
  }

  // 3. CANCELLED onderaan
  if (a.bookingStatus === "CANCELLED" && b.bookingStatus !== "CANCELLED") return 1;
  if (b.bookingStatus === "CANCELLED" && a.bookingStatus !== "CANCELLED") return -1;

  return 0;
});



  // ⭐ HANDLERS: Confirm / Reject
  async function handleConfirm(id) {
    try {
      await confirmBooking(id, token);
      fetchBookings();
      toast({
        title: "Boeking bevestigd",
        status: "success",
        duration: 2000,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Fout bij bevestigen",
        status: "error",
        duration: 2000,
      });
    }
  }

  async function handleReject(id) {
    try {
      await rejectBooking(id, token);
      fetchBookings();
      toast({
        title: "Boeking afgewezen",
        status: "info",
        duration: 2000,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Fout bij afwijzen",
        status: "error",
        duration: 2000,
      });
    }
  }

  if (loading) {
    return (
      <VStack align="stretch" spacing={4}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height="120px" borderRadius="md" />
        ))}
      </VStack>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>
        Mijn Boekingen
      </Heading>

      {/* ⭐ FILTER KNOPPEN */}
      <HStack mb={4} spacing={4}>
        <Button
          variant={filter === "all" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setFilter("all")}
        >
          Alles
        </Button>

        <Button
          variant={filter === "future" ? "solid" : "outline"}
          colorScheme="green"
          onClick={() => setFilter("future")}
        >
          Toekomstig
        </Button>

        <Button
          variant={filter === "past" ? "solid" : "outline"}
          colorScheme="orange"
          onClick={() => setFilter("past")}
        >
          Afgelopen
        </Button>

        <Button
          variant={filter === "hidePast" ? "solid" : "outline"}
          colorScheme="red"
          onClick={() => setFilter("hidePast")}
        >
          Verberg afgelopen
        </Button>
      </HStack>

      {/* ⭐ SORTEER KNOPPEN */}
      <HStack mb={6} spacing={4}>
        <Button
          variant={sortBy === "date" ? "solid" : "outline"}
          colorScheme="purple"
          onClick={() => setSortBy("date")}
        >
          Sorteer op check-in datum
        </Button>

        <Button
          variant={sortBy === "property" ? "solid" : "outline"}
          colorScheme="purple"
          onClick={() => setSortBy("property")}
        >
          Sorteer op accommodatie
        </Button>
      </HStack>

      {/* ⭐ GEEN BOEKINGEN */}
      {sortedBookings.length === 0 && (
        <Box
          p={6}
          border="1px solid #ddd"
          borderRadius="md"
          textAlign="center"
          color="gray.600"
        >
          <Text fontSize="lg">Geen boekingen gevonden met deze filters.</Text>
        </Box>
      )}

      {/* ⭐ BOEKINGEN LIJST */}
      <VStack align="stretch" spacing={4}>
        {sortedBookings.map((booking) => {
          const start = new Date(booking.startDate).toLocaleDateString();
          const end = new Date(booking.endDate).toLocaleDateString();

          return (
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

                <Badge
                  colorScheme={
                    booking.bookingStatus === "CANCELLED"
                      ? "red"
                      : booking.bookingStatus === "PENDING"
                      ? "yellow"
                      : "green"
                  }
                >
                  {booking.bookingStatus}
                </Badge>
              </HStack>

              <Divider my={2} />

              <Text>
                <strong>Gast:</strong> {booking.user?.name || "Anonieme gast"}
              </Text>

              <Text>
                <strong>Check-in:</strong> {start}
              </Text>

              <Text>
                <strong>Check-out:</strong> {end}
              </Text>

              <Text mt={2} fontWeight="bold">
                Totaal: € {booking.totalPrice}
              </Text>

              {/* ⭐ ACTIE KNOPPEN VOOR PENDING */}
              {booking.bookingStatus === "PENDING" && (
                <HStack mt={3}>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleConfirm(booking.id)}
                  >
                    Accepteren
                  </Button>

                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleReject(booking.id)}
                  >
                    Afwijzen
                  </Button>
                </HStack>
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
