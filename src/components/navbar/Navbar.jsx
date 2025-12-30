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
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext.jsx";

// ============================================================
// = LOGO                                                      =
// ============================================================
import logo from "../../assets/StayBnBLogoTransparant.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;

  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue("white", "gray.800");
  const linkColor = useColorModeValue("gray.800", "gray.100");
  const hoverColor = useColorModeValue("teal.600", "teal.300");
  const activeColor = useColorModeValue("teal.700", "teal.200");

  const activeStyle = ({ isActive }) => ({
    fontWeight: isActive ? "700" : "500",
  });

  // ============================================================
  // = PROFIEL STATUS                                            =
  // ============================================================
  const isProfileRoot =
    pathname === "/profile" && (!search || search === "");

  const isProfileBookings =
    pathname === "/profile" && search?.includes("tab=bookings");

  const isProfileReviews =
    pathname === "/profile" && search?.includes("tab=reviews");

  const isProfileAccount =
    pathname === "/profile" && search?.includes("tab=account");

  const isAnyProfilePage = pathname.startsWith("/profile");

  // ============================================================
  // = HOST STATUS                                               =
  // ============================================================
  const isHostDashboard = pathname === "/host/dashboard";
  const isHostProperties = pathname === "/host/properties";
  const isHostBookings = pathname === "/host/bookings";
  const isHostEarnings = pathname === "/host/earnings";

  const isAnyHostPage = pathname.startsWith("/host");

  // ============================================================
  // = HELPER                                                    =
  // ============================================================
  function goTo(path) {
    navigate(path);
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
        
        {/* ============================================================
            LOGO → LANDING PAGE
        ============================================================ */}
        <Image
          src={logo}
          alt="StayBnB logo"
          height="40px"
          cursor="pointer"
          onClick={() => navigate("/")}
          _hover={{ opacity: 0.8 }}
        />

        {/* ============================================================
            NAV LINKS
        ============================================================ */}
        <HStack spacing={6}>

          {/* Home */}
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

          {/* Profiel Dropdown */}
          {user && (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                color={linkColor}
                _hover={{ color: hoverColor }}
                fontWeight={isAnyProfilePage ? "700" : "500"}
              >
                Mijn Profiel
              </MenuButton>

              <MenuList zIndex={6000}>

                <MenuItem
                  onClick={() => !isProfileRoot && goTo("/profile")}
                  isDisabled={isProfileRoot}
                  fontWeight={isProfileRoot ? "700" : "500"}
                >
                  Mijn Profiel
                </MenuItem>

                <MenuItem
                  onClick={() =>
                    !isProfileBookings && goTo("/profile?tab=bookings")
                  }
                  isDisabled={isProfileBookings}
                  fontWeight={isProfileBookings ? "700" : "500"}
                >
                  Mijn Boekingen
                </MenuItem>

                <MenuItem
                  onClick={() =>
                    !isProfileReviews && goTo("/profile?tab=reviews")
                  }
                  isDisabled={isProfileReviews}
                  fontWeight={isProfileReviews ? "700" : "500"}
                >
                  Mijn Reviews
                </MenuItem>

                <MenuItem
                  onClick={() =>
                    !isProfileAccount && goTo("/profile?tab=account")
                  }
                  isDisabled={isProfileAccount}
                  fontWeight={isProfileAccount ? "700" : "500"}
                >
                  Mijn Account
                </MenuItem>

              </MenuList>
            </Menu>
          )}

          {/* Host Dashboard Dropdown */}
          {user?.isHost && (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                color={linkColor}
                _hover={{ color: hoverColor }}
                fontWeight={isAnyHostPage ? "700" : "500"}
              >
                Host Dashboard
              </MenuButton>

              <MenuList zIndex={6000}>

                <MenuItem
                  onClick={() => goTo("/host/dashboard")}
                  isDisabled={isHostDashboard}
                  fontWeight={isHostDashboard ? "700" : "500"}
                >
                  Host Dashboard
                </MenuItem>

                <MenuItem
                  onClick={() => goTo("/host/properties")}
                  isDisabled={isHostProperties}
                  fontWeight={isHostProperties ? "700" : "500"}
                >
                  Accommodaties
                </MenuItem>

                <MenuItem
                  onClick={() => goTo("/host/bookings")}
                  isDisabled={isHostBookings}
                  fontWeight={isHostBookings ? "700" : "500"}
                >
                  Boekingen
                </MenuItem>

                <MenuItem
                  onClick={() => goTo("/host/earnings")}
                  isDisabled={isHostEarnings}
                  fontWeight={isHostEarnings ? "700" : "500"}
                >
                  Verdiensten
                </MenuItem>

              </MenuList>
            </Menu>
          )}

        </HStack>

        <Spacer />

        {/* ============================================================
            USER INFO + ICON TOGGLE
        ============================================================ */}
        {user && (
          <HStack spacing={4} align="center">

            {/* Avatar + Naam */}
            <Avatar name={user.name} size="sm" />
            <Text fontWeight="medium">{user.name}</Text>

            {/* Logout */}
            <Button size="sm" variant="outline" onClick={logout}>
              Logout
            </Button>

            {/* Light/Dark Mode Toggle (Icons) */}
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleColorMode}
            >
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

          </HStack>
        )}

      </HStack>
    </Box>
  );
}
