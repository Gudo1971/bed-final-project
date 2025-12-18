import { Box, Heading, Text, VStack, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPropertyById } from "../services/propertiesService";
import { getReviewsByPropertyId } from "../services/reviews";
import ReviewList from "../components/reviews/ReviewList";
import ReviewForm from "../components/reviews/ReviewForm";
import CalendarGrid from "../components/calendar/CalendarGrid";
import { io } from "socket.io-client";

import ImageCarousel from "../components/images/ImageCarousel";


export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);

  // ⭐ Kalender state
  const [disabledDates, setDisabledDates] = useState([]);
  const [days, setDays] = useState([]);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const user = { id: "ae62ded3-d6a5-480c-b471-de38efd885c1" }; // Mocked user

  const handleReviewAdded = (newReview) => {
    setReviews((prev) => [...prev, newReview]);
  };

  // ⭐ Fetch property
  useEffect(() => {
    async function fetchProperty() {
      const data = await getPropertyById(id);
       console.log("PROPERTY:", data);
      setProperty(data);
    }
    
    fetchProperty();
  }, [id]);

  // ⭐ Fetch reviews
  useEffect(() => {
    async function fetchReviews() {
      const data = await getReviewsByPropertyId(id);
      setReviews(data);
    }
    fetchReviews();
  }, [id]);

  // ⭐ Fetch disabled dates
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

  // ⭐ Generate days for the calendar (simple month view)
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

  // ⭐ Realtime updates
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("booking:created", (booking) => {
      if (booking.propertyId !== id) return; // alleen deze property

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

  // ⭐ Date click handler
  const handleDateClick = (date) => {
    const dateStr = date.toISOString().split("T")[0];

    if (!checkIn) {
      setCheckIn(dateStr);
    } else if (!checkOut && dateStr > checkIn) {
      setCheckOut(dateStr);
    } else {
      setCheckIn(dateStr);
      setCheckOut(null);
    }
  };

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
      {property.images && property.images.length > 0 && (
 <Box mb={4} width="100%" height="350px" position="relative">
  <ImageCarousel images={property.images} />
</Box>

)}



      <Heading>{property.title}</Heading>
      <Text>{property.description}</Text>

      {/* ⭐ Kalender */}
      <Box mt={6}>
        <CalendarGrid
          days={days}
          disabledDates={disabledDates}
          checkIn={checkIn}
          checkOut={checkOut}
          onDateClick={handleDateClick}
          setDisabledDates={setDisabledDates}
        />
      </Box>

      {/* ⭐ Boek nu knop */}
      <Button
        as={Link}
        to={`/booking/${property.id}`}
        colorScheme="teal"
        mt={4}
      >
        Boek nu
      </Button>

      {/* ⭐ Reviews */}
      <VStack align="start" spacing={6} w="100%" mt={8}>
        <ReviewForm
          propertyId={property.id}
          userId={user.id}
          onReviewAdded={handleReviewAdded}
        />

        <ReviewList reviews={reviews} />
      </VStack>
    </Box>
  );
}
