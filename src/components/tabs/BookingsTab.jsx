import { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Stack, Button } from "@chakra-ui/react";
import { getUserBookings } from "../../services/bookings";
import BookingEditModal from "../tabs/BookingEditModal";

export default function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state (één keer!)
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal(booking) {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedBooking(null);
  }

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getUserBookings();
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (bookings.length === 0) {
    return <Text>Je hebt nog geen boekingen.</Text>;
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Mijn Boekingen
      </Heading>

      <Stack spacing={4}>
        {bookings.map((booking) => (
          <Box
            key={booking.id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            shadow="sm"
          >
            <Text fontWeight="bold">{booking.propertyName}</Text>
            <Text>
              Van: {booking.startDate} — Tot: {booking.endDate}
            </Text>

            <Button
              mt={3}
              size="sm"
              colorScheme="teal"
              onClick={() => openModal(booking)}
            >
              Bewerken
            </Button>
          </Box>
        ))}
      </Stack>

      {/* Modal hoort HIER, buiten de map */}
      <BookingEditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        booking={selectedBooking}
      />
    </Box>
  );
}
