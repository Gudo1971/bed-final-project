// ============================================================
// = PROPERTY CARD                                             =
// = Kaartweergave voor property overzicht                    =
// ============================================================

import {
  Box,
  Heading,
  Text,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

// ============================================================
// = COMPONENT                                                 =
// ============================================================
export default function PropertyCard({ property }) {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.300");

  // ==============================================
  // = VEILIGE THUMBNAIL FALLBACK                 =
  // ==============================================
  const imageUrl =
    property?.images?.[0]?.url ??
    "https://placehold.co/400x250?text=Geen+afbeelding";

  return (
    <Link to={`/properties/${property.id}`}>
      <Box
        bg={cardBg}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        shadow="sm"
        transition="all 0.2s"
        _hover={{
          shadow: "lg",
          transform: "translateY(-3px)",
        }}
      >
        {/* ============================================== */}
        {/* = AFBEELDING                                  = */}
        {/* ============================================== */}
        <Image
          src={imageUrl}
          alt={property.title}
          w="100%"
          h="200px"
          objectFit="cover"
          fallbackSrc="https://placehold.co/400x250?text=Geen+afbeelding"
        />

        <Box p={5}>
          {/* ============================================== */}
          {/* = TITEL                                       = */}
          {/* ============================================== */}
          <Heading size="md" color={textColor}>
            {property.title}
          </Heading>

          {/* ============================================== */}
          {/* = BESCHRIJVING                                = */}
          {/* ============================================== */}
          <Text mt={2} color={subTextColor} noOfLines={2}>
            {property.description}
          </Text>

          {/* ============================================== */}
          {/* = PRIJS                                       = */}
          {/* ============================================== */}
          <Text fontWeight="bold" mt={3} color={textColor}>
            €{property.pricePerNight} / nacht
          </Text>

          {/* ============================================== */}
          {/* = DETAILS                                     = */}
          {/* ============================================== */}
          <Text mt={2} color={subTextColor}>
            🛏 {property.bedroomCount} | 🛁 {property.bathRoomCount} | 👥{" "}
            {property.maxGuestCount}
          </Text>

          {/* ============================================== */}
          {/* = RATING                                      = */}
          {/* ============================================== */}
          <Text mt={2} color={textColor}>
            ⭐ {property.rating}
          </Text>
        </Box>
      </Box>
    </Link>
  );
}
