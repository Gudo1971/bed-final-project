import { Box, Heading, Text, Stack, Avatar } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

export default function ProfileTab() {
  const { user } = useAuth0();

  return (
    <Box>
      <Heading size="md" mb={4}>
        Persoonsgegevens
      </Heading>

      <Stack direction="row" spacing={6} align="center">
        <Avatar
          size="xl"
          name={user?.name}
          src={user?.picture}
        />

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
