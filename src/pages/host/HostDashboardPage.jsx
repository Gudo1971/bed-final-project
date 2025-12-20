import { useState, useEffect } from "react";
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import HostProperties from "./HostProperties";
import HostBookings from "./HostBookings";
import HostReviews from "./HostReviews";
import { useAuth0 } from "@auth0/auth0-react";

export default function HostDashboardPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function loadToken() {
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: "https://staybnb.gudo.dev/api" }
      });
      setToken(token); // <-- FIXED
    }
    loadToken();
  }, [getAccessTokenSilently]);

  if (!token) return null;

  return (
    <Box p={6}>
      <Heading mb={6}>Host Dashboard</Heading>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>Mijn Properties</Tab>
          <Tab>Boekingen</Tab>
          <Tab>Reviews</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <HostProperties token={token} />
          </TabPanel>

          <TabPanel>
            <HostBookings token={token} />
          </TabPanel>

          <TabPanel>
            <HostReviews token={token} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
