// ============================================================
// = NAVBAR                                                    =
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
  useColorModeValue,
} from "@chakra-ui/react";

import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const bg = useColorModeValue("white", "gray.800");
  const linkColor = useColorModeValue("gray.800", "gray.100");
  const hoverColor = useColorModeValue("teal.600", "teal.300");
  const activeColor = useColorModeValue("teal.700", "teal.200");

  const activeStyle = ({ isActive }) => ({
    fontWeight: isActive ? "700" : "500",
  });

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="2000"
      bg={bg}
      boxShadow="sm"
      px={6}
      py={4}
    >
      <HStack spacing={8} align="center" width="100%">
        {/* LOGO */}
        <Box fontWeight="bold" fontSize="xl" color={hoverColor}>
          StayBnB
        </Box>

        {/* NAV LINKS */}
        <HStack spacing={6}>
          {/* HOME */}
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

          {/* PROFIEL DROPDOWN */}
          {user && (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                color={linkColor}
                _hover={{ color: hoverColor }}
                fontWeight={
                  pathname.startsWith("/profile") ||
                  pathname.startsWith("/account")
                    ? "700"
                    : "500"
                }
              >
                Mijn Profiel
              </MenuButton>

              <MenuList zIndex={3000}>
                <MenuItem as={NavLink} to="/profile" style={activeStyle}>
                  Mijn Profiel
                </MenuItem>
                <MenuItem as={NavLink} to="/profile?tab=bookings">
                  Mijn Boekingen
                </MenuItem>
                <MenuItem as={NavLink} to="/profile?tab=reviews">
                  Mijn Reviews
                </MenuItem>
                <MenuItem as={NavLink} to="/account" style={activeStyle}>
                  Mijn Account
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* HOST DASHBOARD DROPDOWN */}
          {user?.isHost && (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                color={linkColor}
                _hover={{ color: hoverColor }}
                fontWeight={
                  pathname.startsWith("/host") || pathname === "/add-property"
                    ? "700"
                    : "500"
                }
              >
                Host Dashboard
              </MenuButton>

              <MenuList zIndex={3000}>
                <MenuItem as={NavLink} to="/host/dashboard" style={activeStyle}>
                  Host Dashboard
                </MenuItem>
                <MenuItem as={NavLink} to="/add-property">
                  Accommodatie Toevoegen
                </MenuItem>
                <MenuItem as={NavLink} to="/host/properties">
                  Accommodaties
                </MenuItem>
                <MenuItem as={NavLink} to="/host/bookings">
                  Boekingen
                </MenuItem>
                <MenuItem as={NavLink} to="/host/earnings">
                  Verdiensten
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>

        <Spacer />

        {/* USER INFO + LOGOUT */}
        {user && (
          <HStack spacing={4}>
            <Avatar name={user.name} size="sm" />
            <Text fontWeight="medium">{user.name}</Text>
            <Button size="sm" variant="outline" onClick={logout}>
              Logout
            </Button>
          </HStack>
        )}
      </HStack>
    </Box>
  );
}
