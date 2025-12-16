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
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function BookingPage() {
  const { propertyId } = useParams();
  const { user } = useAuth0();

  const [property, setProperty] = useState(null);
  const [disabledDates, setDisabledDates] = useState([]);
  const [days, setDays] = useState([]);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  // ⭐ Formatter die matcht met CalendarGrid
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // ⭐ Maandnavigatie
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

  // ⭐ Genereer dagen voor de geselecteerde maand
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

  // ⭐ Property ophalen
  useEffect(() => {
    async function fetchProperty() {
      const res = await fetch(`http://localhost:3000/properties/${propertyId}`);
      const data = await res.json();
      setProperty(data);
    }
    fetchProperty();
  }, [propertyId]);

  // ⭐ Disabled dates ophalen (strings laten!)
  useEffect(() => {
    async function fetchDisabledDates() {
      try {
        const res = await fetch(
          `http://localhost:3000/bookings/disabled-dates/${propertyId}`
        );
        const data = await res.json();

        console.log("DISABLED DATES RAW:", data);

        setDisabledDates(data);
      } catch (err) {
        console.error("Error fetching disabled dates:", err);
      }
    }

    fetchDisabledDates();
  }, [propertyId]);

  // ⭐ Datumselectie — nu met formatDate()
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

  // ⭐ Aantal nachten
  const getNightCount = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return (end - start) / (1000 * 60 * 60 * 24);
  };

  const nightCount = getNightCount();
  const pricePerNight = property?.pricePerNight || 0;
  const totalPrice = nightCount * pricePerNight;

  // ⭐ Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");

  // ⭐ Boeking versturen
  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert("Selecteer eerst een check-in en check-out datum.");
      return;
    }

    try {
        console.log("BOOKING PAYLOAD:", {
         user,
         auth0Id: user?.sub,
         propertyId,
         checkIn,
         checkOut,
         guests,
       });
      const response = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
         auth0Id: user.sub,     
         propertyId,  
         checkIn,  
         checkOut, 
         guests,    
}),
      });

      if (!response.ok) throw new Error("Boeking mislukt");

      alert("Boeking succesvol!");
    } catch (error) {
      console.error(error);
      alert("Er ging iets mis bij het boeken.");
    }
  };

  return (
    <Box p={6}>
      {/* ⭐ Maandnavigatie */}
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

      {/* ⭐ Kalender */}
      <CalendarGrid
        days={days}
        disabledDates={disabledDates}
        checkIn={checkIn}
        checkOut={checkOut}
        onDateClick={handleDateSelection}
        setDisabledDates={setDisabledDates}  
      />

      {/* ⭐ Prijs */}
      {nightCount > 0 && (
        <Box mt={6}>
          <Text fontSize="lg" fontWeight="bold">
            {nightCount} nacht{nightCount > 1 ? "en" : ""} × €
            {pricePerNight} = €{totalPrice}
          </Text>
        </Box>
      )}

      {/* ⭐ Formulier */}
      <VStack spacing={4} mt={8} align="stretch">
        <FormControl>
          <FormLabel>Naam</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>E-mail</FormLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Aantal gasten</FormLabel>
          <Input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Opmerkingen</FormLabel>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormControl>

        <Button
          colorScheme="blue"
          onClick={handleBooking}
          isDisabled={!checkIn || !checkOut}
        >
          Boek nu
        </Button>
      </VStack>
    </Box>
  );
}
