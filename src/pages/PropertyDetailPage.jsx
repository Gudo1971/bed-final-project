// ============================================================
// = PROPERTY DETAIL PAGE (MET AIRBNB-STYLE SKELETON)          =
// ============================================================

import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Center,
  Flex,
  Avatar,
  IconButton,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { getPropertyById } from "../api/properties.js";
import { getReviewsByPropertyId } from "../api/reviews.js";
import { getDisabledDates } from "../api/bookings.js";

import CalendarGrid from "../components/calendar/CalendarGrid.jsx";
import ImageCarousel from "../components/images/ImageCarousel.jsx";
import ReviewCarousel from "../components/reviews/Reviewcarousel.jsx";

import StarDisplay from "../components/stars/StarDisplay.jsx";
import { useAuth } from "../components/context/AuthContext.jsx";

// ============================================================
// = COMPONENT                                                 =
// ============================================================
export default function PropertyDetailPage() {
  const { user, token } = useAuth();
  const isAuthenticated = !!user && !!token;

  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);

  // ============================================================
  // = CALENDAR STATE                                           =
  // ============================================================
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [days, setDays] = useState([]);

  // ============================================================
  // = KLEUREN                                                  =
  // ============================================================
  const backLinkColor = useColorModeValue("gray.700", "teal.200");
  const backLinkHoverColor = useColorModeValue("teal.600", "teal.300");
  const titleColor = useColorModeValue("gray.900", "white");
  const locationColor = useColorModeValue("gray.600", "gray.300");
  const sectionTitleColor = useColorModeValue("gray.900", "white");
  const hostEmailColor = useColorModeValue("gray.600", "gray.300");

  // ============================================================
  // = PROPERTY OPHALEN                                         =
  // ============================================================
  useEffect(() => {
    if (!id) return;

    getPropertyById(id)
      .then((data) => setProperty(data))
      .catch((err) => console.error("Fout bij ophalen property:", err));
  }, [id]);

  // ============================================================
  // = REVIEWS OPHALEN                                          =
  // ============================================================
  useEffect(() => {
    if (!id) return;

    getReviewsByPropertyId(id)
      .then(setReviews)
      .catch((err) => console.error("Fout bij ophalen reviews:", err));
  }, [id]);

  // ============================================================
  // = DISABLED DATES OPHALEN                                   =
  // ============================================================
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

  // ============================================================
  // = KALENDERDAGEN GENEREREN                                  =
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
  // = LOADING STATE (SKELETON)                                 =
  // ============================================================
  const isLoading = !property;

  if (isLoading) {
    return (
      <Box px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }}>
        <VStack align="stretch" spacing={6}>

          {/* HERO IMAGE */}
          <Skeleton height="300px" borderRadius="lg" />

          {/* TITLE */}
          <Skeleton height="28px" width="60%" />
          <Skeleton height="20px" width="40%" />

          {/* RATING */}
          <Skeleton height="20px" width="30%" />

          {/* CALENDAR */}
          <Skeleton height="40px" width="50%" />
          <Skeleton height="300px" borderRadius="lg" />

          {/* DETAILS */}
          <Skeleton height="24px" width="30%" />
          <SkeletonText noOfLines={4} spacing="3" />

          {/* HOST */}
          <Skeleton height="24px" width="20%" />
          <Flex align="center" gap={4}>
            <SkeletonCircle size="12" />
            <SkeletonText noOfLines={2} spacing="3" width="40%" />
          </Flex>

          {/* REVIEWS */}
          <Skeleton height="200px" borderRadius="lg" />

          {/* BOOK BUTTON */}
          <Skeleton height="50px" width="200px" borderRadius="md" />

        </VStack>
      </Box>
    );
  }

  // ============================================================
  // = DATA NA LOADING                                          =
  // ============================================================
  const host = property.host;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // ============================================================
  // = RENDER                                                   =
  // ============================================================
  return (
    <Box px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }}>

      {/* TERUG NAAR OVERZICHT */}
      <Text
        onClick={() => navigate("/properties")}
        cursor="pointer"
        textDecoration="underline"
        mb={4}
        color={backLinkColor}
        _hover={{ color: backLinkHoverColor }}
      >
        ← Terug naar overzicht
      </Text>

      {/* TITEL */}
      <Heading
        mb={2}
        fontSize="2xl"
        fontWeight="extrabold"
        letterSpacing="-0.5px"
        color={titleColor}
      >
        {property.title}
      </Heading>

      {/* LOCATIE */}
      <Text mb={2} fontSize="md" color={locationColor}>
        📍 {property.location}
      </Text>

      {/* RATING */}
      <Flex align="center" gap={2} mb={6}>
        <StarDisplay rating={averageRating} size="26px" />
        <Text fontSize="md" color="gray.600">
          {averageRating.toFixed(1)} ({reviews.length})
        </Text>
      </Flex>

      {/* AFBEELDINGEN */}
      {property.images?.length > 0 && (
        <Box mb={8} width="100%">
          <ImageCarousel images={property.images} />
        </Box>
      )}

      {/* KALENDER */}
      <Box mb={10}>
        <Heading size="md" mb={3} color={sectionTitleColor}>
          Beschikbaarheid
        </Heading>

        <Flex
          align="center"
          justify="space-between"
          mb={4}
          flexWrap="wrap"
          gap={3}
        >
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

        <CalendarGrid
          days={days}
          disabledDates={disabledDates}
          checkIn={null}
          checkOut={null}
          onDateClick={() => {}}
          isInteractive={false}
        />
      </Box>

      {/* DETAILS */}
      <Box mb={8}>
        <Heading size="md" mb={3} color={sectionTitleColor}>
          Details
        </Heading>

        <Flex direction="column" gap={2} fontSize="md">
          <Text>💶 <b>Prijs per nacht:</b> €{property.pricePerNight}</Text>
          <Text>🛏 <b>Slaapkamers:</b> {property.bedroomCount}</Text>
          <Text>🛁 <b>Badkamers:</b> {property.bathRoomCount}</Text>
          <Text>👥 <b>Max gasten:</b> {property.maxGuestCount}</Text>

          <Flex align="center" gap={2}>
            <StarDisplay rating={averageRating} size="22px" />
            <Text fontSize="sm" color="gray.600">
              {averageRating.toFixed(1)} ({reviews.length})
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* HOST */}
      {host && (
        <Box mb={10}>
          <Heading size="md" mb={4} color={sectionTitleColor}>
            Host
          </Heading>

          <Flex align="center" gap={4}>
            <Avatar size="lg" name={host.name} src={host.pictureUrl} />

            <Box>
              <Text fontSize="lg" fontWeight="bold">
                {host.name}
              </Text>
              <Text fontSize="sm" color={hostEmailColor}>
                {host.email}
              </Text>

              <Button
                as={Link}
                to={`/host-profile/${host.id}`}
                state={{ host }}
              >
                Over de Host
              </Button>
            </Box>
          </Flex>
        </Box>
      )}

      {/* REVIEWS */}
      <Box mb={10}>
        <ReviewCarousel
          reviews={reviews}
          propertyId={id}
          onRefresh={() =>
            getReviewsByPropertyId(id)
              .then(setReviews)
              .catch((err) =>
                console.error("Fout bij refresh reviews:", err)
              )
          }
        />
      </Box>

      {/* BOEK NU */}
      <VStack align="start" spacing={6} w="100%" mt={10}>
        <Button
          as={Link}
          to={isAuthenticated ? `/booking/${property.id}` : "#"}
          colorScheme="teal"
          size="lg"
          isDisabled={!isAuthenticated}
        >
          {isAuthenticated ? "Boek nu" : "Log in om te boeken"}
        </Button>
      </VStack>
    </Box>
  );
}
