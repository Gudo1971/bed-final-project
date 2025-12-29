// ============================================================
// = NAVBAR (FINAL — CLEAN, RESPONSIVE, DARK MODE READY)       =
// ============================================================

import {
  Box,
  Flex,
  HStack,
  Button,
  Avatar,
  Text,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";

import NavLinks from "./NavLinks.jsx";
import MobileMenu from "./MobileMenu.jsx";

import { useAuth } from "../../components/context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { colorMode, toggleColorMode } = useColorMode();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // DARK MODE COLORS
  const bgColor = useColorModeValue("white", "gray.800");
  const logoColor = useColorModeValue("gray.900", "white");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box
      position="sticky"
      top="0"
      zIndex="1000"
      bg={bgColor}
      boxShadow="sm"
      px={{ base: 3, sm: 4, md: 6 }}
      py={{ base: 3, sm: 4 }}
      overflowX="hidden"
    >
      <Flex justify="space-between" align="center" w="100%">
        
        {/* ============================================== */}
        {/* = LOGO (LINKS)                                = */}
        {/* ============================================== */}
        <Link to="/">
          <Text fontSize="xl" fontWeight="bold" color={logoColor}>
            StayBnB
          </Text>
        </Link>

        {/* ============================================== */}
        {/* = DESKTOP NAV (md+)                           = */}
        {/* ============================================== */}
        <Flex
          display={{ base: "none", md: "flex" }}
          align="center"
          justify="space-between"
          w="100%"
          ml={20}
        >
          {/* LEFT SIDE: NAVLINKS */}
          <HStack spacing={8}>
            <NavLinks />
          </HStack>

          {/* RIGHT SIDE: USER + DARK MODE */}
          <HStack spacing={4}>

            {/* DARK MODE TOGGLE */}
            <IconButton
              aria-label="Toggle dark mode"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              color={textColor}
              _hover={{ bg: "gray.100", color: "teal.500" }}
            />

            {!user && (
              <Button
                colorScheme="teal"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}

            {user && (
              <HStack spacing={4}>
                <Avatar size="sm" name={user.name || user.email} />
                <Text
                  fontSize="sm"
                  color={textColor}
                  noOfLines={1}
                  maxW="140px"
                >
                  {user.name || user.email}
                </Text>
                <Button
                  variant="outline"
                  colorScheme="red"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </HStack>
            )}
          </HStack>
        </Flex>

        {/* ============================================== */}
        {/* = MOBILE MENU (rechtsboven)                   = */}
        {/* ============================================== */}
        <Box display={{ base: "block", md: "none" }}>
          <MobileMenu />
        </Box>
      </Flex>
    </Box>
  );
}
