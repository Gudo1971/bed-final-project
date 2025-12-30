// ==============================================
// = BOOKING FORM                                =
// = Check-in, check-out, gasten, prijs          =
// ==============================================

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
  NumberInput,
  NumberInputField,
  useColorModeValue,
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
  isActive,
  maxGuests, // <-- komt uit parent
}) {
  const toast = useToast();

  // ==============================================
  // = DARK MODE COLORS                           =
  // ==============================================
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const bannerBg = useColorModeValue("red.50", "red.900");
  const bannerBorder = useColorModeValue("red.200", "red.700");
  const bannerText = useColorModeValue("red.700", "red.200");

  // ==============================================
  // = STATE BLOKKEN                              =
  // ==============================================
  const [checkinDate, setCheckinDate] = useState(checkIn || "");
  const [checkoutDate, setCheckoutDate] = useState(checkOut || "");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Veilige fallback voor maxGuests (voorkomt undefined/NaN)
  const safeMaxGuests = typeof maxGuests === "number" && maxGuests > 0 ? maxGuests : 1;

  // ==============================================
  // = DATUM BLOKKADE (verleden + disabledDates)  =
  // ==============================================
  const isDateDisabled = (dateStr) => {
    if (!dateStr) return false;
    if (!Array.isArray(disabledDates)) return false;

    const date = new Date(dateStr);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;
    return disabledDates.includes(dateStr);
  };

  // ==============================================
  // = AUTOMATISCHE PRIJSBEREKENING               =
  // ==============================================
  useEffect(() => {
    if (!checkinDate || !checkoutDate) return;

    const start = new Date(checkinDate);
    const end = new Date(checkoutDate);
    const nights = (end - start) / (1000 * 60 * 60 * 24);

    setTotalPrice(nights > 0 ? nights * pricePerNight : 0);
  }, [checkinDate, checkoutDate, pricePerNight]);

  // ==============================================
  // = REAL-TIME MAX GUEST VALIDATIE              =
  // ==============================================
  useEffect(() => {
    if (numberOfGuests > safeMaxGuests) {
      toast({
        title: "Te veel gasten",
        description: `Er zijn maximaal ${safeMaxGuests} gasten toegestaan.`,
        status: "warning",
        duration: 2500,
      });
    }
  }, [numberOfGuests, safeMaxGuests, toast]);

  // ==============================================
  // = SUBMIT HANDLER                             =
  // ==============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isActive) {
      toast({
        title: "Niet beschikbaar",
        description:
          "Deze accommodatie staat op inactief en kan niet geboekt worden.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (numberOfGuests > safeMaxGuests) {
      toast({
        title: "Aantal gasten ongeldig",
        description: `Maximaal ${safeMaxGuests} gasten toegestaan.`,
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

      onBookingCreated?.();
    } catch (err) {
      toast({
        title: "Boeking mislukt",
        description: err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ==============================================
  // = RENDER FORM                                =
  // ==============================================
  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">

        {/* ============================================== */}
        {/* = INACTIEVE PROPERTY BANNER                   = */}
        {/* ============================================== */}
        {!isActive && (
          <Box
            bg={bannerBg}
            border="1px solid"
            borderColor={bannerBorder}
            p={3}
            borderRadius="md"
            color={bannerText}
            fontWeight="bold"
          >
            Deze accommodatie is momenteel niet beschikbaar voor boekingen.
          </Box>
        )}

        {/* ============================================== */}
        {/* = CHECK-IN                                    = */}
        {/* ============================================== */}
        <Box>
          <FormLabel color={labelColor}>Check-in</FormLabel>
          <Input
            type="date"
            value={checkinDate}
            disabled={!isActive}
            color={textColor}
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

        {/* ============================================== */}
        {/* = CHECK-OUT                                   = */}
        {/* ============================================== */}
        <Box>
          <FormLabel color={labelColor}>Check-out</FormLabel>
          <Input
            type="date"
            value={checkoutDate}
            disabled={!isActive}
            color={textColor}
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

        {/* ============================================== */}
        {/* = AANTAL GASTEN                               = */}
        {/* ============================================== */}
        <Box>
          <FormLabel color={labelColor}>Gasten</FormLabel>

          {/* Max aantal gasten direct bij het veld tonen */}
          <Text fontSize="sm" color={labelColor} mb={1}>
            Maximaal {safeMaxGuests} gasten toegestaan
          </Text>

          <NumberInput
            min={1}
            max={safeMaxGuests}
            value={numberOfGuests}
            onChange={(v) => setNumberOfGuests(Number(v))}
            isDisabled={!isActive}
          >
            <NumberInputField color={textColor} />
          </NumberInput>

          {numberOfGuests > safeMaxGuests && (
            <Text color="red.500" fontSize="sm">
              Maximaal {safeMaxGuests} gasten toegestaan
            </Text>
          )}
        </Box>

        {/* ============================================== */}
        {/* = TOTALE PRIJS                                = */}
        {/* ============================================== */}
        <Text fontWeight="bold" color={textColor}>
          Totale prijs: €{totalPrice.toFixed(2)}
        </Text>

        {/* ============================================== */}
        {/* = KNOPPEN                                     = */}
        {/* ============================================== */}
        <Flex justify="space-between" mt={6}>
          <Button variant="outline" onClick={onCancel}>
            Annuleren
          </Button>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            isDisabled={!isActive || numberOfGuests > safeMaxGuests}
          >
            Bevestig boeking
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}
