// ==============================================
// = PROFILE PAGE                                =
// = Tabs: Persoonsgegevens / Boekingen / Reviews / Account
// ==============================================

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

  // ==============================================
  // = QUERY PARAM → TAB INDEX                    =
  // ==============================================
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const defaultIndex =
    tab === "bookings"
      ? 1 // 📅 Mijn Boekingen
      : tab === "reviews"
      ? 2 // 📃 Mijn Reviews
      : tab === "account"
      ? 3 // 🔐 Account
      : 0; // 👤 Persoonsgegevens (default)

  // ==============================================
  // = WORD HOST ACTIE                            =
  // ==============================================
  async function handleBecomeHost() {
    try {
      const res = await fetch("http://localhost:3000/api/auth/become-host", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Host worden mislukt");

      const data = await res.json();
      updateUser(data);

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

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Container maxW="6xl" py={10}>
      {/* ============================================== */}
      {/* = PAGINA TITEL                               = */}
      {/* ============================================== */}
      <Heading mb={6}>Mijn Profiel</Heading>

      {/* ============================================== */}
      {/* = WORD HOST KNOP (alleen voor non-hosts)       = */}
      {/* ============================================== */}
      {!user?.isHost && (
        <Box mb={6}>
          <Button colorScheme="teal" onClick={handleBecomeHost}>
            Word Host
          </Button>
        </Box>
      )}

      {/* ============================================== */}
      {/* = TABS MET AUTOMATISCHE SELECTIE              = */}
      {/* ============================================== */}
      <Tabs
        variant="enclosed"
        colorScheme="teal"
        isFitted
        defaultIndex={defaultIndex}
      >
        <TabList>
          <Tab>👤 Persoonsgegevens</Tab>
          <Tab>📅 Mijn Boekingen</Tab>
          <Tab>📃 Mijn Reviews</Tab>
          <Tab>🔐 Account</Tab>
        </TabList>

        <TabPanels>
          {/* ============================================== */}
          {/* = PERSOONSGEGEVENS TAB                        = */}
          {/* ============================================== */}
          <TabPanel>
            <ProfileTab />
          </TabPanel>

          {/* ============================================== */}
          {/* = MIJN BOEKINGEN TAB                          = */}
          {/* ============================================== */}
          <TabPanel>
            <BookingsTab />
          </TabPanel>

          {/* ============================================== */}
          {/* = MIJN REVIEWS TAB                            = */}
          {/* ============================================== */}
          <TabPanel>
            <MyReviews />
          </TabPanel>

          {/* ============================================== */}
          {/* = ACCOUNT TAB                                 = */}
          {/* ============================================== */}
          <TabPanel>
            <AccountTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
