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
import { Link, useNavigate } from "react-router-dom";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { userData, setUserData } = useUser();
  const navigate = useNavigate();

  async function handleBecomeHost() {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: "https://staybnb-api/" },
      });

      const res = await fetch("http://localhost:3000/users/become-host", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = await res.json();
      setUserData(updated);

      navigate("/host");
    } catch (err) {
      console.error("Become host failed:", err);
    }
  }

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

          {/* Become Host / Host Dashboard */}
          {isAuthenticated && userData && !userData.isHost && (
            <Button colorScheme="green" onClick={handleBecomeHost}>
              Become a Host
            </Button>
          )}

          {isAuthenticated && userData && userData.isHost && (
            <Button colorScheme="blue" onClick={() => navigate("/host")}>
              Host Dashboard
            </Button>
          )}

          {/* Login / Logout */}
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
