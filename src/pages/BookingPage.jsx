import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useMemo} from "react";
import { useForm } from "react-hook-form";
import Calendar from "../components/calendar/Calendar";

export default function BookingPage() {
  const { user, isAuthenticated } = useAuth0();
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();
const [propertyBookings, setPropertyBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  

  // 🟢 Bookings ophalen
  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/bookings/user/${user.sub}?email=${user.email}`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Properties ophalen
  useEffect(() => {
    fetch("http://localhost:3000/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))

      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  // 🟢 Bookings ophalen bij paginalaad
  useEffect(() => {
    if (!isAuthenticated || !user?.sub || !user?.email) return;
    fetchBookings();
  }, [isAuthenticated, user?.sub]);

  // 🟢 Booking indienen
  const onSubmit = async (data) => {
    const payload = {
      userAuth0Id: user.sub,
      propertyId: selectedPropertyId,
      checkinDate: data.checkinDate,
      checkoutDate: data.checkoutDate,
      numberOfGuests: data.numberOfGuests,
    };

    const res = await fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast({
        title: "✅ Booking aangemaakt",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      reset();
      fetchBookings();
    } else {
      toast({
        title: "❌ Booking mislukt",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };
  // 🟢 Bookings ophalen voor geselecteerde property (disabled ranges)
useEffect(() => {
  if (!selectedPropertyId) return;

  console.log("Fetching bookings for property:", selectedPropertyId);

  fetch(`http://localhost:3000/properties/${selectedPropertyId}/bookings`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Fetched property bookings:", data);
      setPropertyBookings(data);
    })
    .catch((err) =>
      console.error("Error fetching property bookings:", err)
    );
}, [selectedPropertyId]);

const disabledDates = useMemo(() => {
  const dates = [];

  propertyBookings.forEach((booking) => {
    const start = new Date(booking.checkinDate);
    const end = new Date(booking.checkoutDate);

    const current = new Date(start);

    while (current <= end) {
      const local = new Date(current.getTime() - current.getTimezoneOffset() * 60000);
      dates.push(local.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
  });

  console.log("Disabled dates:", dates);

  return dates;
}, [propertyBookings]);



  return (
    <Box maxW="800px" mx="auto" py={8}>
      <Heading mb={6}>Boek een verblijf</Heading>

      <Box p={4} borderWidth="1px" borderRadius="md" mb={10}>
        <VStack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
          <FormControl isRequired>
            <FormLabel>Property</FormLabel>
            <Select
              placeholder="Select property"
              onChange={(e) => setSelectedPropertyId(e.target.value)}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Check-in Date</FormLabel>
            <Input type="date" {...register("checkinDate")} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Check-out Date</FormLabel>
            <Input type="date" {...register("checkoutDate")} />
          </FormControl>

          <Calendar 
            disabledDates={disabledDates} 
            onSelectDate={(date) => console.log("Geselecteerd:", date)}
          />


          <FormControl isRequired>
            <FormLabel>Guests</FormLabel>
            <Input type="number" min="1" {...register("numberOfGuests")} />
          </FormControl>

          <Button colorScheme="blue" type="submit">
            Book Now
          </Button>
        </VStack>
      </Box>

      <Heading mb={4}>Jouw bookings</Heading>
      {loading ? (
        <Spinner size="lg" />
      ) : bookings.length === 0 ? (
        <Text>📭 Geen bookings gevonden.</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {bookings.map((booking) => (
            <Box
              key={booking.id}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              bg="gray.50"
            >
              <Text fontWeight="bold">{booking.property.title}</Text>
              <Text>
                {new Date(booking.checkinDate).toLocaleDateString()} –{" "}
                {new Date(booking.checkoutDate).toLocaleDateString()}
              </Text>
              <Text>Guests: {booking.numberOfGuests}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
