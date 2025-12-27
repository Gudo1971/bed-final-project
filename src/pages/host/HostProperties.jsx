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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { useAuth } from "../../components/context/AuthContext.jsx";
import PropertyForm from "../../components/properties/PropertyForm.jsx";
import { getHostProperties, toggleProperty } from "../../api/host.js";
import EditPropertyModal from "../../components/properties/EditPropertyModal.jsx";


export default function HostProperties() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
  isOpen: isEditOpen,
  onOpen: onEditOpen,
  onClose: onEditClose,
} = useDisclosure();

  const { user, token } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);


  /* -----------------------------------------------------------
     Toggle active/inactive
  ----------------------------------------------------------- */
  async function handleToggle(propertyId, newState) {
    try {
      await toggleProperty(propertyId, newState, token);
      fetchProperties(); // refresh lijst
    } catch (err) {
      toast({
        title: "Fout bij wijzigen",
        description: "Kon de status niet aanpassen.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  /* -----------------------------------------------------------
     Redirect voor niet-hosts
  ----------------------------------------------------------- */
  useEffect(() => {
    if (user && user.isHost === false) {
      window.location.href = "/profile";
    }
  }, [user]);

  /* -----------------------------------------------------------
     Ophalen van properties van de ingelogde host
  ----------------------------------------------------------- */
  async function fetchProperties() {
    try {
      const data = await getHostProperties(token);
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      toast({
        title: "Fout bij ophalen",
        description: "Kon jouw properties niet laden.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  /* -----------------------------------------------------------
     Fetch uitvoeren zodra token beschikbaar is
  ----------------------------------------------------------- */
  useEffect(() => {
    if (!token) return;
    fetchProperties();
  }, [token]);

  /* -----------------------------------------------------------
     Loading state
  ----------------------------------------------------------- */
  if (loading) {
    return (
      <HStack>
        <Spinner />
        <Text>Properties laden...</Text>
      </HStack>
    );
  }

  /* -----------------------------------------------------------
     Render
  ----------------------------------------------------------- */
  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Mijn Properties</Heading>

        <Button colorScheme="teal" size="sm" onClick={onOpen}>
          Nieuwe Property
        </Button>
      </HStack>

      {properties.length === 0 && (
        <Text>Je hebt nog geen properties toegevoegd.</Text>
      )}

      <VStack align="stretch" spacing={4}>
        {properties.map((property) => (
          <Box
            key={property.id}
            border="1px solid #ddd"
            borderRadius="md"
            p={4}
            _hover={{ boxShadow: "md" }}
          >
            {/* Titel + Toggle */}
            <HStack justify="space-between" mb={2}>
              <Heading size="sm">{property.title}</Heading>

              <HStack spacing={3}>
                <Badge colorScheme={property.isActive ? "green" : "red"}>
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
                <Button size="xs" colorScheme="blue" onClick={() => { setSelectedProperty(property);
                   onEditOpen(); }}> Bewerken </Button>
              </HStack>
            </HStack>

            <Divider my={3} />

            {/* Details */}
            <VStack align="start" spacing={1}>
              <Text>
                <strong>Locatie:</strong> {property.location}
              </Text>

              <Text>
                <strong>Prijs per nacht:</strong> € {property.pricePerNight}
              </Text>

              <Text>
                <strong>Afbeeldingen:</strong> {property.images?.length || 0}
              </Text>
            </VStack>
          </Box>
        ))}
      </VStack>

      {/* Modal voor nieuwe property */}
      <PropertyForm
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={fetchProperties}
      />
      <EditPropertyModal
  isOpen={isEditOpen}
  onClose={onEditClose}
  property={selectedProperty}
  token={token}
  onSuccess={fetchProperties}
/>

    </Box>
  );
}
