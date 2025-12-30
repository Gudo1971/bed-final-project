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
  useColorModeValue,
} from "@chakra-ui/react";

import { useSearchParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext.jsx";

import ProfileTab from "../components/tabs/ProfileTab.jsx";
import BookingsTab from "../components/tabs/BookingsTab.jsx";
import AccountTab from "../components/tabs/AccountTab.jsx";
import MyReviews from "../components/profile/MyReviews.jsx";

export default function ProfilePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  // ----------------------------------------------
  // MAP URL → TAB INDEX
  // ----------------------------------------------
  const tabIndex =
    tab === "bookings"
      ? 1
      : tab === "reviews"
      ? 2
      : tab === "account"
      ? 3
      : 0;

  const titleColor = useColorModeValue("teal.600", "teal.300");

  // ----------------------------------------------
  // TAB CHANGE → UPDATE URL
  // ----------------------------------------------
  function handleTabChange(index) {
    if (index === 0) {
      searchParams.delete("tab");
      setSearchParams(searchParams, { replace: true });
    } else if (index === 1) {
      setSearchParams({ tab: "bookings" }, { replace: true });
    } else if (index === 2) {
      setSearchParams({ tab: "reviews" }, { replace: true });
    } else if (index === 3) {
      setSearchParams({ tab: "account" }, { replace: true });
    }
  }

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

      <Tabs
        variant="enclosed"
        colorScheme="teal"
        width="100%"
        index={tabIndex}          // ⭐ controlled, reageert op URL
        onChange={handleTabChange} // ⭐ kliks updaten URL
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
