// ============================================================
// = THEME TOGGLE                                              =
// = Wissel tussen light / dark mode                          =
// ============================================================

import { IconButton, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

// ============================================================
// = COMPONENT                                                 =
// ============================================================
export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle color mode"
      onClick={toggleColorMode}
      icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      variant="ghost"
      size="md"
    />
  );
}
