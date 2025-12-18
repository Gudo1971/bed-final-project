import { HStack, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function NavLinks({ direction = "row", onClick }) {
  const { isAuthenticated } = useAuth0();

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
