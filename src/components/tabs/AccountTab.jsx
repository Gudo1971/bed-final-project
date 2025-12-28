import { Box, Heading, Text, Button, Stack, useToast } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import PasswordChangeModal from "../account/PasswordChangeModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountTab() {
  const { user, logout, becomeHost, stopHost } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  /* ===========================================================
     Logout
  ============================================================ */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ===========================================================
     Become Host
  ============================================================ */
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

  /* ===========================================================
     Stop Host Account (echt)
  ============================================================ */
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
    <Box>
      <Heading size="md" mb={4}>
        Account
      </Heading>

      <Stack spacing={4}>
        {/* Email */}
        <Box>
          <Text fontWeight="bold">E‑mail:</Text>
          <Text>{user?.email}</Text>
        </Box>

        {/* Account Type */}
        <Box>
          <Text fontWeight="bold">Account type:</Text>
          <Text>{user?.isHost ? "Host" : "Geregistreerde gebruiker"}</Text>
        </Box>

        {/* Host Actions */}
        {!user?.isHost && (
          <Button colorScheme="teal" onClick={handleBecomeHost}>
            Word Host
          </Button>
        )}

        {user?.isHost && (
          <Button colorScheme="red" variant="outline" onClick={handleCancelHost}>
            Stop Host Account
          </Button>
        )}

        {/* Password Change */}
        <Button colorScheme="teal" onClick={() => setIsOpen(true)}>
          Wachtwoord wijzigen
        </Button>

        {/* Logout */}
        <Button colorScheme="red" variant="outline" onClick={handleLogout}>
          Uitloggen
        </Button>
      </Stack>

      <PasswordChangeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
}
