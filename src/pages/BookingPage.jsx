// BookingPage.jsx
// Volledig gecorrigeerde versie — geen hook errors, veilige auth guard, spinner werkt

import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Flex,
  IconButton,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";

import CalendarGrid from "../components/calendar/CalendarGrid";
import BookingModal from "../components/booking/BookingModal";
import { useAuth } from "../components/context/AuthContext";

export default function BookingPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { user, token } = useAuth();
  const isAuthenticated = !!user && !!token;

  // ⭐ ALLE HOOKS STAAN HIER — nooit onder een condition
  const [property, setProperty] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);
  const [days, setDays] = useState([]);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const pricePerNight = 100;

  /* -----------------------------------------------------------
     AUTH GUARD — veilig in useEffect
  ----------------------------------------------------------- */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { message: "Je moet ingelogd zijn om een boeking te plaatsen." },
      });
    }
  }, [isAuthenticated, navigate]);

  /* -----------------------------------------------------------
     Data ophalen
  ----------------------------------------------------------- */
  const loadProperty = async () => {
    const res = await fetch(`http://localhost:3000/properties/${propertyId}`);
    return res.json();
  };

  const loadDisabled = async () => {
    const res = await fetch(
      `http://localhost:3000/bookings/disabled-dates/${propertyId}`
    );
    return res.json();
  };

  useEffect(() => {
    async function loadAll() {
      // Als niet ingelogd, niet eens proberen te laden
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const [propertyData, disabledData] = await Promise.all([
          loadProperty(),
          loadDisabled(),
        ]);

        setProperty(propertyData);
        setDisabledDates(disabledData);
      } catch (err) {
        toast({
          title: "Fout bij laden",
          description: "Kon de gegevens niet ophalen.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [propertyId, isAuthenticated, toast]);

  /* -----------------------------------------------------------
     Kalender genereren
  ----------------------------------------------------------- */
  useEffect(() => {
    const first = new Date(currentYear, currentMonth, 1);
    const last = new Date(currentYear, currentMonth + 1, 0);

    const temp = [];
    for (
      let d = first;
      d <= last;
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    ) {
      temp.push(new Date(d));
    }
    setDays(temp);
  }, [currentYear, currentMonth]);

  /* -----------------------------------------------------------
     CONDITIONELE RENDERS — NA ALLE HOOKS
  ----------------------------------------------------------- */

  // Niet ingelogd → spinner (of eventueel null)
  if (!isAuthenticated) {
    return (
      <Flex justify="center" mt={20}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Laden van property/disabled dates
  if (loading) {
    return (
      <Flex align="center" justify="center" mt={20}>
        <Spinner size="xl" color="blue.500" />
        <Text ml={4} fontSize="lg">
          Bezig met laden...
        </Text>
      </Flex>
    );
  }

  /* -----------------------------------------------------------
     Datumselectie
  ----------------------------------------------------------- */
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleDateSelection = (date) => {
    if (!property?.isActive) return;

    const dateStr = formatDate(date);

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut(null);
      return;
    }

    if (new Date(dateStr) > new Date(checkIn)) {
      setCheckOut(dateStr);
    } else {
      setCheckIn(dateStr);
      setCheckOut(null);
    }
  };

  /* -----------------------------------------------------------
     Maandnavigatie
  ----------------------------------------------------------- */
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  /* -----------------------------------------------------------
     Prijsberekening
  ----------------------------------------------------------- */
  const nightCount =
    checkIn && checkOut
      ? (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
      : 0;

  const totalPrice = nightCount * pricePerNight;

  /* -----------------------------------------------------------
     Render
  ----------------------------------------------------------- */
  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Selecteer je datums
      </Text>

      {/* Maandnavigatie */}
      <Flex align="center" justify="space-between" mb={4}>
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={goToPreviousMonth}
          aria-label="Vorige maand"
        />
        <Text fontSize="xl" fontWeight="bold">
          {new Date(currentYear, currentMonth).toLocaleString("nl-NL", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={goToNextMonth}
          aria-label="Volgende maand"
        />
      </Flex>

      {/* Kalender */}
      <CalendarGrid
        days={days}
        disabledDates={disabledDates}
        checkIn={checkIn}
        checkOut={checkOut}
        onDateClick={handleDateSelection}
        isInteractive={property?.isActive ?? true}
      />

      {/* Prijsweergave */}
      {nightCount > 0 && (
        <Box mt={6}>
          <Text fontSize="lg" fontWeight="bold">
            {nightCount} nacht(en) × €{pricePerNight} = €{totalPrice}
          </Text>
        </Box>
      )}

      {/* Boek nu */}
      <Button
        mt={6}
        colorScheme="blue"
        isDisabled={!checkIn || !checkOut || !property?.isActive}
        onClick={() => setIsModalOpen(true)}
      >
        Boek nu
      </Button>

      {/* Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyId={propertyId}
        pricePerNight={pricePerNight}
        checkIn={checkIn}
        checkOut={checkOut}
        isActive={property?.isActive ?? true}
        onBookingCreated={() => {
          toast({
            title: "Boeking geslaagd",
            description: "Je reservering is succesvol aangemaakt.",
            status: "success",
            duration: 4000,
            isClosable: true,
          });

          loadDisabled();
          setCheckIn(null);
          setCheckOut(null);

          navigate("/profile?tab=bookings");
        }}
        onBookingCancelled={() => {
          toast({
            title: "Geen boeking gemaakt",
            description: "U heeft geen reservering voltooid.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });

          setCheckIn(null);
          setCheckOut(null);
        }}
      />
    </Box>
  );
}
