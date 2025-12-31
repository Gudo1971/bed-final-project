// ============================================================
// = BOOKINGS TAB                                              =
// ============================================================

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Stack,
  Button,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { getUserBookings } from "../../api/bookings";
import BookingEditModal from "../tabs/BookingEditModal";

// ============================================================
// = HELPER: USER ID UIT JWT                                  =
// ============================================================
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export default function BookingsTab() {
  const toast = useToast();

  // ============================================================
  // = STATE BLOKKEN                                            =
  // ============================================================
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [disabledDates, setDisabledDates] = useState([]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const cancelRef = useRef();

  const userId = getUserIdFromToken();

  // ============================================================
  // = BOOKINGS OPHALEN                                         =
  // ============================================================
  async function fetchBookings() {
    try {
      const token = localStorage.getItem("token");
      if (!token || !userId) {
        setBookings([]);
        return;
      }

      const data = await getUserBookings(userId, token);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // = DISABLED DATES OPHALEN                                   =
  // ============================================================
  async function loadDisabledDates(propertyId) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/bookings/disabled-dates/${propertyId}`
      );

      const data = await res.json();
      setDisabledDates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading disabled dates:", err);
    }
  }

  // ============================================================
  // = MODAL OPENEN                                             =
  // ============================================================
  async function openModal(booking) {
    setSelectedBooking(booking);

    if (booking.property?.id) {
      await loadDisabledDates(booking.property.id);
    }

    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedBooking(null);
  }

  // ============================================================
  // = ANNULEREN (STATUS → CANCELED)                            =
  // ============================================================
  async function cancelBooking(id) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/api/bookings/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingStatus: "CANCELED" }),
      });

      if (!res.ok) throw new Error("Cancel failed");

      toast({
        title: "Boeking geannuleerd",
        description: "Je boeking is succesvol geannuleerd.",
        status: "success",
        duration: 3000,
        position: "top",
      });

      await fetchBookings();
    } catch (err) {
      console.error("Error canceling booking:", err);

      toast({
        title: "Fout bij annuleren",
        description: "Er ging iets mis tijdens het annuleren.",
        status: "error",
        duration: 3000,
        position: "top",
      });
    }
  }

  // ============================================================
  // = DELETE FLOW (ALLEEN CANCELED)                            =
  // ============================================================
  function askDelete(id) {
    setBookingToDelete(id);
    setIsConfirmOpen(true);
  }

  async function handleDelete() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/bookings/${bookingToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      toast({
        title: "Boeking verwijderd",
        description: "De geannuleerde boeking is verwijderd.",
        status: "success",
        duration: 3000,
        position: "top",
      });

      await fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);

      toast({
        title: "Fout bij verwijderen",
        description: "Er ging iets mis tijdens het verwijderen.",
        status: "error",
        duration: 3000,
        position: "top",
      });
    } finally {
      setIsConfirmOpen(false);
    }
  }

  // ============================================================
  // = INIT LOAD                                                =
  // ============================================================
  useEffect(() => {
    fetchBookings();
  }, []);

  // ============================================================
  // = LOADING STATE                                            =
  // ============================================================
  if (loading) return <Spinner size="xl" />;

  // ============================================================
  // = RENDER                                                   =
  // ============================================================
  return (
    <Box>

      {/* ============================================================ */}
      {/* = TERUGKNOP                                                = */}
      {/* ============================================================ */}
      <Button
        as={Link}
        to="/properties"
        variant="ghost"
        colorScheme="teal"
        size="sm"
        mb={4}
      >
        ← Terug naar Properties
      </Button>

      <Heading size="lg" mb={4}>
        Mijn boekingen
      </Heading>

      {(!bookings || bookings.length === 0) && (
        <Text>Je hebt nog geen boekingen.</Text>
      )}

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mt={4}>
        {bookings.map((booking) => {
          const status = booking.bookingStatus?.toLowerCase();

          const isCanceled = status === "canceled";
          const isPast = new Date(booking.checkoutDate) < new Date();

          const canEdit = !isCanceled && !isPast;
          const canCancel = !isCanceled && !isPast;
          const canDelete = isCanceled;

          return (
            <Box
              key={booking.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="sm"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                
                {/* FOTO */}
                <Box
                  w={{ base: "100%", md: "150px" }}
                  h={{ base: "180px", md: "120px" }}
                  borderRadius="md"
                  overflow="hidden"
                  bg="gray.100"
                  flexShrink={0}
                >
                  <img
                    src={booking.property?.images?.[0]?.url || "/placeholder.jpg"}
                    alt={booking.property?.title || "Accommodatie"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* INFO */}
                <Stack spacing={1} flex="1">
                  <Text fontSize="lg" fontWeight="bold">
                    {booking.property?.title}
                  </Text>

                  <Text color="gray.600" fontSize="sm">
                    {booking.property?.location}
                  </Text>

                  <Text fontSize="sm">
                    <strong>Check‑in:</strong> {booking.checkinDate}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Check‑out:</strong> {booking.checkoutDate}
                  </Text>

                  <Text fontWeight="semibold" mt={1}>
                    €{booking.totalPrice}
                  </Text>

                  {/* ============================================================ */}
                  {/* = ACTIE KNOPPEN                                            = */}
                  {/* ============================================================ */}
                  <Stack direction="row" mt={3} flexWrap="wrap" gap={2}>
                    {canEdit && (
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => openModal(booking)}
                      >
                        Bewerken
                      </Button>
                    )}

                    {canCancel && (
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Annuleren
                      </Button>
                    )}

                    {canDelete && (
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => askDelete(booking.id)}
                      >
                        Verwijderen
                      </Button>
                    )}

                    <Button
                      as={Link}
                      to={`/properties/${booking.property?.id}`}
                      size="sm"
                      variant="outline"
                    >
                      Bekijk accommodatie
                    </Button>
                  </Stack>

                  {isPast && (
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Deze boeking is verlopen en kan niet meer worden bewerkt of geannuleerd.
                    </Text>
                  )}
                </Stack>
              </Stack>
            </Box>
          );
        })}
      </SimpleGrid>

      {/* ============================================================ */}
      {/* = DELETE CONFIRM MODAL                                     = */}
      {/* ============================================================ */}
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Boeking verwijderen
            </AlertDialogHeader>

            <AlertDialogBody>
              Weet je zeker dat je deze geannuleerde boeking wilt verwijderen?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                Sluiten
              </Button>

              <Button colorScheme="red" ml={3} onClick={handleDelete}>
                Ja, verwijderen
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* ============================================================ */}
      {/* = EDIT MODAL                                               = */}
      {/* ============================================================ */}
      {selectedBooking && (
        <BookingEditModal
          isOpen={isModalOpen}
          onClose={closeModal}
          booking={selectedBooking}
          disabledDates={disabledDates}
          refresh={fetchBookings}
        />
      )}
    </Box>
  );
}
