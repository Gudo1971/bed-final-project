// ==============================================
// = FULLSCREEN GALLERY                          =
// = Volledige schermweergave met navigatie      =
// ==============================================

import { useEffect } from "react";
import {
  Box,
  IconButton,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@chakra-ui/icons";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function FullscreenGallery({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}) {
  // ==============================================
  // = DARK MODE COLORS                           =
  // ==============================================
  const overlayBg = useColorModeValue(
    "rgba(0,0,0,0.85)",
    "rgba(0,0,0,0.92)"
  );

  const buttonBg = useColorModeValue("whiteAlpha.800", "whiteAlpha.300");
  const buttonHover = useColorModeValue("whiteAlpha.900", "whiteAlpha.400");

  // ==============================================
  // = KEYBOARD CONTROLS                          =
  // ==============================================
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box
      position="fixed"
      inset={0}
      width="100vw"
      height="100vh"
      bg={overlayBg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
      backdropFilter="blur(4px)"
    >
      {/* ============================================== */}
      {/* = CLOSE BUTTON                                = */}
      {/* ============================================== */}
      <IconButton
        aria-label="Close"
        icon={<CloseIcon />}
        position="absolute"
        top="20px"
        right="20px"
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        onClick={onClose}
      />

      {/* ============================================== */}
      {/* = PREVIOUS                                    = */}
      {/* ============================================== */}
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon boxSize={10} />}
        position="absolute"
        left="20px"
        top="50%"
        transform="translateY(-50%)"
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        onClick={onPrev}
      />

      {/* ============================================== */}
      {/* = IMAGE                                       = */}
      {/* ============================================== */}
      <Image
        src={images[index].url}
        alt=""
        maxW="90%"
        maxH="90%"
        objectFit="contain"
        borderRadius="md"
        boxShadow="2xl"
      />

      {/* ============================================== */}
      {/* = NEXT                                        = */}
      {/* ============================================== */}
      <IconButton
        aria-label="Next"
        icon={<ChevronRightIcon boxSize={10} />}
        position="absolute"
        right="20px"
        top="50%"
        transform="translateY(-50%)"
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        onClick={onNext}
      />
    </Box>
  );
}
