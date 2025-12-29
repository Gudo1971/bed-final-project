// ==============================================
// = IMAGE CAROUSEL                              =
// = Hoofdafbeelding + thumbnails + fullscreen   =
// ==============================================

import { Box, IconButton, Flex, Text, Image } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import FullscreenGallery from "./FullscreenGallery";

// Helper: haal altijd een bruikbare URL uit item
const getImageUrl = (img) =>
  typeof img === "string" ? img : img?.url || "";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function ImageCarousel({ images }) {
  // ==============================================
  // = SAFE IMAGES                                =
  // ==============================================
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // ==============================================
  // = LOADING / FADE / AUTOPLAY                  =
  // ==============================================
  const [fade, setFade] = useState(false);
  const [paused, setPaused] = useState(false);

  // ==============================================
  // = THUMBNAIL SCROLL REFS                      =
  // ==============================================
  const containerRef = useRef(null);
  const thumbRefs = useRef([]);
  thumbRefs.current = [];

  const addToRefs = (el) => {
    if (el && !thumbRefs.current.includes(el)) {
      thumbRefs.current.push(el);
    }
  };

  // ==============================================
  // = GEEN AFBEELDINGEN                           =
  // ==============================================
  if (!safeImages.length) {
    return (
      <Box
        position="relative"
        width="100%"
        height="350px"
        borderRadius="10px"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="gray.500" fontSize="sm">
          Geen afbeeldingen beschikbaar
        </Text>
      </Box>
    );
  }

  // ==============================================
  // = NEXT / PREV MET FADE                       =
  // ==============================================
  const next = () => {
    setFade(true);
    setTimeout(() => {
      setIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));
      setFade(false);
    }, 150);
  };

  const prev = () => {
    setFade(true);
    setTimeout(() => {
      setIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
      setFade(false);
    }, 150);
  };

  // ==============================================
  // = AUTOPLAY (respecteert pause)               =
  // ==============================================
  useEffect(() => {
    if (paused || safeImages.length <= 1) return;

    const interval = setInterval(() => {
      next();
    }, 4000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, safeImages.length]);

  // ==============================================
  // = THUMBNAIL AUTO-SNAP                        =
  // ==============================================
  useEffect(() => {
    if (!containerRef.current || !thumbRefs.current[index]) return;

    const container = containerRef.current;
    const activeThumb = thumbRefs.current[index];

    const containerWidth = container.offsetWidth;
    const thumbWidth = activeThumb.offsetWidth;

    const scrollPosition =
      activeThumb.offsetLeft - containerWidth / 2 + thumbWidth / 2;

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  }, [index]);

  const currentUrl = getImageUrl(safeImages[index]);

  // ==============================================
  // = RENDER                                      =
  // ==============================================
  return (
    <Box width="100%" position="relative">
      {/* ============================================== */}
      {/* = HOOFDAFBEELDING                             = */}
      {/* ============================================== */}
      <Box
        position="relative"
        width="100%"
        height="350px"
        overflow="hidden"
        borderRadius="10px"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Image
          src={currentUrl}
          alt=""
          objectFit="cover"
          width="100%"
          height="100%"
          cursor="pointer"
          onClick={() => setFullscreen(true)}
          style={{
            opacity: fade ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        />

        {/* ============================================== */}
        {/* = ARROWS                                      = */}
        {/* ============================================== */}
        {safeImages.length > 1 && (
          <>
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon boxSize={8} />}
              position="absolute"
              top="50%"
              left="10px"
              transform="translateY(-50%)"
              onClick={prev}
              background="rgba(0,0,0,0.4)"
              color="white"
              _hover={{ background: "rgba(0,0,0,0.6)" }}
              zIndex={4}
            />

            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon boxSize={8} />}
              position="absolute"
              top="50%"
              right="10px"
              transform="translateY(-50%)"
              onClick={next}
              background="rgba(0,0,0,0.4)"
              color="white"
              _hover={{ background: "rgba(0,0,0,0.6)" }}
              zIndex={4}
            />
          </>
        )}
      </Box>

      {/* ============================================== */}
      {/* = THUMBNAILS (scroll + auto-snap)             = */}
      {/* ============================================== */}
      {safeImages.length > 1 && (
        <Flex
          ref={containerRef}
          mt={3}
          gap={2}
          overflowX="auto"
          overflowY="hidden"
          whiteSpace="nowrap"
          scrollBehavior="smooth"
          css={{
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#ccc",
              borderRadius: "10px",
            },
          }}
        >
          {safeImages.map((img, i) => {
            const thumbUrl = getImageUrl(img);
            return (
              <Box
                key={i}
                ref={addToRefs}
                display="inline-block"
                width="70px"
                height="70px"
                borderRadius="6px"
                overflow="hidden"
                border={i === index ? "3px solid teal" : "2px solid transparent"}
                cursor="pointer"
                onClick={() => setIndex(i)}
                flexShrink={0}
              >
                <Image
                  src={thumbUrl}
                  alt=""
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
              </Box>
            );
          })}
        </Flex>
      )}

      {/* ============================================== */}
      {/* = FULLSCREEN GALLERY                          = */}
      {/* ============================================== */}
      {fullscreen && (
        <FullscreenGallery
          images={safeImages.map((img) =>
            typeof img === "string" ? { url: img } : img
          )}
          index={index}
          onClose={() => setFullscreen(false)}
          onPrev={prev}
          onNext={next}
        />
      )}
    </Box>
  );
}
