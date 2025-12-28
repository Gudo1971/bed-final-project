// ==============================================
// = PASSWORD CHANGE MODAL                       =
// = Wachtwoord wijzigen via backend             =
// ==============================================

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { useAuth } from "../../components/context/AuthContext";
import { updatePassword } from "../../api/users";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function PasswordChangeModal({ isOpen, onClose }) {
  const toast = useToast();
  const { user } = useAuth();

  // ==============================================
  // = FORM SETUP                                 =
  // ==============================================
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // ==============================================
  // = SUBMIT HANDLER                             =
  // ==============================================
  const onSubmit = async (data) => {
    try {
      await updatePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast({
        title: "Wachtwoord gewijzigd",
        description: "Je nieuwe wachtwoord is opgeslagen",
        status: "success",
        duration: 3000,
      });

      reset();
      onClose();
    } catch (err) {
      toast({
        title: "Fout",
        description: err.response?.data?.error || "Er ging iets mis",
        status: "error",
        duration: 3000,
      });
    }
  };

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent>
        {/* ============================================== */}
        {/* = HEADER                                      = */}
        {/* ============================================== */}
        <ModalHeader>Wachtwoord wijzigen</ModalHeader>
        <ModalCloseButton />

        {/* ============================================== */}
        {/* = BODY                                        = */}
        {/* ============================================== */}
        <ModalBody>
          {/* Huidig wachtwoord */}
          <FormControl mb={4} isInvalid={errors.currentPassword}>
            <FormLabel>Huidig wachtwoord</FormLabel>
            <Input
              type="password"
              {...register("currentPassword", {
                required: "Veld is verplicht",
              })}
            />
            <FormErrorMessage>
              {errors.currentPassword?.message}
            </FormErrorMessage>
          </FormControl>

          {/* Nieuw wachtwoord */}
          <FormControl mb={4} isInvalid={errors.newPassword}>
            <FormLabel>Nieuw wachtwoord</FormLabel>
            <Input
              type="password"
              {...register("newPassword", {
                required: "Veld is verplicht",
                minLength: {
                  value: 8,
                  message: "Minimaal 8 tekens",
                },
              })}
            />
            <FormErrorMessage>
              {errors.newPassword?.message}
            </FormErrorMessage>
          </FormControl>

          {/* Herhaal nieuw wachtwoord */}
          <FormControl mb={4} isInvalid={errors.confirmPassword}>
            <FormLabel>Herhaal nieuw wachtwoord</FormLabel>
            <Input
              type="password"
              {...register("confirmPassword", {
                required: "Veld is verplicht",
                validate: (value) =>
                  value === watch("newPassword") ||
                  "Wachtwoorden komen niet overeen",
              })}
            />
            <FormErrorMessage>
              {errors.confirmPassword?.message}
            </FormErrorMessage>
          </FormControl>
        </ModalBody>

        {/* ============================================== */}
        {/* = FOOTER                                      = */}
        {/* ============================================== */}
        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">
            Annuleren
          </Button>

          <Button
            colorScheme="teal"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
