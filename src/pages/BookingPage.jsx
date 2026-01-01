// ============================================================
// = BOOKING PAGE                                             =
// ============================================================

import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Flex,
  IconButton,
  Spinner,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useParams, useNavigate, Link } from "react-router-dom";

import CalendarGrid from "../components/calendar/CalendarGrid";
import BookingModal from "../components/booking/BookingModal";
import { useAuth } from "../components/context/AuthContext";


import api from "../api/axios";

export default function BookingPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { user, token } = useAuth();
  const isAuthenticated = !!user && !!token;

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

  // ============================================================
  // = AUTH REDIRECT                                            =
  // ============================================================
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { message: "Je moet ingelogd zijn om een boeking te plaatsen." },
      });
    }
  }, [isAuthenticated, navigate]);

  // ============================================================
  // = DATA LOAD (AXIOS INSTANCE)                               =
  // ============================================================
  const loadProperty = async () => {
    const res = await api.get(`/properties/${propertyId}`);
    return res.data;
  };

  const loadDisabled = async () => {
    const res = await api.get(`/bookings/disabled-dates/${propertyId}`);
    return res.data;
  };

  useEffect(() => {
    async function loadAll() {
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
          description: err.error || "Kon de gegevens niet ophalen.",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, [propertyId, isAuthenticated, toast]);

  // ============================================================
  // = CALENDAR DAYS GENERATION                                 =
  // ============================================================
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

  // ============================================================
  // = LOADING STATE                                            =
  // ============================================================
  if (!isAuthenticated || loading) {
    return (
      <Flex align="center" justify="center" mt={20}>
        <Spinner size="xl" color="blue.500" />
        <Text ml={4} fontSize="lg">
          Bezig met laden...
        </Text>
      </Flex>
    );
  }

  // ============================================================
  // = DATE SELECTION                                           =
  // ============================================================
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

  // ============================================================
  // = MONTH NAVIGATION                                         =
  // ============================================================
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

  // ============================================================
  // = PRICE CALCULATION                                        =
  // ============================================================
  const nightCount =
    checkIn && checkOut
      ? (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
      : 0;

  const totalPrice = nightCount * pricePerNight;

  // ============================================================
  // = RENDER                                                   =
  // ============================================================
  const titleColor = useColorModeValue("teal.600", "teal.300");

  return (
    <Box maxW="800px" mx="auto" p={{ base: 4, md: 6 }} pb={10}>

      {/* TERUGKNOP */}
      <Button
        as={Link}
        to={`/properties/${propertyId}`}
        variant="ghost"
        colorScheme="teal"
        size="sm"
        mb={4}
      >
        ← Terug naar overzicht
      </Button>

      <Text
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="bold"
        mb={4}
        color={titleColor}
        textAlign="center"
      >
        Selecteer je datums
      </Text>

      {/* MONTH NAVIGATION */}
      <Flex align="center" justify="space-between" mb={4} flexWrap="wrap" gap={3}>
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={goToPreviousMonth}
          aria-label="Vorige maand"
        />

        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
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

      {/* CALENDAR GRID */}
      <Box overflowX="auto">
        <CalendarGrid
          days={days}
          disabledDates={disabledDates}
          checkIn={checkIn}
          checkOut={checkOut}
          onDateClick={handleDateSelection}
          isInteractive={property?.isActive ?? true}
        />
      </Box>

      {/* PRICE DISPLAY */}
      {nightCount > 0 && (
        <Box mt={6} textAlign="center">
          <Text fontSize="lg" fontWeight="bold">
            {nightCount} nacht(en) × €{pricePerNight} = €{totalPrice}
          </Text>
        </Box>
      )}

      {/* BOOK BUTTON */}
      <Flex justify="center">
        <Button
          mt={6}
          colorScheme="blue"
          size="lg"
          isDisabled={!checkIn || !checkOut || !property?.isActive}
          onClick={() => setIsModalOpen(true)}
        >
          Boek nu
        </Button>
      </Flex>

      {/* BOOKING MODAL */}
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
          });

          setCheckIn(null);
          setCheckOut(null);
        }}
      />
    </Box>
  );
}
