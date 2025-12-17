import { Box, Heading, Text, Button, Stack } from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AccountTab() {
  const { user, logout } = useAuth0();

  return (
    <Box>
      <Heading size="md" mb={4}>
        Account
      </Heading>

      <Stack spacing={4}>
        <Box>
          <Text fontWeight="bold">E‑mail:</Text>
          <Text>{user?.email}</Text>
        </Box>

        <Button
          colorScheme="teal"
          onClick={() =>
            logout({
              logoutParams: { returnTo: window.location.origin },
            })
          }
        >
          Uitloggen
        </Button>

        <Text fontSize="sm" color="gray.500">
          Wachtwoord wijzigen doe je via Auth0.  
          (Later kunnen we hier een link of modal voor toevoegen.)
        </Text>
      </Stack>
    </Box>
  );
}
