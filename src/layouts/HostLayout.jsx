// ============================================================
// = HOST LAYOUT (PROTECTED)                                  =
// = Alleen toegankelijk voor hosts                           =
// = Navbar + responsive container                            =
// ============================================================

import { Outlet, Navigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/navbar/Navbar.jsx";
import { useAuth } from "../components/context/AuthContext.jsx";

export default function HostLayout() {
  const { user } = useAuth();

  // ==============================================
  // = PROTECT ROUTE                              =
  // ==============================================
  if (!user || !user.isHost) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* ============================================== */}
      {/* = NAVBAR                                      = */}
      {/* ============================================== */}
      <Navbar />

      {/* ============================================== */}
      {/* = PAGE CONTAINER                              = */}
      {/* ============================================== */}
      <Box
        maxW="1200px"
        mx="auto"
        px={{ base: 2, sm: 3, md: 6 }}   // ⭐ FIX: meer ruimte op small
        py={{ base: 6, md: 10 }}
      >
        <Outlet />
      </Box>
    </>
  );
}
