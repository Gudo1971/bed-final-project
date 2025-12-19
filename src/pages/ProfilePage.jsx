import { Tabs, TabList, TabPanels, Tab, TabPanel, Container, Heading } from "@chakra-ui/react";
import ProfileTab from "../components/tabs/ProfileTab";
import BookingsTab from "../components/tabs/BookingsTab";
import AccountTab from "../components/tabs/AccountTab";
import MyReviews from "../components/profile/MyReviews";


export default function ProfilePage() {
  return (
    <Container maxW="6xl" py={10}>
      <Heading mb={6}>Mijn Profiel</Heading>

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
