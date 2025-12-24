import { Box, Heading, Text, Stack, Avatar } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProfileTab() {
  // Haal de ingelogde gebruiker op uit Auth0
  const { user } = useAuth0();

  return (
    <Box>
      {/* Titel van de sectie */}
      <Heading size="md" mb={4}>
        Persoonsgegevens
      </Heading>

      {/* Layout met avatar en tekst naast elkaar */}
      <Stack direction="row" spacing={6} align="center">
        
        {/* Profielfoto van de gebruiker */}
        <Avatar
          size="xl"
          name={user?.name}
          src={user?.picture}
        />

        {/* Gebruikersinformatie */}
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
