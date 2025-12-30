import { HStack, Button } from "@chakra-ui/react";

export const LanguageToggle = ({ language, setLanguage }) => {
  return (
    <HStack spacing={4} justify="flex-end">
      <Button
        size="sm"
        variant={language === "nl" ? "solid" : "ghost"}
        onClick={() => setLanguage("nl")}
      >
        NL
      </Button>
      <Button
        size="sm"
        variant={language === "en" ? "solid" : "ghost"}
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
    </HStack>
  );
};
