import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";

export default function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert
      status="info"
      variant="subtle"
      bg="blue.50"
      color="blue.800"
      borderRadius="md"
      boxShadow="sm"
      p={4}
      mb={6}
    >
      <AlertIcon />
      <Box flex="1">
        <AlertTitle fontWeight="semibold">Educatieve Demo</AlertTitle>
        <AlertDescription>
          Deze website is uitsluitend bedoeld voor educatieve doeleinden.
          Alle accommodaties, afbeeldingen en prijzen zijn fictief.
        </AlertDescription>
      </Box>

      <CloseButton
        onClick={() => setIsVisible(false)}
        position="relative"
        right={-2}
      />
    </Alert>
  );
}
