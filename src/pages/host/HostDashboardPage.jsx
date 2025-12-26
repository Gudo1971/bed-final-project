import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  useDisclosure
} from "@chakra-ui/react";
import { useAuth } from "../../components/context/AuthContext.jsx";
import PropertyForm from "../../components/properties/PropertyForm.jsx";

export default function HostDashboardPage() {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Niet-hosts blokkeren
  if (user && !user.isHost) {
    window.location.href = "/profile";
    return null;
  }

  return (
    <Box maxW="900px" mx="auto" mt={10} px={4}>
      <Heading size="lg" mb={4}>
        Host Dashboard
      </Heading>

      <Text fontSize="lg" mb={6}>
        Welkom terug, <strong>{user?.name}</strong> — je bent nu officieel host.
      </Text>

      <Divider mb={8} />

      <VStack align="stretch" spacing={6}>
        {/* Properties Section */}
        <Box p={5} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={2}>
            Jouw accommodaties
          </Heading>
          <Text mb={4}>
            Bekijk, bewerk of voeg nieuwe accommodaties toe.
          </Text>

          <HStack spacing={4}>
            <Button colorScheme="teal" onClick={onOpen}>
              Nieuwe accommodatie toevoegen
            </Button>

            <Button
              variant="outline"
              colorScheme="teal"
              as="a"
              href="/host/properties"
            >
              Mijn accommodaties bekijken
            </Button>
          </HStack>
        </Box>

        {/* Bookings Section */}
        <Box p={5} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={2}>
            Boekingen
          </Heading>
          <Text mb={4}>
            Bekijk alle boekingen voor jouw accommodaties.
          </Text>

          <Button as="a" href="/host/bookings" colorScheme="purple">
            Bekijk boekingen
          </Button>
        </Box>

        {/* Earnings Section */}
        <Box p={5} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={2}>
            Verdiensten
          </Heading>
          <Text mb={4}>
            Bekijk je inkomsten en prestaties als host.
          </Text>

          <Button as="a" href="/host/earnings" colorScheme="orange">
            Bekijk verdiensten
          </Button>
        </Box>
      </VStack>

      {/* MODAL STAAT ALTIJD IN DE DOM */}
      <PropertyForm
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => console.log("Property saved")}
      />
    </Box>
  );
}
