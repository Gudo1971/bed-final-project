import { Box, IconButton, Flex, Text, Image } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import FullscreenGallery from "./FullscreenGallery";

export default function ImageCarousel({ images }) {
  const safeImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // ⭐ Autoplay elke 4 seconden
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [safeImages.length]);

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

  const prev = () => {
    setIndex((i) => (i === 0 ? safeImages.length - 1 : i - 1));
  };

  const next = () => {
    setIndex((i) => (i === safeImages.length - 1 ? 0 : i + 1));
  };

  return (
    <Box width="100%" position="relative">
      {/* ⭐ Hoofdafbeelding */}
      <Box
        position="relative"
        width="100%"
        height="350px"
        overflow="hidden"
        borderRadius="10px"
      >
        <Image
          src={safeImages[index].url}
          alt=""
          objectFit="cover"
          width="100%"
          height="100%"
          cursor="pointer"
          onClick={() => setFullscreen(true)}
        />

        {/* Arrows */}
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
      </Box>

      {/* ⭐ Thumbnails */}
      <Flex mt={3} gap={2} justifyContent="center" wrap="wrap">
        {safeImages.map((img, i) => (
          <Box
            key={i}
            width="60px"
            height="60px"
            borderRadius="6px"
            overflow="hidden"
            border={i === index ? "2px solid teal" : "2px solid transparent"}
            cursor="pointer"
            onClick={() => setIndex(i)}
          >
            <Image
              src={img.url}
              alt=""
              objectFit="cover"
              width="100%"
              height="100%"
            />
          </Box>
        ))}
      </Flex>

      {/* ⭐ Fullscreen */}
      {fullscreen && (
        <FullscreenGallery
          images={safeImages}
          index={index}
          onClose={() => setFullscreen(false)}
          onPrev={prev}
          onNext={next}
        />
      )}
    </Box>
  );
}
