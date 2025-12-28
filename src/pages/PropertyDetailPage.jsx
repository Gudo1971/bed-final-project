import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// API calls voor property en reviews
import { getPropertyById } from "../api/properties";
import { getReviewsByPropertyId } from "../api/reviews";

// Kalender en media componenten
import CalendarGrid from "../components/calendar/CalendarGrid";
import ImageCarousel from "../components/images/ImageCarousel";
import ReviewCarousel from "../components/reviews/Reviewcarousel";

// Auth komt nu UITSLUITEND uit je eigen AuthContext
import { useAuth } from "../components/context/AuthContext";

export default function PropertyDetailPage() {
  // AuthContext: user en token komen uit backend (/auth/login + /auth/me)
  const { user, token } = useAuth();

  // Afgeleide loginstatus: ingelogd als er een geldige user is (of token)
  const isAuthenticated = !!user && !!token;

  // Router parameters en navigatie
  const { id } = useParams();
  const navigate = useNavigate();

  // State voor property, reviews, disabled dates en kalenderdagen
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [days, setDays] = useState([]);

  // Property ophalen op basis van ID
  useEffect(() => {
    if (!id) return;
    getPropertyById(id).then(setProperty).catch((err) => {
      console.error("Fout bij ophalen property:", err);
    });
  }, [id]);

  // Reviews ophalen voor deze property
  useEffect(() => {
    if (!id) return;
    getReviewsByPropertyId(id).then(setReviews).catch((err) => {
      console.error("Fout bij ophalen reviews:", err);
    });
  }, [id]);

  // Disabled dates ophalen voor de kalender
  useEffect(() => {
    if (!id) return;

    async function fetchDisabledDates() {
      try {
        const res = await fetch(
          `http://localhost:3000/bookings/disabled-dates/${id}`
        );

        if (!res.ok) {
          setDisabledDates([]);
          return;
        }

        const data = await res.json();

        // Data defensief parsen: kan array of object met disabledDates zijn
        const dates = Array.isArray(data)
          ? data
          : Array.isArray(data.disabledDates)
          ? data.disabledDates
          : [];

        setDisabledDates(dates);
      } catch (err) {
        console.error("Failed to fetch disabled dates", err);
        setDisabledDates([]);
      }
    }

    fetchDisabledDates();
  }, [id]);

  // Kalenderdagen genereren voor de huidige maand
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const tempDays = [];
    for (
      let d = firstDay;
      d <= lastDay;
      d = new Date(d.getTime() + 86400000) // 1 dag in ms
    ) {
      tempDays.push(new Date(d));
    }

    setDays(tempDays);
  }, []);

  // Loading state zolang property nog niet binnen is
  if (!property) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box>
      {/* Navigatie terug naar overzicht */}
      <Text
        onClick={() => navigate("/")}
        cursor="pointer"
        textDecoration="underline"
        mb={2}
      >
        ← Terug naar overzicht
      </Text>

      {/* Titel van de accommodatie */}
      <Heading mb={4}>{property.title}</Heading>

      {/* Afbeeldingen carousel indien aanwezig */}
      {property.images?.length > 0 && (
        <Box mb={4} width="100%" height="350px" position="relative">
          <ImageCarousel images={property.images} />
        </Box>
      )}

      {/* Beschrijving van de accommodatie */}
      <Text mb={6}>{property.description}</Text>

      {/* Review sectie met carousel; deze component zelf regelt de "Review toevoegen" knop voor ingelogde users */}
      <ReviewCarousel reviews={reviews} onRefresh={() => {
        // Optioneel: reviews herladen na nieuw review
        getReviewsByPropertyId(id).then(setReviews).catch((err) => {
          console.error("Fout bij refresh reviews:", err);
        });
      }} />

      {/* Kalender met disabled dates voor deze property */}
      <Box mt={6}>
        <CalendarGrid
          days={days}
          disabledDates={disabledDates}
          checkIn={null}
          checkOut={null}
          onDateClick={() => {}}
          setDisabledDates={() => {}}
          isInteractive={true}
        />
      </Box>

      {/* Boek nu knop, alleen actief voor ingelogde gebruikers (via AuthContext) */}
      <VStack align="start" spacing={6} w="100%" mt={8}>
        <Button
          as={Link}
          to={isAuthenticated ? `/booking/${property.id}` : "#"}
          colorScheme="teal"
          mt={4}
          isDisabled={!isAuthenticated}
        >
          {isAuthenticated ? "Boek nu" : "Log in om te boeken"}
        </Button>
      </VStack>
    </Box>
  );
}
