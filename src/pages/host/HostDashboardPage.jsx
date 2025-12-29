// ==============================================
// = HOST DASHBOARD PAGE                         =
// = Centrale hub voor host acties               =
// ==============================================

import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Divider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";

import { useAuth } from "../../components/context/AuthContext.jsx";
import PropertyForm from "../../components/properties/PropertyForm.jsx";

export default function HostDashboardPage() {
  // ==============================================
  // = AUTH                                        =
  // ==============================================
  const { user } = useAuth();

  // ==============================================
  // = MODAL VOOR NIEUWE PROPERTY                  =
  // ==============================================
  const { isOpen, onOpen, onClose } = useDisclosure();

  // ==============================================
  // = REDIRECT ALS USER GEEN HOST IS              =
  // ==============================================
  if (user && !user.isHost) {
    window.location.href = "/profile";
    return null;
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box maxW="900px" mx="auto" mt={10} px={4}>
      
      {/* ============================================== */}
      {/* = TITEL + INTRO                               = */}
      {/* ============================================== */}
      <Heading
        size="lg"
        mb={2}
        textAlign={{ base: "center", sm: "left" }}
      >
        Host Dashboard
      </Heading>

      <Text
        fontSize="lg"
        mb={6}
        textAlign={{ base: "center", sm: "left" }}
        color={useColorModeValue("gray.600", "gray.300")}
      >
        Welkom terug, <strong>{user?.name}</strong>.  
        Je bent nu officieel host.
      </Text>

      <Divider mb={8} />

      {/* ============================================== */}
      {/* = SECTIES                                     = */}
      {/* ============================================== */}
      <VStack align="stretch" spacing={6}>
        
        {/* ============================================== */}
        {/* = ACCOMMODATIES                              = */}
        {/* ============================================== */}
        <Box
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue("gray.50", "gray.800")}
          _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
          transition="all 0.2s"
        >
          <Heading size="md" mb={2}>
            Jouw accommodaties
          </Heading>

          <Text mb={4} color={useColorModeValue("gray.600", "gray.300")}>
            Bekijk, bewerk of voeg nieuwe accommodaties toe.
          </Text>

          {/* ============================================== */}
          {/* = RESPONSIVE KNOPPEN BLOK                    = */}
          {/* ============================================== */}
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={3}
            align={{ base: "center", sm: "flex-start" }}
            flexWrap="wrap"                         // ⭐ FIX: voorkomt overflow
            justify={{ base: "center", sm: "flex-start" }}
          >
            <Button
              colorScheme="teal"
              onClick={onOpen}
              width={{ base: "100%", sm: "auto" }}  // ⭐ FIX: 100% op mobiel
            >
              Nieuwe accommodatie toevoegen
            </Button>

            <Button
              variant="outline"
              colorScheme="teal"
              as="a"
              href="/host/properties"
              width={{ base: "100%", sm: "auto" }}  // ⭐ FIX: 100% op mobiel
            >
              Mijn accommodaties bekijken
            </Button>
          </Stack>
        </Box>

        {/* ============================================== */}
        {/* = BOEKINGEN                                   = */}
        {/* ============================================== */}
        <Box
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue("gray.50", "gray.800")}
          _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
          transition="all 0.2s"
        >
          <Heading size="md" mb={2}>
            Boekingen
          </Heading>

          <Text mb={4} color={useColorModeValue("gray.600", "gray.300")}>
            Bekijk alle boekingen voor jouw accommodaties.
          </Text>

          <Button
            as="a"
            href="/host/bookings"
            colorScheme="purple"
            width={{ base: "100%", sm: "auto" }}    // ⭐ FIX
          >
            Bekijk boekingen
          </Button>
        </Box>

        {/* ============================================== */}
        {/* = VERDIENSTEN                                 = */}
        {/* ============================================== */}
        <Box
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue("gray.50", "gray.800")}
          _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
          transition="all 0.2s"
        >
          <Heading size="md" mb={2}>
            Verdiensten
          </Heading>

          <Text mb={4} color={useColorModeValue("gray.600", "gray.300")}>
            Bekijk je inkomsten en prestaties als host.
          </Text>

          <Button
            as="a"
            href="/host/earnings"
            colorScheme="orange"
            width={{ base: "100%", sm: "auto" }}    // ⭐ FIX
          >
            Bekijk verdiensten
          </Button>
        </Box>
      </VStack>

      {/* ============================================== */}
      {/* = MODAL: NIEUWE PROPERTY                      = */}
      {/* ============================================== */}
      <PropertyForm
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => console.log("Property saved")}
      />
    </Box>
  );
}
