// ============================================================
// = NAV LINKS                                                 =
// ============================================================

import { HStack, Link, useColorModeValue } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// ============================================================
// = COMPONENT                                                 =
// ============================================================
export default function NavLinks({ direction = "row", onClick }) {
  const { user } = useAuth();

  const linkColor = useColorModeValue("gray.800", "gray.100");
  const hoverColor = useColorModeValue("teal.600", "teal.300");

  return (
    <HStack spacing={6} flexDir={direction} alignItems="flex-start">

      {/* HOME */}
      <Link
        as={NavLink}
        to="/"
        onClick={onClick}
        color={linkColor}
        _hover={{ color: hoverColor }}
      >
        Home
      </Link>

      {/* PROFIEL */}
      {user && (
        <Link
          as={NavLink}
          to="/profile"
          onClick={onClick}
          color={linkColor}
          _hover={{ color: hoverColor }}
        >
          Mijn Profiel
        </Link>
      )}

      {/* HOST */}
      {user?.isHost && (
        <Link
          as={NavLink}
          to="/host"
          onClick={onClick}
          color={linkColor}
          _hover={{ color: hoverColor }}
        >
          Host Dashboard
        </Link>
      )}
    </HStack>
  );
}
