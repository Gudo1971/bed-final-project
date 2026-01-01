// ============================================================
// = IMAGE CAROUSEL (optimistic skeleton + instant render)    =
// ============================================================

import { Box, IconButton, Flex, Text, Image, Skeleton } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import FullscreenGallery from "./FullscreenGallery";

const getImageUrl = (img) =>
  typeof img === "string" ? img : img?.url || "";

export default function ImageCarousel({ images }) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];

  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [fade, setFade] = useState(false);
  const [paused, setPaused] = useState(false);

  // NEW: optimistic loading — skeleton only shown for 200ms
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCarousel(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const containerRef = useRef(null);
  const thumbRefs = useRef([]);
  thumbRefs.current = [];

  const addToRefs = (el) => {
    if (el && !thumbRefs.current.includes(el)) {
      thumbRefs.current.push(el);
    }
  };

  // ============================================================
  // = SKELETON STATE (optimistic)                              =
  // ============================================================
  if (!showCarousel) {
    return (
      <Box w="100%" maxW="600px" mx="auto">
        <Skeleton height="300px" borderRadius="10px" mb={3} />

        <Flex gap={2}>
          <Skeleton w="55px" h="55px" borderRadius="6px" />
          <Skeleton w="55px" h="55px" borderRadius="6px" />
          <Skeleton w="55px" h="55px" borderRadius="6px" />
          <Skeleton w="55px" h="55px" borderRadius="6px" />
        </Flex>
      </Box>
    );
  }

  // ============================================================
  // = GEEN AFBEELDINGEN                                        =
  // ============================================================
  if (safeImages.length === 0) {
    return (
      <Box
        w="100%"
        maxW="600px"
        mx="auto"
        h="300px"
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

  // ============================================================
  // = CAROUSEL LOGIC                                            =
  // ============================================================
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

  useEffect(() => {
    if (paused || safeImages.length <= 1) return;
    const interval = setInterval(() => next(), 4000);
    return () => clearInterval(interval);
  }, [paused, safeImages.length]);

  useEffect(() => {
    if (!containerRef.current || !thumbRefs.current[index]) return;

    const container = containerRef.current;
    const activeThumb = thumbRefs.current[index];

    const scrollPosition =
      activeThumb.offsetLeft -
      container.offsetWidth / 2 +
      activeThumb.offsetWidth / 2;

    container.scrollTo({ left: scrollPosition, behavior: "smooth" });
  }, [index]);

  const currentUrl = getImageUrl(safeImages[index]);

  // ============================================================
  // = RENDER CAROUSEL                                           =
  // ============================================================
  return (
    <Box w="100%" maxW="600px" mx="auto" position="relative">
      {/* HOOFDAFBEELDING */}
      <Box
        w="100%"
        h="300px"
        borderRadius="10px"
        overflow="hidden"
        position="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Image
          src={currentUrl}
          alt=""
          w="100%"
          h="100%"
          objectFit="cover"
          cursor="pointer"
          onClick={() => setFullscreen(true)}
          style={{
            opacity: fade ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        />

        {safeImages.length > 1 && (
          <>
            <IconButton
              aria-label="Previous"
              icon={<ChevronLeftIcon boxSize={6} />}
              position="absolute"
              top="50%"
              left="8px"
              transform="translateY(-50%)"
              onClick={prev}
              background="rgba(0,0,0,0.4)"
              color="white"
              _hover={{ background: "rgba(0,0,0,0.6)" }}
              zIndex={4}
              size="sm"
            />

            <IconButton
              aria-label="Next"
              icon={<ChevronRightIcon boxSize={6} />}
              position="absolute"
              top="50%"
              right="8px"
              transform="translateY(-50%)"
              onClick={next}
              background="rgba(0,0,0,0.4)"
              color="white"
              _hover={{ background: "rgba(0,0,0,0.6)" }}
              zIndex={4}
              size="sm"
            />
          </>
        )}
      </Box>

      {/* THUMBNAILS */}
      {safeImages.length > 1 && (
        <Flex
          ref={containerRef}
          mt={2}
          gap={2}
          overflowX="auto"
          overflowY="hidden"
          whiteSpace="nowrap"
          scrollBehavior="smooth"
        >
          {safeImages.map((img, i) => {
            const thumbUrl = getImageUrl(img);
            return (
              <Box
                key={i}
                ref={addToRefs}
                w="55px"
                h="55px"
                borderRadius="6px"
                overflow="hidden"
                border={i === index ? "2px solid teal" : "1px solid transparent"}
                cursor="pointer"
                onClick={() => setIndex(i)}
                flexShrink={0}
              >
                <Image
                  src={thumbUrl}
                  alt=""
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              </Box>
            );
          })}
        </Flex>
      )}

      {/* FULLSCREEN */}
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
