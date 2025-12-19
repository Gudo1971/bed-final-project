import { Box, Heading, Text, VStack, Button,} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPropertyById } from "../services/propertiesService";
import { getReviewsByPropertyId } from "../services/reviews";



import CalendarGrid from "../components/calendar/CalendarGrid";
import { io } from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";
import ImageCarousel from "../components/images/ImageCarousel";
import ReviewCarousel from "../components/reviews/Reviewcarousel";
export default function PropertyDetailPage() {




  // Auth0 user en login status
  const { user, isAuthenticated } = useAuth0();

  // Router helpers
  const { id } = useParams();
  
  const navigate = useNavigate();

  // Property data
  const [property, setProperty] = useState(null);

  // Reviews voor deze property
  const [reviews, setReviews] = useState([]);

  // Kalender state
  const [disabledDates, setDisabledDates] = useState([]);
  const [days, setDays] = useState([]);

  // Check-in en check-out (hier niet interactief)
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  // Wordt aangeroepen wanneer een nieuwe review is toegevoegd
  const handleReviewAdded = (newReview) => {
    setReviews((prev) => [...prev, newReview]);
  };

  // Property ophalen
  useEffect(() => {
    async function fetchProperty() {
      const data = await getPropertyById(id);
      setProperty(data);
    }
    fetchProperty();
  }, [id]);

  // Reviews ophalen
  useEffect(() => {
    async function fetchReviews() {
      const data = await getReviewsByPropertyId(id);
      setReviews(data);
    }
    fetchReviews();
  }, [id]);

  // Disabled dates ophalen voor de kalender
  useEffect(() => {
    async function fetchDisabled() {
      const res = await fetch(
        `http://localhost:3000/bookings/disabled-dates/${id}`
      );
      const data = await res.json();
      setDisabledDates(data);
    }
    fetchDisabled();
  }, [id]);

  // Dagen genereren voor de kalender (huidige maand)
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const tempDays = [];
    for (let d = firstDay; d <= lastDay; d = new Date(d.getTime() + 86400000)) {
      tempDays.push(new Date(d));
    }

    setDays(tempDays);
  }, []);

  // Realtime updates via socket.io
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("booking:created", (booking) => {
      if (booking.propertyId !== id) return;

      const start = new Date(booking.checkinDate);
      const end = new Date(booking.checkoutDate);

      const newDisabled = [];
      for (let d = start; d <= end; d = new Date(d.getTime() + 86400000)) {
        newDisabled.push(d.toISOString().split("T")[0]);
      }

      setDisabledDates((prev) => [...prev, ...newDisabled]);
    });

    return () => socket.disconnect();
  }, [id]);

  // Als property nog niet geladen is
  if (!property) return <Text>Loading...</Text>;

  return (
    <Box>
      {/* Link terug naar overzicht */}
      <Text
        onClick={() => navigate("/")}
        cursor="pointer"
        textDecoration="underline"
      >
        ← Terug naar overzicht
      </Text>
      {/* Titel en beschrijving */}
      <Heading>{property.title}</Heading>


      {/* Afbeeldingen carousel */}
      {property.images && property.images.length > 0 && (
        <Box mb={4} width="100%" height="350px" position="relative">
          <ImageCarousel images={property.images} />
        </Box>
      )}



      <Text>{property.description}</Text>

        {/* Review lijst altijd tonen */}
        <ReviewCarousel reviews={reviews} />

       


      {/* Kalender (read-only) */}
      <Box mt={6}>
        <CalendarGrid
          days={days}
          disabledDates={disabledDates}
          checkIn={null}
          checkOut={null}
          onDateClick={() => {}}
          setDisabledDates={() => {}}
          isInteractive={false}
        />
      </Box>

      

      {/* Reviews sectie */}
      <VStack align="start" spacing={6} w="100%" mt={8}>



       {/* Boek nu knop */}
      <Button
        as={Link}
        to={`/booking/${property.id}`}
        colorScheme="teal"
        mt={4}
      >
        Boek nu
      </Button>

        {/* Review formulier alleen tonen als gebruiker is ingelogd */}
       
              

      </VStack>
    </Box>
  );
}
