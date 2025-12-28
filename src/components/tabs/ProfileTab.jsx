// ==============================================
// = PROFILE TAB                                 =
// = Persoonsgegevens van ingelogde gebruiker    =
// ==============================================

import { Box, Heading, Text, Stack, Avatar } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfileTab() {
  // ==============================================
  // = AUTH — USER DATA                           =
  // ==============================================
  const { user } = useAuth();

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box>
      {/* ============================================== */}
      {/* = TITEL                                       = */}
      {/* ============================================== */}
      <Heading size="md" mb={4}>
        Persoonsgegevens
      </Heading>

      {/* ============================================== */}
      {/* = LAYOUT: AVATAR + INFO                       = */}
      {/* ============================================== */}
      <Stack direction="row" spacing={6} align="center">
        
        {/* ============================================== */}
        {/* = AVATAR                                      = */}
        {/* ============================================== */}
        <Avatar
          size="xl"
          name={user?.name}
          src={user?.pictureUrl}   // ⭐ jouw backend gebruikt pictureUrl
        />

        {/* ============================================== */}
        {/* = USER INFO                                   = */}
        {/* ============================================== */}
        <Box>
          <Text fontWeight="bold">Naam:</Text>
          <Text mb={3}>{user?.name}</Text>

          <Text fontWeight="bold">E‑mail:</Text>
          <Text>{user?.email}</Text>
        </Box>
      </Stack>
    </Box>
  );
}
