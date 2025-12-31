// ============================================================
// = EDIT PERSONAL INFO MODAL                                 =
// ============================================================

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import ProfileImageUpload from "../images/upload/ProfielfotoUpload.jsx";

export default function EditPersonalInfoModal({ isOpen, onClose }) {
  // 🔹 ALLE HOOKS EERST
  const toast = useToast();
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    pictureUrl: "",
  });

  useEffect(() => {
    if (user && isOpen) {
      setForm({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
        pictureUrl: user.pictureUrl || "",
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return; // extra safety

    try {
      const emailChanged = form.email !== user.email;

      await updateProfile(form);

      toast({
        title: "Gegevens bijgewerkt",
        description: emailChanged
          ? "Je e‑mail is gewijzigd. Log voortaan in met je nieuwe adres."
          : undefined,
        status: "success",
        duration: 4000,
      });

      onClose();

      if (emailChanged) {
        logout();
        navigate("/login");
      }
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        description: err.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  // 🔹 PAS NA ALLE HOOKS: CONDITIONEEL RENDEREN
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Persoonsgegevens wijzigen</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            <ProfileImageUpload
              pictureUrl={form.pictureUrl}
              setPictureUrl={(url) => setForm({ ...form, pictureUrl: url })}
            />

            <FormControl>
              <FormLabel>E‑mail</FormLabel>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Naam</FormLabel>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Telefoonnummer</FormLabel>
              <Input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
              />
            </FormControl>

            {user && form.email !== user.email && (
              <Text fontSize="sm" color="orange.500" mt={2}>
                ⚠️ Als je je e‑mail wijzigt, moet je voortaan inloggen met je nieuwe adres.
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Annuleren
          </Button>
          <Button colorScheme="teal" onClick={handleSave}>
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
