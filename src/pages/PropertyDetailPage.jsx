import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// API calls
import { getPropertyById } from "../api/properties";
import { getReviewsByPropertyId } from "../api/reviews";
import { getDisabledDates } from "../api/bookings.js";

// UI componenten
import CalendarGrid from "../components/calendar/CalendarGrid";
import ImageCarousel from "../components/images/ImageCarousel";
import ReviewCarousel from "../components/reviews/Reviewcarousel";

// AuthContext
import { useAuth } from "../components/context/AuthContext";

export default function PropertyDetailPage() {
  // ==============================================
  // = AUTHENTICATIE BLOK                        =
  // ==============================================
  const { user, token } = useAuth();
  const isAuthenticated = !!user && !!token;

  // ==============================================
  // = ROUTER PARAMS                              =
  // ==============================================
  const { id } = useParams();
  const navigate = useNavigate();

  // ==============================================
  // = STATE BLOKKEN                              =
  // ==============================================
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [days, setDays] = useState([]);

  // ==============================================
  // = PROPERTY OPHALEN                           =
  // ==============================================
  useEffect(() => {
    if (!id) return;

    getPropertyById(id)
      .then(setProperty)
      .catch((err) => console.error("Fout bij ophalen property:", err));
  }, [id]);

  // ==============================================
  // = REVIEWS OPHALEN                            =
  // ==============================================
  useEffect(() => {
    if (!id) return;

    getReviewsByPropertyId(id)
      .then(setReviews)
      .catch((err) => console.error("Fout bij ophalen reviews:", err));
  }, [id]);

  // ==============================================
  // = DISABLED DATES OPHALEN (correcte /api route)=
  // ==============================================
  useEffect(() => {
    if (!id) return;

    getDisabledDates(id)
      .then((data) => {
        const parsed =
          Array.isArray(data)
            ? data
            : Array.isArray(data.disabledDates)
            ? data.disabledDates
            : [];

        setDisabledDates(parsed);
      })
      .catch((err) => {
        console.error("Fout bij ophalen disabled dates:", err);
        setDisabledDates([]);
      });
  }, [id]);

  // ==============================================
  // = KALENDERDAGEN GENEREREN (huidige maand)    =
  // ==============================================
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
      d = new Date(d.getTime() + 86400000)
    ) {
      tempDays.push(new Date(d));
    }

    setDays(tempDays);
  }, []);

  // ==============================================
  // = LOADING STATE                              =
  // ==============================================
  if (!property) return <Text>Loading...</Text>;

  // ==============================================
  // = RENDER                                     =
  // ==============================================
  return (
    <Box>
      {/* ============================================== */}
      {/* = TERUG NAAR OVERZICHT                       = */}
      {/* ============================================== */}
      <Text
        onClick={() => navigate("/")}
        cursor="pointer"
        textDecoration="underline"
        mb={2}
      >
        ← Terug naar overzicht
      </Text>

      {/* ============================================== */}
      {/* = TITEL                                      = */}
      {/* ============================================== */}
      <Heading mb={4}>{property.title}</Heading>

      {/* ============================================== */}
      {/* = AFBEELDINGEN                               = */}
      {/* ============================================== */}
      {property.images?.length > 0 && (
        <Box mb={4} width="100%" height="350px" position="relative">
          <ImageCarousel images={property.images} />
        </Box>
      )}

      {/* ============================================== */}
      {/* = BESCHRIJVING                               = */}
      {/* ============================================== */}
      <Text mb={6}>{property.description}</Text>

      {/* ============================================== */}
      {/* = REVIEWS                                    = */}
      {/* ============================================== */}
      <ReviewCarousel
        reviews={reviews}
        onRefresh={() =>
          getReviewsByPropertyId(id)
            .then(setReviews)
            .catch((err) => console.error("Fout bij refresh reviews:", err))
        }
      />

      {/* ============================================== */}
      {/* = KALENDER                                   = */}
      {/* ============================================== */}
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

      {/* ============================================== */}
      {/* = BOEK NU KNOP                               = */}
      {/* ============================================== */}
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
