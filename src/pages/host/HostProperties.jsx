// ==============================================
// = HOST PROPERTIES                             =
// = Overzicht + beheer van properties van host  =
// ==============================================

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
import EditPropertyModal from "../../components/properties/EditPropertyModal.jsx";

import { getHostProperties, toggleProperty } from "../../api/host.js";

export default function HostProperties() {
  const toast = useToast();

  // ==============================================
  // = MODALS                                     =
  // ==============================================
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

  // ==============================================
  // = AUTH                                       =
  // ==============================================
  const { user, token } = useAuth();

  // ==============================================
  // = STATE BLOKKEN                              =
  // ==============================================
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // ==============================================
  // = TOGGLE ACTIVE/INACTIVE                     =
  // ==============================================
  async function handleToggle(propertyId, newState) {
    try {
      await toggleProperty(propertyId, newState, token);
      fetchProperties();
    } catch (err) {
      toast({
        title: "Fout bij wijzigen",
        description: "Kon de status niet aanpassen.",
        status: "error",
        duration: 3000,
      });
    }
  }

  // ==============================================
  // = PROPERTY VERWIJDEREN                       =
  // ==============================================
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Weet je zeker dat je deze property wilt verwijderen?"
    );
    if (!confirmDelete) return;

    try {
      setDeleteLoadingId(id);

      const res = await fetch(`http://localhost:3000/api/properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }

      toast({
        title: "Property verwijderd",
        status: "success",
        duration: 3000,
      });

      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast({
        title: "Fout bij verwijderen",
        description: err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setDeleteLoadingId(null);
    }
  }

  // ==============================================
  // = REDIRECT ALS USER GEEN HOST IS             =
  // ==============================================
  useEffect(() => {
    if (user && user.isHost === false) {
      window.location.href = "/profile";
    }
  }, [user]);

  // ==============================================
  // = PROPERTIES OPHALEN                         =
  // ==============================================
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
      });
    } finally {
      setLoading(false);
    }
  }

  // ==============================================
  // = FETCH STARTEN ZODRA TOKEN BESTAAT          =
  // ==============================================
  useEffect(() => {
    if (!token) return;
    fetchProperties();
  }, [token]);

  // ==============================================
  // = LOADING STATE                              =
  // ==============================================
  if (loading) {
    return (
      <HStack>
        <Spinner />
        <Text>Properties laden...</Text>
      </HStack>
    );
  }

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box>
      {/* ============================================== */}
      {/* = HEADER + NIEUWE PROPERTY KNOP               = */}
      {/* ============================================== */}
      <HStack justify="space-between" mb={4}>
        <Heading size="md">Mijn Properties</Heading>

        <Button colorScheme="teal" size="sm" onClick={onCreateOpen}>
          Nieuwe Property
        </Button>
      </HStack>

      {/* ============================================== */}
      {/* = GEEN PROPERTIES                             = */}
      {/* ============================================== */}
      {properties.length === 0 && (
        <Text>Je hebt nog geen properties toegevoegd.</Text>
      )}

      {/* ============================================== */}
      {/* = PROPERTY LIJST                              = */}
      {/* ============================================== */}
      <VStack align="stretch" spacing={4}>
        {properties.map((property) => (
          <Box
            key={property.id}
            border="1px solid #ddd"
            borderRadius="md"
            p={4}
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            {/* ============================================== */}
            {/* = TITEL + STATUS + ACTIES                    = */}
            {/* ============================================== */}
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

                <Button
                  size="xs"
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
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleDelete(property.id)}
                  isLoading={deleteLoadingId === property.id}
                >
                  Verwijderen
                </Button>
              </HStack>
            </HStack>

            <Divider my={3} />

            {/* ============================================== */}
            {/* = DETAILS                                     = */}
            {/* ============================================== */}
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

      {/* ============================================== */}
      {/* = MODAL: NIEUWE PROPERTY                      = */}
      {/* ============================================== */}
      <PropertyForm
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSuccess={fetchProperties}
      />

      {/* ============================================== */}
      {/* = MODAL: PROPERTY BEWERKEN                    = */}
      {/* ============================================== */}
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
