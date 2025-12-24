import {
  Box,
  Flex,
  HStack,
  Button,
  Avatar,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";

import { useAuth } from "../../components/context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

          {/* Login knop */}
          {!user && (
            <Button colorScheme="teal" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}

          {/* Avatar + naam + logout */}
          {user && (
            <HStack spacing={3}>
              <Avatar size="sm" name={user.name || user.email} />
              <Text>{user.name || user.email}</Text>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={logout}
              >
                Logout
              </Button>
            </HStack>
          )}

          {/* Mobile menu */}
          <MobileMenu />
        </HStack>
      </Flex>
    </Box>
  );
}
