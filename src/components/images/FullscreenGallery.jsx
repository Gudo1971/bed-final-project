// ==============================================
// = FULLSCREEN GALLERY                          =
// = Volledige schermweergave met navigatie      =
// ==============================================

import { useEffect } from "react";
import { Box, IconButton } from "@chakra-ui/react";
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
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      background="rgba(0,0,0,0.9)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
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
        onClick={onPrev}
      />

      {/* ============================================== */}
      {/* = IMAGE                                       = */}
      {/* ============================================== */}
      <img
        src={images[index].url}
        alt=""
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          objectFit: "contain",
        }}
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
        onClick={onNext}
      />
    </Box>
  );
}
