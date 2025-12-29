// ==============================================
// = PROFILE TAB                                 =
// = Persoonsgegevens van ingelogde gebruiker    =
// ==============================================

import { Box, Heading, Text, Stack, Avatar, useColorModeValue } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfileTab() {
  // ==============================================
  // = AUTH — USER DATA                           =
  // ==============================================
  const { user } = useAuth();

  const labelColor = useColorModeValue("gray.600", "gray.300");
  const valueColor = useColorModeValue("gray.800", "gray.100");

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box>

      {/* ============================================== */}
      {/* = TITEL                                       = */}
      {/* ============================================== */}
      <Heading size="md" mb={6}>
        Persoonsgegevens
      </Heading>

      {/* ============================================== */}
      {/* = LAYOUT: AVATAR + INFO                       = */}
      {/* ============================================== */}
      <Stack
        direction={{ base: "column", sm: "row" }}
        spacing={8}
        align={{ base: "center", sm: "flex-start" }}
      >
        {/* ============================================== */}
        {/* = AVATAR                                      = */}
        {/* ============================================== */}
        <Avatar
          size="xl"
          name={user?.name}
          src={user?.pictureUrl}
        />

        {/* ============================================== */}
        {/* = USER INFO                                   = */}
        {/* ============================================== */}
        <Box textAlign={{ base: "center", sm: "left" }}>
          <Text fontWeight="bold" color={labelColor}>
            Naam:
          </Text>
          <Text mb={4} color={valueColor}>
            {user?.name}
          </Text>

          <Text fontWeight="bold" color={labelColor}>
            E‑mail:
          </Text>
          <Text mb={4} color={valueColor}>
            {user?.email}
          </Text>

          <Text fontWeight="bold" color={labelColor}>
            Telefoon nummer:
          </Text>
          <Text color={valueColor}>
            {user?.phoneNumber}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}
