import {
  Box,
  Flex,
  HStack,
  Button,
  Avatar,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="sm"
      px={6}
      py={4}
    >
      <Flex justify="space-between" align="center">
        
        {/* Logo */}
        <Link to="/">
          <Text fontSize="xl" fontWeight="bold">
            StayBnB
          </Text>
        </Link>

        {/* Desktop links */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          <NavLinks />
        </HStack>

        <HStack spacing={4}>
          <ThemeToggle />

          {!isAuthenticated && (
            <Button colorScheme="teal" onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}

          {isAuthenticated && (
            <HStack spacing={3}>
              <Avatar size="sm" src={user.picture} name={user.name} />
              <Text>{user.name}</Text>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
              >
                Logout
              </Button>
            </HStack>
          )}

          {/* Mobile hamburger */}
          <MobileMenu />
        </HStack>
      </Flex>
    </Box>
  );
}
