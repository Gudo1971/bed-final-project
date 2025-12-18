import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { updateBooking } from "../../services/bookings";
import { useEffect, useState } from "react";

export default function BookingEditModal({ isOpen, onClose, booking }) {
  const toast = useToast();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      startDate: booking?.startDate,
      endDate: booking?.endDate,
    },
  });

  // Reset form when booking changes
  useEffect(() => {
    if (booking) {
      reset({
        startDate: booking.startDate,
        endDate: booking.endDate,
      });
    }
  }, [booking, reset]);

  // ✔ Correcte onSubmit
  async function onSubmit(values) {
    try {
      await updateBooking(booking.id, values);

      toast({
        title: "Boeking bijgewerkt",
        description: "De wijzigingen zijn opgeslagen.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        description: "Probeer het opnieuw.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Boeking bewerken</ModalHeader>

        <ModalBody>
          <Text mb={4} fontWeight="bold">
            {booking.propertyName}
          </Text>

          <form id="edit-booking-form" onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={4}>
              <FormLabel>Startdatum</FormLabel>
              <Input type="date" {...register("startDate")} />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Einddatum</FormLabel>
              <Input type="date" {...register("endDate")} />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Annuleren
          </Button>
          <Button colorScheme="teal" type="submit" form="edit-booking-form">
            Opslaan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
