import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function BookingPage() {
  const { user, isAuthenticated } = useAuth0();
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  // Fetch bookings for this user
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    fetch(`http://localhost:3000/bookings/user/${user.sub}`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error fetching bookings:", err));
  }, [isAuthenticated, user]);

  // Fetch all properties
  useEffect(() => {
    fetch("http://localhost:3000/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("Error fetching properties:", err));
  }, []);

  // Submit booking
  const onSubmit = async (data) => {
    const payload = {
      userAuth0Id: user.sub,
      propertyId: data.propertyId,
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
      alert("✅ Booking created!");
      reset();

      // Refresh bookings
      fetch(`http://localhost:3000/bookings/user/${user.sub}`)
        .then((res) => res.json())
        .then((data) => setBookings(data));
    } else {
      alert("❌ Booking failed");
    }
  };

  // ⬇️ LET OP: vanaf hier begint de RETURN
  return (
    <div>
      <Box p={4} borderWidth="1px" borderRadius="md" mb={6}>
        <VStack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <FormLabel>Property</FormLabel>
            <Select {...register("propertyId")} placeholder="Select property" required>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Check-in Date</FormLabel>
            <Input type="date" {...register("checkinDate")} required />
          </FormControl>

          <FormControl>
            <FormLabel>Check-out Date</FormLabel>
            <Input type="date" {...register("checkoutDate")} required />
          </FormControl>

          <FormControl>
            <FormLabel>Guests</FormLabel>
            <Input type="number" min="1" {...register("numberOfGuests")} required />
          </FormControl>

          <Button colorScheme="blue" type="submit">
            Book Now
          </Button>
        </VStack>
      </Box>

      <h1>Your Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              <strong>{booking.property.title}</strong><br />
              {new Date(booking.checkinDate).toLocaleDateString()} –{" "}
              {new Date(booking.checkoutDate).toLocaleDateString()}<br />
              Guests: {booking.numberOfGuests}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

