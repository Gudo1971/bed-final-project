// ============================================================
// = NAVBAR (RESPONSIVE + MATCHING DROPDOWNS)                 =
// ============================================================

import {
  Box,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Text,
  Spacer,
  Image,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Collapse,
  useDisclosure,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext.jsx";

import { useState } from "react";
import logo from "../../assets/StayBnBLogoTransparant.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { colorMode, toggleColorMode } = useColorMode();
  const mobileMenu = useDisclosure();

  const [profileOpen, setProfileOpen] = useState(false);
  const [hostOpen, setHostOpen] = useState(false);

  const bg = useColorModeValue("white", "gray.800");
  const linkColor = useColorModeValue("gray.800", "gray.100");
  const hoverColor = useColorModeValue("teal.600", "teal.300");
  const activeColor = useColorModeValue("teal.700", "teal.200");

  const activeStyle = ({ isActive }) => ({
    fontWeight: isActive ? "700" : "500",
  });

  function goTo(path) {
    navigate(path);
    mobileMenu.onClose();
  }

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="5000"
      bg={bg}
      boxShadow="sm"
      px={6}
      py={4}
    >
      <HStack spacing={8} align="center" width="100%">

        {/* LOGO */}
        <Image
          src={logo}
          alt="StayBnB logo"
          height="40px"
          cursor="pointer"
          onClick={() => navigate("/")}
          _hover={{ opacity: 0.8 }}
        />

        {/* DESKTOP NAV LINKS */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          <Link
            as={NavLink}
            to="/properties"
            style={activeStyle}
            color={linkColor}
            _hover={{ color: hoverColor }}
            _activeLink={{ color: activeColor }}
          >
            Home
          </Link>

          {user && (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                color={linkColor}
                _hover={{ color: hoverColor }}
              >
                Mijn Profiel
              </MenuButton>
              <MenuList zIndex={6000}>
                <MenuItem onClick={() => goTo("/profile")}>Mijn Profiel</MenuItem>
                <MenuItem onClick={() => goTo("/profile?tab=bookings")}>Mijn Boekingen</MenuItem>
                <MenuItem onClick={() => goTo("/profile?tab=reviews")}>Mijn Reviews</MenuItem>
                <MenuItem onClick={() => goTo("/profile?tab=account")}>Mijn Account</MenuItem>
              </MenuList>
            </Menu>
          )}

          {user?.isHost && (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                color={linkColor}
                _hover={{ color: hoverColor }}
              >
                Host Dashboard
              </MenuButton>
              <MenuList zIndex={6000}>
                <MenuItem onClick={() => goTo("/host/dashboard")}>Dashboard</MenuItem>
                <MenuItem onClick={() => goTo("/host/properties")}>Accommodaties</MenuItem>
                <MenuItem onClick={() => goTo("/host/bookings")}>Boekingen</MenuItem>
                <MenuItem onClick={() => goTo("/host/earnings")}>Verdiensten</MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>

        <Spacer />

        {/* DESKTOP USER INFO */}
        <HStack spacing={4} align="center" display={{ base: "none", md: "flex" }}>
          {user && (
            <>
              <Avatar name={user.name} size="sm" />
              <Text fontWeight="medium">{user.name}</Text>
              <Button size="sm" variant="outline" onClick={logout}>Logout</Button>
            </>
          )}

          {!user && (
            <Button size="sm" colorScheme="teal" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}

          <Button size="sm" variant="ghost" onClick={toggleColorMode}>
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          </Button>
        </HStack>

        {/* MOBILE HAMBURGER BUTTON */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<HamburgerIcon />}
          variant="ghost"
          onClick={mobileMenu.onOpen}
        />
      </HStack>

      {/* MOBILE DRAWER MENU */}
      <Drawer placement="right" onClose={mobileMenu.onClose} isOpen={mobileMenu.isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <VStack align="stretch" spacing={3}>

              {/* HOME */}
              <Button variant="ghost" justifyContent="flex-start" onClick={() => goTo("/properties")}>
                Home
              </Button>

              {/* PROFIEL DROPDOWN */}
              {user && (
                <Box>
                  <Button
                    variant="ghost"
                    justifyContent="space-between"
                    width="100%"
                    onClick={() => setProfileOpen((prev) => !prev)}
                  >
                    Mijn Profiel
                  </Button>

                  <Collapse in={profileOpen} animateOpacity>
                    <VStack align="stretch" pl={4} mt={2} spacing={2}>
                      <Button variant="ghost" justifyContent="flex-start" onClick={() => goTo("/profile")}>
                        Mijn Profiel
                      </Button>
                      <Button variant="ghost" justifyContent="flex-start" onClick={() => goTo("/profile?tab=bookings")}>
                        Mijn Boekingen
                      </Button>
                      <Button variant="ghost" justifyContent="flex-start" onClick={() => goTo("/profile?tab=reviews")}>
                        Mijn Reviews
                      </Button>
                      <Button variant="ghost" justifyContent="flex-start" onClick={() => goTo("/profile?tab=account")}>
                        Mijn Account
                      </Button>
                    </VStack>
                  </Collapse>
                </Box>
              )}

              {/* HOST DROPDOWN */}
              {user?.isHost && (
                <Box>
                  <Button
                    variant="ghost"
                    justifyContent="space-between"
                    width="100%"
                    onClick={() => setHostOpen((prev) => !prev)}
                  >
                    Host Dashboard
                  </Button>

                  <Collapse in={hostOpen} animateOpacity>
                    <VStack align="stretch" pl={4} mt={2} spacing={2}>
                      <Button variant="ghost" justifyContent="flex-start" onClick={() => goTo("/host/dashboard")}>
                        Dashboard
                      </Button>
                      <Button variant="ghost" justifyContent="flex-start" onClick={() => goTo("/host/properties")}>
                        Accommodaties
                      </Button>
                      <Button variant="ghost" justifyContent="flex-start" onClick={() => goTo("/host/bookings")}>
                        Boekingen
                      </Button>
                      <Button variant="ghost" justifyContent="flex-start" onClick={() => goTo("/host/earnings")}>
                        Verdiensten
                      </Button>
                    </VStack>
                  </Collapse>
                </Box>
              )}

              {/* DARK MODE */}
              <Button
                variant="ghost"
                justifyContent="flex-start"
                leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              >
                {colorMode === "light" ? "Dark Mode" : "Light Mode"}
              </Button>

              {/* AUTH */}
              {user ? (
                <Button colorScheme="red" justifyContent="flex-start" onClick={logout} mt={2}>
                  Logout
                </Button>
              ) : (
                <Button colorScheme="teal" justifyContent="flex-start" onClick={() => goTo("/login")} mt={2}>
                  Login
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
