// ==============================================
// = HOST BOOKINGS PAGE                          =
// = Overzicht + beheer van boekingen voor host  =
// ==============================================

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
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { useAuth } from "../../components/context/AuthContext.jsx";
import {
  getHostBookings,
  confirmBooking,
  rejectBooking,
} from "../../api/host.js";

export default function HostBookings() {
  // ==============================================
  // = AUTH + TOAST                               =
  // ==============================================
  const { user, token } = useAuth();
  const toast = useToast();

  // ==============================================
  // = STATE BLOKKEN                              =
  // ==============================================
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("date");
  const [filter, setFilter] = useState("all");

  // ==============================================
  // = REDIRECT ALS USER GEEN HOST IS (HOOK SAFE) =
  // ==============================================
  useEffect(() => {
    if (user && !user.isHost) {
      window.location.href = "/profile";
    }
  }, [user]);

  // ==============================================
  // = BOEKINGEN OPHALEN                           =
  // ==============================================
  async function fetchBookings() {
    try {
      const data = await getHostBookings(token);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);

      toast({
        title: "Fout bij ophalen",
        description: "Kon jouw boekingen niet laden.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  // ==============================================
  // = FILTER LOGICA                               =
  // ==============================================
  const now = new Date();

  const filteredBookings = bookings.filter((booking) => {
    const end = new Date(booking.endDate);

    if (filter === "future") return end >= now;
    if (filter === "past") return end < now;
    if (filter === "hidePast") return end >= now;

    return true;
  });

  // ==============================================
  // = SORTEER LOGICA                              =
  // ==============================================
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (a.bookingStatus === "PENDING" && b.bookingStatus !== "PENDING") return -1;
    if (b.bookingStatus === "PENDING" && a.bookingStatus !== "PENDING") return 1;

    if (a.bookingStatus === "CONFIRMED" && b.bookingStatus === "CONFIRMED") {
      return new Date(a.startDate) - new Date(b.startDate);
    }

    if (a.bookingStatus === "CANCELLED" && b.bookingStatus !== "CANCELLED") return 1;
    if (b.bookingStatus === "CANCELLED" && a.bookingStatus !== "CANCELLED") return -1;

    return 0;
  });

  // ==============================================
  // = HANDLERS: CONFIRM / REJECT                  =
  // ==============================================
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
      toast({
        title: "Fout bij afwijzen",
        status: "error",
        duration: 2000,
      });
    }
  }

  // ==============================================
  // = LOADING STATE                               =
  // ==============================================
  if (loading) {
    return (
      <VStack align="stretch" spacing={4}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height="140px" borderRadius="md" />
        ))}
      </VStack>
    );
  }

  // ==============================================
  // = RENDER GUARD (HOOK SAFE)                    =
  // ==============================================
  if (user && !user.isHost) {
    return null;
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box>

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
      {/* = TITEL                                       = */}
      {/* ============================================== */}
      <Heading size="lg" mb={6} textAlign={{ base: "center", sm: "left" }}>
        Mijn Boekingen
      </Heading>

      {/* ============================================== */}
      {/* = FILTER KNOPPEN                              = */}
      {/* ============================================== */}
      <Stack
        direction={{ base: "column", sm: "row" }}
        spacing={3}
        mb={4}
        flexWrap="wrap"
        justify={{ base: "center", sm: "flex-start" }}
      >
        <Button
          variant={filter === "all" ? "solid" : "outline"}
          colorScheme="blue"
          width={{ base: "100%", sm: "auto" }}
          onClick={() => setFilter("all")}
        >
          Alles
        </Button>

        <Button
          variant={filter === "future" ? "solid" : "outline"}
          colorScheme="green"
          width={{ base: "100%", sm: "auto" }}
          onClick={() => setFilter("future")}
        >
          Toekomstig
        </Button>

        <Button
          variant={filter === "past" ? "solid" : "outline"}
          colorScheme="orange"
          width={{ base: "100%", sm: "auto" }}
          onClick={() => setFilter("past")}
        >
          Afgelopen
        </Button>

        <Button
          variant={filter === "hidePast" ? "solid" : "outline"}
          colorScheme="red"
          width={{ base: "100%", sm: "auto" }}
          onClick={() => setFilter("hidePast")}
        >
          Verberg afgelopen
        </Button>
      </Stack>

      {/* ============================================== */}
      {/* = SORTEER KNOPPEN                             = */}
      {/* ============================================== */}
      <Stack
        direction={{ base: "column", sm: "row" }}
        spacing={3}
        mb={6}
        flexWrap="wrap"
        justify={{ base: "center", sm: "flex-start" }}
      >
        <Button
          variant={sortBy === "date" ? "solid" : "outline"}
          colorScheme="purple"
          width={{ base: "100%", sm: "auto" }}
          onClick={() => setSortBy("date")}
        >
          Sorteer op check-in datum
        </Button>

        <Button
          variant={sortBy === "property" ? "solid" : "outline"}
          colorScheme="purple"
          width={{ base: "100%", sm: "auto" }}
          onClick={() => setSortBy("property")}
        >
          Sorteer op accommodatie
        </Button>
      </Stack>

      {/* ============================================== */}
      {/* = GEEN BOEKINGEN                              = */}
      {/* ============================================== */}
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

      {/* ============================================== */}
      {/* = BOEKINGEN LIJST                             = */}
      {/* ============================================== */}
      <VStack align="stretch" spacing={5}>
        {sortedBookings.map((booking) => {
          const imageUrl =
            booking?.property?.images?.[0]?.url ??
            "https://placehold.co/400x250?text=Geen+afbeelding";

          return (
            <Box
              key={booking.id}
              border="1px solid"
              borderColor={useColorModeValue("gray.300", "gray.600")}
              borderRadius="lg"
              p={{ base: 4, md: 5 }}
              bg={useColorModeValue("white", "gray.800")}
              boxShadow="sm"
              _hover={{ boxShadow: "md", transform: "translateY(-3px)" }}
              transition="all 0.2s ease"
            >
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={4}
                align={{ base: "center", sm: "flex-start" }}
              >
                {/* Thumbnail */}
                <Box
                  w="90px"
                  h="90px"
                  borderRadius="md"
                  overflow="hidden"
                  flexShrink={0}
                  bg={useColorModeValue("gray.200", "gray.700")}
                >
                  <img
                    src={imageUrl}
                    alt={booking.property?.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* Content */}
                <Box flex="1" width="100%">
                  {/* Titel + Status */}
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    justify={{ base: "center", sm: "space-between" }}
                    align={{ base: "center", sm: "center" }}
                    spacing={3}
                    width="100%"
                  >
                    <Heading
                      size="sm"
                      noOfLines={1}
                      textAlign={{ base: "center", sm: "left" }}
                    >
                      {booking.property?.title}
                    </Heading>

                    <Badge
                      colorScheme={
                        booking.bookingStatus === "PENDING"
                          ? "yellow"
                          : booking.bookingStatus === "CONFIRMED"
                          ? "green"
                          : "red"
                      }
                      px={2}
                      py={0.5}
                      borderRadius="md"
                      textTransform="uppercase"
                      fontSize="0.7rem"
                    >
                      {booking.bookingStatus}
                    </Badge>
                  </Stack>

                  <Divider my={3} />

                  {/* Details */}
                  <VStack
                    align={{ base: "center", sm: "start" }}
                    spacing={1}
                    fontSize="sm"
                    textAlign={{ base: "center", sm: "left" }}
                  >
                    <Text>
                      <strong>Gast:</strong> {booking.user?.name}
                    </Text>
                    <Text>
                      <strong>Check-in:</strong>{" "}
                      {new Date(booking.startDate).toLocaleDateString()}
                    </Text>
                    <Text>
                      <strong>Check-out:</strong>{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </Text>
                    <Text>
                      <strong>Totaal:</strong> € {booking.totalPrice}
                    </Text>
                  </VStack>

                  {/* Actieknoppen */}
                  {booking.bookingStatus === "PENDING" && (
                    <HStack
                      justify={{ base: "center", sm: "flex-end" }}
                      spacing={2}
                      mt={4}
                    >
                      <Button
                        size="xs"
                        colorScheme="green"
                        onClick={() => handleConfirm(booking.id)}
                      >
                        Bevestigen
                      </Button>

                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleReject(booking.id)}
                      >
                        Afwijzen
                      </Button>
                    </HStack>
                  )}
                </Box>
              </Stack>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
