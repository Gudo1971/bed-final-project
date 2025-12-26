import { HStack, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavLinks() {
  const { user } = useAuth();

  return (
    <HStack spacing={6}>
      <Link as={NavLink} to="/">
        Home
      </Link>

      {user && (
        <Link as={NavLink} to="/profile">
          Mijn Profiel
        </Link>
      )}

      {user?.isHost && (
        <Link as={NavLink} to="/host">
          Host Dashboard
        </Link>
      )}
    </HStack>
  );
}
