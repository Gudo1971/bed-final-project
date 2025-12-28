// ==============================================
// = BOOKING EDIT MODAL                          =
// ==============================================

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
} from "@chakra-ui/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

import CalendarGrid from "../calendar/CalendarGrid";
import { updateBooking } from "../../services/bookings";

export default function BookingEditModal({
  isOpen,
  onClose,
  booking,
  disabledDates = [],
  refresh,
}) {
  const toast = useToast();

  // ==============================================
  // = STATE BLOKKEN                              =
  // ==============================================
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [days, setDays] = useState([]);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  // ==============================================
  // = NORMALIZE (timezone‑safe)                  =
  // ==============================================
  function normalize(date) {
    if (!date) return null;

    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
  }

  // ==============================================
  // = DISABLED DATES FILTEREN                    =
  // = (eigen boeking niet blokkeren)             =
  // ==============================================
  const filteredDisabledDates = disabledDates.filter(
    (d) =>
      d < normalize(booking?.checkinDate) ||
      d > normalize(booking?.checkoutDate)
  );

  // ==============================================
  // = DAGEN GENEREREN (timezone‑safe)            =
  // ==============================================
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

  // ==============================================
  // = RESET BIJ OPENEN                           =
  // ==============================================
  useEffect(() => {
    if (booking) {
      const start = new Date(booking.checkinDate);

      setCurrentMonth(new Date(start.getFullYear(), start.getMonth(), 1));

      setCheckIn(normalize(booking.checkinDate));
      setCheckOut(normalize(booking.checkoutDate));
      setGuests(booking.numberOfGuests || 1);
    }
  }, [booking]);

  if (!booking) return null;

  // ==============================================
  // = DATUM SELECTIE                             =
  // ==============================================
  function handleDateClick(dateObj) {
    const normalized = normalize(dateObj);

    if (filteredDisabledDates.includes(normalized)) return;

    // 1. Nog geen check‑in
    if (!checkIn) {
      setCheckIn(normalized);
      setCheckOut(null);
      return;
    }

    // 2. Check‑in gekozen, check‑out nog niet
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

    // 3. Beide gekozen → opnieuw beginnen
    setCheckIn(normalized);
    setCheckOut(null);
  }

  // ==============================================
  // = OPSLAAN                                    =
  // ==============================================
  async function handleSave() {
    if (!checkIn || !checkOut) {
      toast({
        title: "Datums ontbreken",
        description: "Selecteer een check‑in en check‑out datum.",
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

  // ==============================================
  // = MAAND NAVIGATIE                            =
  // ==============================================
  function prevMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Boeking bewerken</ModalHeader>

        <ModalBody>
          <Text mb={4} fontWeight="bold">
            {booking.property?.title}
          </Text>

          {/* ============================================== */}
          {/* = AANTAL PERSONEN                             = */}
          {/* ============================================== */}
          <FormControl mb={4}>
            <FormLabel>Aantal personen</FormLabel>
            <NumberInput
              min={1}
              value={guests}
              onChange={(vStr, vNum) => setGuests(vNum || 1)}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>

          {/* ============================================== */}
          {/* = MAAND NAVIGATIE                             = */}
          {/* ============================================== */}
          <HStack justify="space-between" mb={2}>
            <IconButton
              icon={<ChevronLeftIcon />}
              onClick={prevMonth}
              aria-label="Vorige maand"
            />
            <Text fontWeight="bold">
              {currentMonth.toLocaleString("nl-NL", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <IconButton
              icon={<ChevronRightIcon />}
              onClick={nextMonth}
              aria-label="Volgende maand"
            />
          </HStack>

          {/* ============================================== */}
          {/* = KALENDER                                    = */}
          {/* ============================================== */}
          <Box>
            <CalendarGrid
              days={days}
              disabledDates={filteredDisabledDates}
              checkIn={checkIn}
              checkOut={checkOut}
              onDateClick={handleDateClick}
              isInteractive={true}
            />
          </Box>
        </ModalBody>

        {/* ============================================== */}
        {/* = FOOTER KNOPPEN                              = */}
        {/* ============================================== */}
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Annuleren
          </Button>
          <Button colorScheme="teal" onClick={handleSave}>
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
