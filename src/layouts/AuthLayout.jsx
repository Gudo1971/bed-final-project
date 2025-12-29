// ============================================================
// = AUTH LAYOUT                                               =
// = Login / Register zonder navbar, mooi gecentreerd          =
// ============================================================

import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export default function AuthLayout() {
  return (
    <Box
      maxW="480px"
      mx="auto"
      px={{ base: 4, md: 6 }}
      py={{ base: 10, md: 16 }}
    >
      <Outlet />
    </Box>
  );
}
