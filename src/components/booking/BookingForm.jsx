import { useState, useEffect } from "react";
import { Box, Button, Input, FormLabel, VStack, Text } from "@chakra-ui/react";
import axios from "axios";

export default function BookingForm({ propertyId, userId, pricePerNight, onBookingCreated }) {
  const [checkinDate, setCheckinDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Automatische prijsberekening
  useEffect(() => {
    if (!checkinDate || !checkoutDate) return;

    const start = new Date(checkinDate);
    const end = new Date(checkoutDate);

    const diffMs = end - start;
    const nights = diffMs / (1000 * 60 * 60 * 24);

    if (nights > 0) {
      setTotalPrice(nights * pricePerNight);
    } else {
      setTotalPrice(0);
    }
  }, [checkinDate, checkoutDate, pricePerNight]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("PROPERTY ID SENT:", propertyId);
    console.log("USER ID SENT:", userId);
    console.log("TOTAL PRICE CALCULATED:", totalPrice);

    try {
      const res = await axios.post("http://localhost:3000/bookings", {
        propertyId,
        userId,
        checkinDate,
        checkoutDate,
        numberOfGuests: Number(numberOfGuests),
        totalPrice: Number(totalPrice),
      });

      if (onBookingCreated) {
        onBookingCreated(res.data.booking);
      }

      setCheckinDate("");
      setCheckoutDate("");
      setNumberOfGuests(1);
      setTotalPrice(0);

    } catch (err) {
      console.error("Booking error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} borderWidth="1px" borderRadius="md">
      <VStack spacing={3} align="stretch">

        <Box>
          <FormLabel>Check-in</FormLabel>
          <Input type="date" value={checkinDate} onChange={(e) => setCheckinDate(e.target.value)} />
        </Box>

        <Box>
          <FormLabel>Check-out</FormLabel>
          <Input type="date" value={checkoutDate} onChange={(e) => setCheckoutDate(e.target.value)} />
        </Box>

        <Box>
          <FormLabel>Guests</FormLabel>
          <Input
            type="number"
            min="1"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
          />
        </Box>

        {/* ✅ Live berekende prijs tonen */}
        <Text fontWeight="bold">Total Price: €{totalPrice.toFixed(2)}</Text>

        <Button type="submit" colorScheme="teal" isLoading={loading}>
          Book Now
        </Button>

      </VStack>
    </Box>
  );
}
