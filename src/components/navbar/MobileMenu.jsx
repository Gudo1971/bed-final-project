// ============================================================
// = MOBILE MENU (StayBnB) — Zonder Zoeken                    =
// ============================================================

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Button,
  Divider,
  Avatar,
  Text,
  useDisclosure,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";

import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
import { useAuth } from "../../components/context/AuthContext.jsx";

export default function MobileMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const textColor = useColorModeValue("gray.800", "gray.100");

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  return (
    <>
      {/* ======================================================== */}
      {/* = HAMBURGER BUTTON                                      = */}
      {/* ======================================================== */}
      <IconButton
        icon={<HamburgerIcon />}
        variant="ghost"
        aria-label="Menu"
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
      />

      {/* ======================================================== */}
      {/* = DRAWER MENU                                           = */}
      {/* ======================================================== */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">StayBnB Menu</DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} align="stretch">

              {/* ==================================================== */}
              {/* = USER INFO                                          = */}
              {/* ==================================================== */}
              {user && (
                <VStack spacing={2} align="flex-start">
                  <Avatar size="md" name={user.name || user.email} />
                  <Text fontWeight="bold" color={textColor}>
                    {user.name || user.email}
                  </Text>
                </VStack>
              )}

              <Divider />

              {/* ==================================================== */}
              {/* = NAV LINKS — ROLE BASED                            = */}
              {/* ==================================================== */}
              <VStack spacing={4} align="stretch">

                {/* Home — altijd zichtbaar */}
                <Link to="/" onClick={onClose}>
                  <Button variant="ghost" width="100%">Home</Button>
                </Link>

                {/* ============================== */}
                {/* = HOST MENU                   = */}
                {/* ============================== */}
                {user?.isHost && (
                  <>
                    <Link to="/host/dashboard" onClick={onClose}>
                      <Button variant="ghost" width="100%">Host Dashboard</Button>
                    </Link>

                    <Link to="/host/properties" onClick={onClose}>
                      <Button variant="ghost" width="100%">Mijn Properties</Button>
                    </Link>

                    <Link to="/my-bookings" onClick={onClose}>
                      <Button variant="ghost" width="100%">Mijn Bookings</Button>
                    </Link>

                    <Link to="/profile" onClick={onClose}>
                      <Button variant="ghost" width="100%">Mijn Profiel</Button>
                    </Link>
                  </>
                )}

                {/* ============================== */}
                {/* = GAST MENU                   = */}
                {/* ============================== */}
                {user && !user.isHost && (
                  <>
                    

                    <Link to="/profile" onClick={onClose}>
                      <Button variant="ghost" width="100%">Mijn Profiel</Button>
                    </Link>
                  </>
                )}

                {/* ============================== */}
                {/* = NIET INGELOGD MENU          = */}
                {/* ============================== */}
                {!user && (
                  <>
                    <Link to="/login" onClick={onClose}>
                      <Button colorScheme="teal" width="100%">Login</Button>
                    </Link>
                  </>
                )}
              </VStack>

              <Divider />

              {/* ==================================================== */}
              {/* = THEME TOGGLE                                       = */}
              {/* ==================================================== */}
              <ThemeToggle />

              <Divider />

              {/* ==================================================== */}
              {/* = LOGOUT BUTTON                                      = */}
              {/* ==================================================== */}
              {user && (
                <Button
                  colorScheme="red"
                  variant="outline"
                  width="100%"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
