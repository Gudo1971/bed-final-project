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

import { createBooking } from "../../api/bookings"; 

export default function BookingForm({
  propertyId,
  pricePerNight,
  checkIn,
  checkOut,
  onBookingCreated,
  onCancel,
  disabledDates,
  isActive, // ⭐ nieuwe prop
}) {
  const toast = useToast();

  const [checkinDate, setCheckinDate] = useState(checkIn || "");
  const [checkoutDate, setCheckoutDate] = useState(checkOut || "");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  /* -----------------------------------------------------------
     Datum blokkade (verleden + disabledDates)
  ----------------------------------------------------------- */
  const isDateDisabled = (dateStr) => {
    if (!dateStr) return false;

    const date = new Date(dateStr);

    // Verleden blokkeren
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Geblokkeerde datums
    return disabledDates.includes(dateStr);
  };

  /* -----------------------------------------------------------
     Automatische prijsberekening
  ----------------------------------------------------------- */
  useEffect(() => {
    if (!checkinDate || !checkoutDate) return;

    const start = new Date(checkinDate);
    const end = new Date(checkoutDate);
    const nights = (end - start) / (1000 * 60 * 60 * 24);

    setTotalPrice(nights > 0 ? nights * pricePerNight : 0);
  }, [checkinDate, checkoutDate, pricePerNight]);

  /* -----------------------------------------------------------
     Submit handler
  ----------------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isActive) {
      toast({
        title: "Niet beschikbaar",
        description: "Deze accommodatie staat op inactief en kan niet geboekt worden.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await createBooking(
        {
          checkinDate,
          checkoutDate,
          numberOfGuests: Number(numberOfGuests),
          totalPrice,
          propertyId,
        },
        token
      );

     

      if (onBookingCreated) onBookingCreated();
    } catch (err) {
      toast({
        title: "Boeking mislukt",
        description: err.message, // ⭐ toont backend error correct
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={3} align="stretch">

        {/* ⭐ Banner voor inactieve property */}
        {!isActive && (
          <Box
            bg="red.50"
            border="1px solid"
            borderColor="red.200"
            p={3}
            borderRadius="md"
            color="red.700"
            fontWeight="bold"
          >
            Deze accommodatie is momenteel niet beschikbaar voor boekingen.
          </Box>
        )}

        {/* Check-in veld */}
        <Box>
          <FormLabel>Check-in</FormLabel>
          <Input
            type="date"
            value={checkinDate}
            disabled={!isActive}
            onChange={(e) => {
              const value = e.target.value;

              if (isDateDisabled(value)) {
                toast({
                  title: "Datum niet beschikbaar",
                  description: "Deze datum kan niet worden geselecteerd.",
                  status: "error",
                  duration: 3000,
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
            disabled={!isActive}
            onChange={(e) => {
              const value = e.target.value;

              if (isDateDisabled(value)) {
                toast({
                  title: "Datum niet beschikbaar",
                  description: "Deze datum kan niet worden geselecteerd.",
                  status: "error",
                  duration: 3000,
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
            disabled={!isActive}
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
          />
        </Box>

        {/* Totale prijs */}
        <Text fontWeight="bold">Totale prijs: €{totalPrice.toFixed(2)}</Text>

        {/* Knoppen */}
        <Flex justify="space-between" mt={6}>
          <Button variant="outline" onClick={onCancel}>
            Annuleren
          </Button>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            isDisabled={!isActive} // ⭐ voorkomt boeken
          >
            Bevestig boeking
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}
