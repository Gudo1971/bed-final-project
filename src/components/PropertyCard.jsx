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
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

import StarDisplay from "../components/stars/StarDisplay.jsx";

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

  // ============================================================
  // = GEMIDDELDE RATING OP BASIS VAN REVIEWS                   =
  // ============================================================
  const averageRating =
    property.reviews?.length > 0
      ? property.reviews.reduce((sum, r) => sum + r.rating, 0) /
        property.reviews.length
      : 0;

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
        h="520px"
        display="flex"
        flexDirection="column"
      >
        {/* ============================================== */}
        {/* = AFBEELDING                                  = */}
        {/* ============================================== */}
        <Image
          src={imageUrl}
          alt={property.title}
          w="100%"
          h="220px"
          objectFit="cover"
          fallbackSrc="https://placehold.co/400x250?text=Geen+afbeelding"
        />

        {/* ============================================== */}
        {/* = CONTENT (BOVENSTE DEEL)                     = */}
        {/* ============================================== */}
        <Box p={5} flex="1" display="flex" flexDirection="column">
          
          {/*  PRIJS BOVENAAN */}
          <Text mb ={6} fontWeight="bold" fontSize="lg" color={textColor}>
            €{property.pricePerNight} / nacht
          </Text>

          <Heading size="md" mt={1} color={textColor}>
            {property.title}
          </Heading>

          <Text mt={2} color={subTextColor} noOfLines={2}>
            {property.description}
          </Text>

          <Text mt={2} color={subTextColor}>
            🛏 {property.bedroomCount} | 🛁 {property.bathRoomCount} | 👥{" "}
            {property.maxGuestCount}
          </Text>
        </Box>

        {/* ============================================== */}
        {/* = ONDERBALK (ALLEEN RATING)                   = */}
        {/* ============================================== */}
        <Box
          px={5}
          py={3}
          mt="auto"
          borderTop="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.600")}
        >
          <Flex align="center" gap={2}>
            <StarDisplay rating={averageRating} size="20px" />
            <Text fontSize="sm" color={textColor}>
              {averageRating.toFixed(1)} ({property.reviews?.length || 0})
            </Text>
          </Flex>
        </Box>
      </Box>
    </Link>
  );
}
