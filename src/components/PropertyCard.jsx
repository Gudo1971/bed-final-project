// ==============================================
// = PROPERTY CARD                               =
// = Kaartweergave voor property overzicht       =
// ==============================================

import { Box, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Link to={`/properties/${property.id}`}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        shadow="md"
        _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
        transition="all 0.2s"
      >
        {/* ============================================== */}
        {/* = TITEL                                       = */}
        {/* ============================================== */}
        <Heading size="md">{property.title}</Heading>

        {/* ============================================== */}
        {/* = BESCHRIJVING                                = */}
        {/* ============================================== */}
        <Text mt={1}>{property.description}</Text>

        {/* ============================================== */}
        {/* = PRIJS                                       = */}
        {/* ============================================== */}
        <Text fontWeight="bold" mt={2}>
          €{property.pricePerNight} / nacht
        </Text>

        {/* ============================================== */}
        {/* = DETAILS (kamers, badkamers, gasten)          = */}
        {/* ============================================== */}
        <Text mt={1}>
          🛏 {property.bedroomCount} | 🛁 {property.bathRoomCount} | 👥{" "}
          {property.maxGuestCount}
        </Text>

        {/* ============================================== */}
        {/* = RATING                                      = */}
        {/* ============================================== */}
        <Text mt={1}>⭐ {property.rating}</Text>
      </Box>
    </Link>
  );
}
