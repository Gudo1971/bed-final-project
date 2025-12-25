// BookingForm.jsx
// Formulier dat de boeking aanmaakt. Inclusief validatie op handmatige datums.

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  FormLabel,
  VStack,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

export default function BookingForm({
  propertyId,
  pricePerNight,
  checkIn,
  checkOut,
  onBookingCreated,
  onCancel,
  disabledDates, // nieuwe prop
}) {
  const toast = useToast();

  const [checkinDate, setCheckinDate] = useState(checkIn || "");
  const [checkoutDate, setCheckoutDate] = useState(checkOut || "");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Functie om te checken of een datum verboden is
  const isDateDisabled = (dateStr) => {
    if (!dateStr) return false;

    const date = new Date(dateStr);

    // 1. Verleden blokkeren
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // 2. Disabled dates blokkeren
    return disabledDates.includes(dateStr);
  };

  // Automatische prijsberekening
  useEffect(() => {
    if (!checkinDate || !checkoutDate) return;

    const start = new Date(checkinDate);
    const end = new Date(checkoutDate);
    const nights = (end - start) / (1000 * 60 * 60 * 24);

    setTotalPrice(nights > 0 ? nights * pricePerNight : 0);
  }, [checkinDate, checkoutDate, pricePerNight]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:3000/bookings",
        {
          checkinDate,
          checkoutDate,
          numberOfGuests: Number(numberOfGuests),
          totalPrice,
          propertyId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (onBookingCreated) onBookingCreated(res.data);
    } catch (err) {
      console.error("Booking error:", err.response?.data || err);

      toast({
        title: "Boeking mislukt",
        description: "Er ging iets mis bij het aanmaken van de boeking.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={3} align="stretch">

        {/* Check-in veld */}
        <Box>
          <FormLabel>Check-in</FormLabel>
          <Input
            type="date"
            value={checkinDate}
            onChange={(e) => {
              const value = e.target.value;

              if (isDateDisabled(value)) {
                toast({
                  title: "Datum niet beschikbaar",
                  description: "Deze datum kan niet worden geselecteerd.",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
                return;
              }

              setCheckinDate(value);
            }}
          />
        </Box>

        {/* Check-out veld */}
        <Box>
          <FormLabel>Check-out</FormLabel>
          <Input
            type="date"
            value={checkoutDate}
            onChange={(e) => {
              const value = e.target.value;

              if (isDateDisabled(value)) {
                toast({
                  title: "Datum niet beschikbaar",
                  description: "Deze datum kan niet worden geselecteerd.",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
                return;
              }

              setCheckoutDate(value);
            }}
          />
        </Box>

        {/* Aantal gasten */}
        <Box>
          <FormLabel>Gasten</FormLabel>
          <Input
            type="number"
            min="1"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
          />
        </Box>

        {/* Totale prijs */}
        <Text fontWeight="bold">Totale prijs: €{totalPrice.toFixed(2)}</Text>

        {/* Knoppenbalk */}
        <Flex justify="space-between" mt={6}>
          <Button variant="outline" onClick={onCancel}>
            Annuleren
          </Button>

          <Button type="submit" colorScheme="blue" isLoading={loading}>
            Bevestig boeking
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}
