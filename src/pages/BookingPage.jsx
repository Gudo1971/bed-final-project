// src/pages/BookingPage.jsx
import { useState, useEffect } from "react";
import CalendarGrid from "../components/calendar/CalendarGrid";
import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import { useBookingForm } from "../hoooks/useBookingForm";
import ImageUploadTest from "../components/uploads/ImageUploadTest";

export default function BookingPage() {
  const { propertyId } = useParams();
  const { user } = useAuth();   // ← FIXED

  // Property en kalender state
  const [property, setProperty] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);
  const [days, setDays] = useState([]);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  // Formatter voor datums (YYYY-MM-DD)
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Maandnavigatie
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  // Genereer alle dagen van de geselecteerde maand
  useEffect(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const temp = [];
    for (
      let d = firstDay;
      d <= lastDay;
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    ) {
      temp.push(new Date(d));
    }

    setDays(temp);
  }, [currentYear, currentMonth]);

  // Disabled dates ophalen
  useEffect(() => {
    async function fetchDisabledDates() {
      try {
        const res = await fetch(
          `http://localhost:3000/bookings/disabled-dates/${propertyId}`
        );
        const data = await res.json();
        setDisabledDates(data);
      } catch (err) {
        console.error("Error fetching disabled dates:", err);
      }
    }

    fetchDisabledDates();
  }, [propertyId]);

  // Datumselectie voor check-in en check-out
  const handleDateSelection = (date) => {
    const dateStr = formatDate(date);

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut(null);
    } else {
      if (new Date(dateStr) > new Date(checkIn)) {
        setCheckOut(dateStr);
      } else {
        setCheckIn(dateStr);
        setCheckOut(null);
      }
    }
  };

  // Aantal nachten berekenen
  const getNightCount = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return (end - start) / (1000 * 60 * 60 * 24);
  };

  const nightCount = getNightCount();
  const pricePerNight = 100;
  const totalPrice = nightCount * pricePerNight;

  // React Hook Form + Yup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useBookingForm();

  // Submit handler
  const onSubmit = async (formData) => {
    if (!checkIn || !checkOut) {
      alert("Selecteer eerst een check-in en check-out datum.");
      return;
    }

    if (!user) {
      alert("Je moet ingelogd zijn om te boeken.");
      return;
    }
    try {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,   // ← BELANGRIJK
    },
    body: JSON.stringify({
      propertyId,
      checkIn,
      checkOut,
      guests: Number(formData.guests),
      notes: formData.notes,
    }),
  });
     

      if (response.status === 409) {
        alert(
          "Binnen uw geselecteerde periode zitten bezette datums. Selecteer een andere periode."
        );
        return;
      }

      if (!response.ok) {
        alert("Er ging iets mis bij het boeken.");
        return;
      }

      alert("Boeking succesvol.");
      reset();
      setCheckIn(null);
      setCheckOut(null);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Er ging iets mis bij het boeken.");
    }
  };

  return (
    <Box p={6}>
      {/* Maandnavigatie */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button onClick={goToPrevMonth}>← Vorige maand</Button>

        <Text fontSize="xl" fontWeight="bold">
          {new Date(currentYear, currentMonth).toLocaleString("nl-NL", {
            month: "long",
            year: "numeric",
          })}
        </Text>

        <Button onClick={goToNextMonth}>Volgende maand →</Button>
      </Box>

      {/* Kalender */}
      <CalendarGrid
        days={days}
        disabledDates={disabledDates}
        checkIn={checkIn}
        checkOut={checkOut}
        onDateClick={handleDateSelection}
        setDisabledDates={setDisabledDates}
        isInteractive={true}
      />

      {/* Prijsindicatie */}
      {nightCount > 0 && (
        <Box mt={6}>
          <Text fontSize="lg" fontWeight="bold">
            {nightCount} nacht{nightCount > 1 ? "en" : ""} × €{pricePerNight} = €
            {totalPrice}
          </Text>
        </Box>
      )}

      {/* Formulier */}
      <Box as="form" onSubmit={handleSubmit(onSubmit)} mt={8}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel>Naam</FormLabel>
            <Input
              {...register("name")}
              autoComplete="name"
              onInput={(e) =>
                setValue("name", e.target.value, { shouldValidate: true })
              }
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel>E-mail</FormLabel>
            <Input
              {...register("email")}
              autoComplete="email"
              onInput={(e) =>
                setValue("email", e.target.value, { shouldValidate: true })
              }
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.guests} isRequired>
            <FormLabel>Aantal gasten</FormLabel>
            <Input
              type="number"
              min={1}
              {...register("guests")}
              onInput={(e) =>
                setValue("guests", e.target.value, { shouldValidate: true })
              }
            />
            <FormErrorMessage>{errors.guests?.message}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Opmerkingen</FormLabel>
            <Input {...register("notes")} />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isDisabled={!checkIn || !checkOut || isSubmitting}
            isLoading={isSubmitting}
          >
            Boek nu
          </Button>
        </VStack>

        <ImageUploadTest />
      </Box>
    </Box>
  );
}
