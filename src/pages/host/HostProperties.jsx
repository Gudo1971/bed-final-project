// ============================================================
// = HOST PROPERTIES                                           =
// ============================================================

import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  HStack,
  Badge,
  Divider,
  Button,
  Switch,
  Stack,
  useDisclosure,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext.jsx";

import PropertyForm from "../../components/properties/PropertyForm.jsx";
import EditPropertyModal from "../../components/properties/EditPropertyModal.jsx";

// 👉 axios‑based API calls
import { getHostProperties, toggleProperty } from "../../api/host.js";
import api from "../../api/axios.js";

export default function HostProperties() {
  const toast = useToast();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // ============================================================
  // = COLOR MODE VALUES                                        =
  // ============================================================
  const cardBorderColor = useColorModeValue("gray.300", "gray.600");
  const cardBg = useColorModeValue("white", "gray.800");
  const thumbBg = useColorModeValue("gray.200", "gray.700");
  const headerColor = useColorModeValue("teal.700", "teal.300");

  // ============================================================
  // = MODALS                                                    =
  // ============================================================
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  // ============================================================
  // = STATE                                                     =
  // ============================================================
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // ============================================================
  // = REDIRECT ALS USER GEEN HOST IS                           =
  // ============================================================
  useEffect(() => {
    if (user && user.isHost === false) {
      window.location.href = "/profile";
    }
  }, [user]);

  // ============================================================
  // = PROPERTIES OPHALEN (AXIOS INSTANCE)                      =
  // ============================================================
  async function fetchProperties() {
    try {
      const data = await getHostProperties(); // token wordt automatisch toegevoegd
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({
        title: "Fout bij ophalen",
        description: err.error || "Kon jouw properties niet laden.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) return;
    fetchProperties();
  }, [token]);

  // ============================================================
  // = PROPERTY VERWIJDEREN (AXIOS INSTANCE)                    =
  // ============================================================
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Weet je zeker dat je deze property wilt verwijderen?"
    );
    if (!confirmDelete) return;

    try {
      setDeleteLoadingId(id);

      await api.delete(`/properties/${id}`);

      toast({
        title: "Property verwijderd",
        status: "success",
        duration: 3000,
      });

      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast({
        title: "Fout bij verwijderen",
        description: err.error || "Kon de property niet verwijderen.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setDeleteLoadingId(null);
    }
  }

  // ============================================================
  // = TOGGLE ACTIVE/INACTIVE                                   =
  // ============================================================
  async function handleToggle(propertyId, newState) {
    try {
      await toggleProperty(propertyId, newState);
      fetchProperties();
    } catch (err) {
      toast({
        title: "Fout bij wijzigen",
        description: err.error || "Kon de status niet aanpassen.",
        status: "error",
        duration: 3000,
      });
    }
  }

  // ============================================================
  // = LOADING STATE                                            =
  // ============================================================
  if (loading) {
    return (
      <HStack spacing={3} py={4}>
        <Spinner />
        <Text>Properties laden...</Text>
      </HStack>
    );
  }

  // ============================================================
  // = RENDER                                                   =
  // ============================================================
  return (
    <Box>
      <Button
        as="a"
        href="/host/dashboard"
        variant="ghost"
        colorScheme="teal"
        size="sm"
        mb={4}
      >
        ← Terug naar dashboard
      </Button>

      <HStack justify="space-between" mb={6} flexWrap="wrap" gap={3}>
        <Heading size="md" color={headerColor}>
          Mijn Properties
        </Heading>

        <Button colorScheme="teal" size="sm" onClick={onCreateOpen}>
          Nieuwe Property
        </Button>
      </HStack>

      {properties.length === 0 && (
        <Text color="gray.500" textAlign="center">
          Je hebt nog geen properties toegevoegd.
        </Text>
      )}

      <VStack align="stretch" spacing={5}>
        {properties.map((property) => {
          const imageUrl =
            property?.images?.[0]?.url ??
            "https://placehold.co/400x250?text=Geen+afbeelding";

          return (
            <Box
              key={property.id}
              border="1px solid"
              borderColor={cardBorderColor}
              borderRadius="lg"
              p={{ base: 4, md: 5 }}
              bg={cardBg}
              boxShadow="sm"
              _hover={{ boxShadow: "md", transform: "translateY(-3px)" }}
              transition="all 0.2s ease"
            >
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={4}
                align={{ base: "center", sm: "flex-start" }}
              >
                <Box
                  w="90px"
                  h="90px"
                  borderRadius="md"
                  overflow="hidden"
                  flexShrink={0}
                  bg={thumbBg}
                >
                  <img
                    src={imageUrl}
                    alt={property.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Box flex="1" width="100%">
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    justify={{ base: "center", sm: "space-between" }}
                    align={{ base: "center", sm: "center" }}
                    spacing={3}
                    width="100%"
                  >
                    <Heading
                      size="sm"
                      noOfLines={1}
                      textAlign={{ base: "center", sm: "left" }}
                    >
                      {property.title}
                    </Heading>

                    <HStack spacing={2}>
                      <Badge
                        colorScheme={property.isActive ? "green" : "red"}
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        textTransform="uppercase"
                        fontSize="0.7rem"
                      >
                        {property.isActive ? "Actief" : "Inactief"}
                      </Badge>

                      <Switch
                        size="md"
                        colorScheme="teal"
                        isChecked={property.isActive}
                        onChange={(e) =>
                          handleToggle(property.id, e.target.checked)
                        }
                      />
                    </HStack>
                  </Stack>

                  <Divider my={3} />

                  <VStack
                    align={{ base: "center", sm: "start" }}
                    spacing={1}
                    fontSize="sm"
                    textAlign={{ base: "center", sm: "left" }}
                  >
                    <Text><strong>Locatie:</strong> {property.location}</Text>
                    <Text><strong>Prijs per nacht:</strong> € {property.pricePerNight}</Text>
                    <Text><strong>Afbeeldingen:</strong> {property.images?.length || 0}</Text>
                  </VStack>

                  <HStack
                    justify={{ base: "center", sm: "flex-end" }}
                    spacing={2}
                    mt={4}
                  >
                    <Button
                      size="xs"
                      minW="90px"
                      colorScheme="blue"
                      onClick={() => {
                        setSelectedProperty(property);
                        onEditOpen();
                      }}
                    >
                      Bewerken
                    </Button>

                    <Button
                      size="xs"
                      minW="100px"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleDelete(property.id)}
                      isLoading={deleteLoadingId === property.id}
                    >
                      Verwijderen
                    </Button>
                  </HStack>
                </Box>
              </Stack>
            </Box>
          );
        })}
      </VStack>

      <PropertyForm
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={fetchProperties}
      />

      <EditPropertyModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        property={selectedProperty}
        onSuccess={fetchProperties}
      />
    </Box>
  );
}
