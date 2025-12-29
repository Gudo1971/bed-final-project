// ============================================================
// = SETTINGS DRAWER                                          =
// ============================================================

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  Button,
  VStack,
  Divider,
  Icon,
} from "@chakra-ui/react";

import { FiEdit, FiKey, FiHome, FiLogOut } from "react-icons/fi";

export default function SettingsDrawer({
  isOpen,
  onClose,
  onEditPersonal,
  onChangePassword,
  onBecomeHost,
  onStopHost,
  onLogout,
  isHost,
}) {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Instellingen</DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} align="stretch">

            {/* Persoonsgegevens */}
            <Button
              leftIcon={<FiEdit />}
              colorScheme="teal"
              variant="ghost"
              justifyContent="flex-start"
              onClick={() => {
                onClose();
                onEditPersonal();
              }}
            >
              Persoonsgegevens wijzigen
            </Button>

            {/* Wachtwoord */}
            <Button
              leftIcon={<FiKey />}
              colorScheme="teal"
              variant="ghost"
              justifyContent="flex-start"
              onClick={() => {
                onClose();
                onChangePassword();
              }}
            >
              Wachtwoord wijzigen
            </Button>

            <Divider />

            {/* Host acties */}
            {!isHost && (
              <Button
                leftIcon={<FiHome />}
                colorScheme="teal"
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  onClose();
                  onBecomeHost();
                }}
              >
                Word Host
              </Button>
            )}

            {isHost && (
              <Button
                leftIcon={<FiHome />}
                colorScheme="red"
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  onClose();
                  onStopHost();
                }}
              >
                Stop Host Account
              </Button>
            )}

            <Divider />

            {/* Uitloggen */}
            <Button
              leftIcon={<FiLogOut />}
              colorScheme="red"
              variant="ghost"
              justifyContent="flex-start"
              onClick={() => {
                onClose();
                onLogout();
              }}
            >
              Uitloggen
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
