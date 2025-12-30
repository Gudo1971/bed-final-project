// ============================================================
// = BOOKING EDIT MODAL                                        =
// ============================================================

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  HStack,
  IconButton,
  Box,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

import CalendarGrid from "../calendar/CalendarGrid";
import { updateBooking } from "../../services/bookings";
import { getBookingStatus } from "../../utils/getBookingStatus";

export default function BookingEditModal({
  isOpen,
  onClose,
  booking,
  disabledDates = [],
  refresh,
}) {
  const toast = useToast();

  // ============================================================
  // = DARK MODE COLORS                                          =
  // ============================================================
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const textColor = useColorModeValue("gray.800", "gray.100");

  // ============================================================
  // = STATE BLOKKEN                                             =
  // ============================================================
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  const maxGuests = booking?.property?.maxGuestCount || 1;

  // ============================================================
  // = NORMALIZE (timezone‑safe)                                 =
  // ============================================================
  function normalize(date) {
    if (!date) return null;

    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
  }

  // ============================================================
  // = STATUS ENGINE                                             =
  // ============================================================
  const status = getBookingStatus(
    booking?.checkinDate,
    booking?.checkoutDate
  );

  const isPastBooking = status === "verlopen";
  const isCanceled = booking?.bookingStatus?.toLowerCase() === "canceled";

  const canEdit = !isPastBooking && !isCanceled;

  // ============================================================
  // = DISABLED DATES FILTEREN                                   =
  // ============================================================
  const filteredDisabledDates = disabledDates.filter(
    (d) =>
      d < normalize(booking?.checkinDate) ||
      d > normalize(booking?.checkoutDate)
  );

  // ============================================================
  // = DAGEN GENEREREN                                           =
  // ============================================================
  function generateDays(monthDate) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);

    const arr = [];

    for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
      arr.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    }

    return arr;
  }

  useEffect(() => {
    setDays(generateDays(currentMonth));
  }, [currentMonth]);

  // ============================================================
  // = RESET BIJ OPENEN                                          =
  // ============================================================
  useEffect(() => {
    if (booking) {
      const start = booking.checkinDate
        ? new Date(booking.checkinDate)
        : new Date();

      setCurrentMonth(new Date(start.getFullYear(), start.getMonth(), 1));

      setCheckIn(normalize(booking.checkinDate) || null);
      setCheckOut(normalize(booking.checkoutDate) || null);
      setGuests(booking.numberOfGuests || 1);
    }
  }, [booking]);

  if (!booking) return null;

  // ============================================================
  // = DATUM SELECTIE                                            =
  // ============================================================
  function handleDateClick(dateObj) {
    if (!canEdit) return;

    const normalized = normalize(dateObj);

    if (filteredDisabledDates.includes(normalized)) return;

    if (!checkIn) {
      setCheckIn(normalized);
      setCheckOut(null);
      return;
    }

    if (checkIn && !checkOut) {
      if (new Date(normalized) <= new Date(checkIn)) {
        toast({
          title: "Ongeldige datum",
          description: "Check‑out moet na check‑in liggen.",
          status: "error",
        });
        return;
      }
      setCheckOut(normalized);
      return;
    }

    setCheckIn(normalized);
    setCheckOut(null);
  }

  // ============================================================
  // = OPSLAAN                                                   =
  // ============================================================
  async function handleSave() {
    if (!canEdit) return;

    if (!checkIn || !checkOut) {
      toast({
        title: "Datums ontbreken",
        description: "Selecteer een check‑in en check‑out datum.",
        status: "error",
      });
      return;
    }

    if (guests > maxGuests) {
      toast({
        title: "Te veel gasten",
        description: `Maximaal ${maxGuests} gasten toegestaan.`,
        status: "error",
      });
      return;
    }

    try {
      await updateBooking(booking.id, {
        checkinDate: checkIn,
        checkoutDate: checkOut,
        numberOfGuests: guests,
      });

      toast({
        title: "Boeking bijgewerkt",
        description: "De wijzigingen zijn opgeslagen.",
        status: "success",
      });

      refresh();
      onClose();
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        description: err?.response?.data?.error || "Probeer het opnieuw.",
        status: "error",
      });
    }
  }

  // ============================================================
  // = MAAND NAVIGATIE                                           =
  // ============================================================
  function prevMonth() {
    if (!canEdit) return;
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    if (!canEdit) return;
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  }

  // ============================================================
  // = RENDER                                                     =
  // ============================================================
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />

      <ModalContent borderRadius="lg">
        <ModalHeader color={textColor}>Boeking bewerken</ModalHeader>

        <ModalBody>
          <Text mb={4} fontWeight="bold" color={textColor}>
            {booking.property?.title}
          </Text>

          {!canEdit && (
            <Text color="red.400" fontSize="sm" mb={3}>
              Deze boeking kan niet worden bewerkt.
            </Text>
          )}

          {/* ============================================================ */}
          {/* = AANTAL PERSONEN                                           */}
          {/* ============================================================ */}
          <FormControl mb={4}>
            <FormLabel color={labelColor}>Aantal personen</FormLabel>

            <Text fontSize="sm" color={labelColor} mb={1}>
              Maximaal {maxGuests} gasten toegestaan
            </Text>

            <NumberInput
              min={1}
              max={maxGuests}
              value={guests}
              onChange={(vStr, vNum) => {
                const val = vNum || 1;
                setGuests(val);

                if (val > maxGuests) {
                  toast({
                    title: "Te veel gasten",
                    description: `Maximaal ${maxGuests} gasten toegestaan.`,
                    status: "warning",
                    duration: 2500,
                  });
                }
              }}
              isDisabled={!canEdit}
            >
              <NumberInputField color={textColor} />
            </NumberInput>

            {guests > maxGuests && (
              <Text color="red.500" fontSize="sm" mt={1}>
                Maximaal {maxGuests} gasten toegestaan
              </Text>
            )}
          </FormControl>

          {/* ============================================================ */}
          {/* = MAAND NAVIGATIE                                           */}
          {/* ============================================================ */}
          <HStack justify="space-between" mb={2}>
            <IconButton
              icon={<ChevronLeftIcon />}
              onClick={prevMonth}
              aria-label="Vorige maand"
              isDisabled={!canEdit}
            />
            <Text fontWeight="bold" color={textColor}>
              {currentMonth.toLocaleString("nl-NL", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <IconButton
              icon={<ChevronRightIcon />}
              onClick={nextMonth}
              aria-label="Volgende maand"
              isDisabled={!canEdit}
            />
          </HStack>

          {/* ============================================================ */}
          {/* = KALENDER                                                  */}
          {/* ============================================================ */}
          <Box>
            <CalendarGrid
              key={`${checkIn}-${checkOut}`}
              days={days}
              disabledDates={filteredDisabledDates}
              checkIn={checkIn}
              checkOut={checkOut}
              onDateClick={handleDateClick}
              isInteractive={canEdit}
            />
          </Box>
        </ModalBody>

        {/* ============================================================ */}
        {/* = FOOTER KNOPPEN                                            */}
        {/* ============================================================ */}
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Sluiten
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleSave}
            isDisabled={!canEdit || guests > maxGuests}
          >
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
