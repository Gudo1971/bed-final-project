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

import { useAuth } from "../components/context/AuthContext.jsx";

import ProfileTab from "../components/tabs/ProfileTab.jsx";
import BookingsTab from "../components/tabs/BookingsTab.jsx";
import AccountTab from "../components/tabs/AccountTab.jsx";
import MyReviews from "../components/profile/MyReviews.jsx";

export default function ProfilePage() {
  const toast = useToast();

  // Haal user + token + updateUser uit AuthContext
  const { user, token, updateUser } = useAuth();

  async function handleBecomeHost() {
    try {
      const res = await fetch("http://localhost:3000/auth/become-host", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Host worden mislukt");

      const data = await res.json();

      // Update user in AuthContext
      updateUser(data);

      toast({
        title: "Je bent nu host!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Redirect naar Host Dashboard
      window.location.href = "/host/dashboard";
    } catch (err) {
      toast({
        title: "Fout",
        description: "Kon host-status niet instellen",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Container maxW="6xl" py={10}>
      <Heading mb={6}>Mijn Profiel</Heading>

      {/* Word Host knop (alleen tonen als user geen host is) */}
      {!user?.isHost && (
        <Box mb={6}>
          <Button colorScheme="teal" onClick={handleBecomeHost}>
            Word Host
          </Button>
        </Box>
      )}

      <Tabs variant="enclosed" colorScheme="teal" isFitted>
        <TabList>
          <Tab>👤 Persoonsgegevens</Tab>
          <Tab>📅 Mijn Boekingen</Tab>
          <Tab>📃 Mijn Reviews</Tab>
          <Tab>🔐 Account</Tab>
        </TabList>

        <TabPanels>
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
