import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPropertyById } from "../api/properties";
import { getReviewsByPropertyId } from "../api/reviews";

import CalendarGrid from "../components/calendar/CalendarGrid";
import { useAuth0 } from "@auth0/auth0-react";
import ImageCarousel from "../components/images/ImageCarousel";
import ReviewCarousel from "../components/reviews/Reviewcarousel";

export default function PropertyDetailPage() {
  const { user, isAuthenticated } = useAuth0();
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const [days, setDays] = useState([]);

  useEffect(() => {
    getPropertyById(id).then(setProperty);
  }, [id]);

  useEffect(() => {
    getReviewsByPropertyId(id).then(setReviews);
  }, [id]);

  useEffect(() => {
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

  if (!property) return <Text>Loading...</Text>;

  return (
    <Box>
      <Text
        onClick={() => navigate("/")}
        cursor="pointer"
        textDecoration="underline"
      >
        ← Terug naar overzicht
      </Text>

      <Heading>{property.title}</Heading>

      {property.images?.length > 0 && (
        <Box mb={4} width="100%" height="350px" position="relative">
          <ImageCarousel images={property.images} />
        </Box>
      )}

      <Text>{property.description}</Text>

      <ReviewCarousel reviews={reviews} />

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

      <VStack align="start" spacing={6} w="100%" mt={8}>
        <Button as={Link} to={`/booking/${property.id}`} colorScheme="teal" mt={4}>
          Boek nu
        </Button>
      </VStack>
    </Box>
  );
}
