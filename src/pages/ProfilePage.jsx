// ============================================================
// = PROFILE PAGE                                              =
// ============================================================

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Heading,
  Button,
  Box,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

import { useSearchParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext.jsx";

import ProfileTab from "../components/tabs/ProfileTab.jsx";
import BookingsTab from "../components/tabs/BookingsTab.jsx";
import AccountTab from "../components/tabs/AccountTab.jsx";
import MyReviews from "../components/profile/MyReviews.jsx";

export default function ProfilePage() {
  const toast = useToast();
  const { user, token, updateUser } = useAuth();

  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const defaultIndex =
    tab === "bookings"
      ? 1
      : tab === "reviews"
      ? 2
      : tab === "account"
      ? 3
      : 0;

  async function handleBecomeHost() {
    try {
      const res = await fetch("http://localhost:3000/api/account/become-host", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Host worden mislukt");

      const data = await res.json();

      updateUser({
        ...user,
        isHost: true,
        token: data.token,
      });

      toast({
        title: "Je bent nu host!",
        status: "success",
        duration: 3000,
      });

      window.location.href = "/host/dashboard";
    } catch (err) {
      toast({
        title: "Fout",
        description: "Kon host-status niet instellen",
        status: "error",
        duration: 3000,
      });
    }
  }

  const titleColor = useColorModeValue("teal.600", "teal.300");

  return (
    <Container
      maxW="container.sm"
      px={{ base: 4, md: 0 }}
      py={{ base: 6, md: 10 }}
      centerContent
    >
      <Heading
        mb={6}
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="extrabold"
        color={titleColor}
        textAlign="center"
        width="100%"
      >
        Mijn Profiel
      </Heading>

      {!user?.isHost && (
        <Box mb={6} width="100%" display="flex" justifyContent="center">
          <Button
            colorScheme="teal"
            size="lg"
            width="100%"
            maxW="260px"
            onClick={handleBecomeHost}
          >
            Word Host
          </Button>
        </Box>
      )}

      <Tabs
        variant="enclosed"
        colorScheme="teal"
        width="100%"
        defaultIndex={defaultIndex}
      >
        <TabList
          flexWrap={{ base: "wrap", md: "wrap", lg: "nowrap" }}
          justifyContent="center"
          gap={{ base: 2, md: 3, lg: 4 }}
          px={2}
        >
          <Tab
            flex={{ base: "1 1 100%", md: "1 1 45%", lg: "0 0 auto" }}
            minW={{ base: "100%", md: "45%", lg: "auto" }}
            fontSize={{ base: "xs", sm: "sm" }}
            textAlign="center"
          >
            👤 Persoonsgegevens
          </Tab>

          <Tab
            flex={{ base: "1 1 100%", md: "1 1 45%", lg: "0 0 auto" }}
            minW={{ base: "100%", md: "45%", lg: "auto" }}
            fontSize={{ base: "xs", sm: "sm" }}
            textAlign="center"
          >
            📅 Mijn Boekingen
          </Tab>

          <Tab
            flex={{ base: "1 1 100%", md: "1 1 45%", lg: "0 0 auto" }}
            minW={{ base: "100%", md: "45%", lg: "auto" }}
            fontSize={{ base: "xs", sm: "sm" }}
            textAlign="center"
          >
            📃 Mijn Reviews
          </Tab>

          <Tab
            flex={{ base: "1 1 100%", md: "1 1 45%", lg: "0 0 auto" }}
            minW={{ base: "100%", md: "45%", lg: "auto" }}
            fontSize={{ base: "xs", sm: "sm" }}
            textAlign="center"
          >
            🔐 Account
          </Tab>
        </TabList>

        <TabPanels mt={4}>
          <TabPanel>
            <ProfileTab />
          </TabPanel>

          <TabPanel>
            <BookingsTab />
          </TabPanel>

          <TabPanel>
            <MyReviews />
          </TabPanel>

          <TabPanel>
            <AccountTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
