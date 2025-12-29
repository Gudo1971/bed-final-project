// ==============================================
// = ACCOUNT TAB                                 =
// = Instellingen, host-status, acties           =
// ==============================================

import {
  Box,
  Heading,
  Text,
  Stack,
  useToast,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";

import { FiSettings } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import PasswordChangeModal from "../account/PasswordChangeModal";
import EditPersonalInfoModal from "../account/EditPersonalInfoModal";
import SettingsDrawer from "../account/SettingsDrawer";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountTab() {
  const { user, logout, becomeHost, stopHost } = useAuth();

  const [isPasswordOpen, setPasswordOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const cardBg = useColorModeValue("gray.50", "gray.700");
  const labelColor = useColorModeValue("gray.600", "gray.300");

  /* ==============================================
     LOGOUT
  ============================================== */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ==============================================
     BECOME HOST
  ============================================== */
  const handleBecomeHost = async () => {
    try {
      await becomeHost();
      toast({
        title: "Je bent nu host!",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Fout",
        description: err.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  /* ==============================================
     STOP HOST
  ============================================== */
  const handleCancelHost = async () => {
    const confirmCancel = window.confirm(
      "Weet je zeker dat je wilt stoppen als host?"
    );
    if (!confirmCancel) return;

    try {
      await stopHost();
      toast({
        title: "Host account gedeactiveerd",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Fout",
        description: err.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box position="relative">

      {/* ============================================== */}
      {/* = SETTINGS ICON                               = */}
      {/* ============================================== */}
      <IconButton
        icon={<FiSettings />}
        aria-label="Instellingen"
        variant="ghost"
        size="lg"
        position="absolute"
        top={-2}
        right={2}
        onClick={() => setDrawerOpen(true)}
      />

      {/* ============================================== */}
      {/* = TITEL                                       = */}
      {/* ============================================== */}
      <Heading size="md" mb={10}>
        Account
      </Heading>

      {/* ============================================== */}
      {/* = INFO CARD                                   = */}
      {/* ============================================== */}
      <Box
        bg={cardBg}
        p={5}
        borderRadius="lg"
        boxShadow="sm"
        mb={6}
      >
        <Stack spacing={4}>
          <Box>
            <Text fontWeight="bold" color={labelColor}>
              E‑mail
            </Text>
            <Text>{user?.email}</Text>
          </Box>

          <Box>
            <Text fontWeight="bold" color={labelColor}>
              Accounttype
            </Text>
            <Text>{user?.isHost ? "Host" : "Geregistreerde gebruiker"}</Text>
          </Box>
        </Stack>
      </Box>

      {/* ============================================== */}
      {/* = SETTINGS DRAWER                             = */}
      {/* ============================================== */}
      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEditPersonal={() => setEditOpen(true)}
        onChangePassword={() => setPasswordOpen(true)}
        onBecomeHost={handleBecomeHost}
        onStopHost={handleCancelHost}
        onLogout={handleLogout}
        isHost={user?.isHost}
      />

      {/* ============================================== */}
      {/* = MODALS                                      = */}
      {/* ============================================== */}
      <PasswordChangeModal
        isOpen={isPasswordOpen}
        onClose={() => setPasswordOpen(false)}
      />

      <EditPersonalInfoModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
      />
    </Box>
  );
}
