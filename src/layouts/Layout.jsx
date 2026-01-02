import { Box } from "@chakra-ui/react";
import { Footer } from "./Footer";

export const Layout = ({ children }) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Box flex="1">
        {children}
      </Box>

      <Footer />
    </Box>
  );
};
