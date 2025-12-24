import { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Stack, Button } from "@chakra-ui/react";
import { getUserBookings } from "../../api/bookings";
import BookingEditModal from "../tabs/BookingEditModal";
import { useAuth0 } from "@auth0/auth0-react";

export default function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getAccessTokenSilently, user } = useAuth0();

  function openModal(booking) {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedBooking(null);
  }

  async function fetchBookings() {
    try {
      const token = await getAccessTokenSilently({
        audience: "https://staybnb.gudo.dev/api",
        scope: "openid profile email"
      });

      const data = await getUserBookings(user.sub, token);
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Weet je zeker dat je deze boeking wilt annuleren?");
    if (!confirmed) return;

    try {
      const token = await getAccessTokenSilently({
        audience: "https://staybnb.gudo.dev/api",
        scope: "openid profile email"
      });

      const res = await fetch(`http://localhost:3000/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 204) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  useEffect(() => {
    if (!isModalOpen) {
      fetchBookings();
    }
  }, [isModalOpen]);

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
            <Text fontWeight="bold">{booking.property?.title}</Text>

            <Text>
              Van: {new Date(booking.checkinDate).toLocaleDateString("nl-NL")}  
              Tot: {new Date(booking.checkoutDate).toLocaleDateString("nl-NL")}
            </Text>

            <Button
              mt={3}
              size="sm"
              colorScheme="teal"
              onClick={() => openModal(booking)}
            >
              Bewerken
            </Button>

            <Button
              mt={3}
              ml={3}
              size="sm"
              colorScheme="red"
              onClick={() => handleDelete(booking.id)}
            >
              Annuleer
            </Button>
          </Box>
        ))}
      </Stack>

      <BookingEditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        booking={selectedBooking}
      />
    </Box>
  );
}
