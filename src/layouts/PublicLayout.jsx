// ============================================================
// = PUBLIC LAYOUT                                             =
// ============================================================

import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/navbar/Navbar.jsx";
import { Footer } from "../components/layout/Footer.jsx";

export default function PublicLayout() {
  return (
    <>
      <Navbar />

      <Box
        w="100%"
        px={{ base: 3, sm: 4, md: 6 }}
        py={{ base: 4, md: 8 }}
        overflowX="hidden"
      >
        <Outlet />
      </Box>

      <Footer />
    </>
  );
}
