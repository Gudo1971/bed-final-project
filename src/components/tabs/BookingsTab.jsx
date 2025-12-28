// ==============================================
// = BOOKINGS TAB                                =
// ==============================================

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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { getUserBookings } from "../../api/bookings";
import BookingEditModal from "../tabs/BookingEditModal";

// ==============================================
// = HELPER: USER ID UIT JWT                    =
// ==============================================
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

  // ==============================================
  // = STATE BLOKKEN                              =
  // ==============================================
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [disabledDates, setDisabledDates] = useState([]);

  // Confirm modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const cancelRef = useRef();

  const userId = getUserIdFromToken();

  // ==============================================
  // = BOOKINGS OPHALEN                           =
  // ==============================================
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

  // ==============================================
  // = DISABLED DATES OPHALEN (correcte /api route)=
  // ==============================================
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

  // ==============================================
  // = MODAL OPENEN                               =
  // ==============================================
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

  // ==============================================
  // = DELETE FLOW                                =
  // ==============================================
  function askDelete(id) {
    setBookingToDelete(id);
    setIsConfirmOpen(true);
  }

  async function handleDelete() {
    try {
      setDeletingId(bookingToDelete);

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
        title: "Boeking geannuleerd",
        description: "Je boeking is succesvol verwijderd.",
        status: "success",
        duration: 3000,
        position: "top",
      });

      await fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);

      toast({
        title: "Fout bij annuleren",
        description: "Er ging iets mis tijdens het annuleren.",
        status: "error",
        duration: 3000,
        position: "top",
      });
    } finally {
      setDeletingId(null);
      setIsConfirmOpen(false);
    }
  }

  // ==============================================
  // = INIT LOAD                                  =
  // ==============================================
  useEffect(() => {
    fetchBookings();
  }, []);

  // ==============================================
  // = LOADING STATE                              =
  // ==============================================
  if (loading) return <Spinner size="xl" />;

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box>
      <Heading size="lg" mb={4}>
        Mijn boekingen
      </Heading>

      {(!bookings || bookings.length === 0) && (
        <Text>Je hebt nog geen boekingen.</Text>
      )}

      <Stack spacing={4}>
        {bookings.map((booking) => {
          const isPastBooking =
            new Date(booking.checkoutDate) < new Date();

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
              <Stack direction="row" spacing={4}>
                {/* ============================================== */}
                {/* = FOTO                                        = */}
                {/* ============================================== */}
                <Box
                  w="150px"
                  h="120px"
                  borderRadius="md"
                  overflow="hidden"
                  bg="gray.100"
                  flexShrink={0}
                >
                  <img
                    src={booking.property?.images || "/placeholder.jpg"}
                    alt={booking.property?.title || "Accommodatie"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                {/* ============================================== */}
                {/* = INFO                                        = */}
                {/* ============================================== */}
                <Stack spacing={1} flex="1">
                  <Text fontSize="lg" fontWeight="bold">
                    {booking.property?.title || "Accommodatie"}
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

                  {/* ============================================== */}
                  {/* = ACTIE KNOPPEN                              = */}
                  {/* ============================================== */}
                  <Stack direction="row" mt={3}>
                    {!isPastBooking && (
                      <>
                        <Button
                          colorScheme="blue"
                          size="sm"
                          onClick={() => openModal(booking)}
                        >
                          Bewerken
                        </Button>

                        <Button
                          colorScheme="red"
                          size="sm"
                          isLoading={deletingId === booking.id}
                          onClick={() => askDelete(booking.id)}
                        >
                          Annuleren
                        </Button>
                      </>
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

                  {isPastBooking && (
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Deze boeking is verlopen en kan niet meer worden bewerkt.
                    </Text>
                  )}
                </Stack>
              </Stack>
            </Box>
          );
        })}
      </Stack>

      {/* ============================================== */}
      {/* = CONFIRM DELETE MODAL                        = */}
      {/* ============================================== */}
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Boeking annuleren
            </AlertDialogHeader>

            <AlertDialogBody>
              Weet je zeker dat je deze boeking wilt annuleren?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                Annuleren
              </Button>

              <Button
                colorScheme="red"
                ml={3}
                isLoading={deletingId === bookingToDelete}
                onClick={handleDelete}
              >
                Ja, annuleren
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* ============================================== */}
      {/* = EDIT MODAL                                  = */}
      {/* ============================================== */}
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
