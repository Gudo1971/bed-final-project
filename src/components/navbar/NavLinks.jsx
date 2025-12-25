import { HStack, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NavLinks({ direction = "row", onClick }) {
  // Gebruik je eigen backend-auth
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <HStack spacing={6} flexDirection={direction}>
      <ChakraLink as={Link} to="/" onClick={onClick}>
        Home
      </ChakraLink>

      <ChakraLink as={Link} to="/properties" onClick={onClick}>
        Properties
      </ChakraLink>

      <ChakraLink as={Link} to="/bookings" onClick={onClick}>
        Bookings
      </ChakraLink>

      {isAuthenticated && (
        <ChakraLink as={Link} to="/profile" onClick={onClick}>
          Mijn profiel
        </ChakraLink>
      )}
    </HStack>
  );
}
