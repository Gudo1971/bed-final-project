import { useState, useEffect } from "react";
import { MdPhone, MdEmail } from "react-icons/md";
import { FaLinkedin, FaGithub } from "react-icons/fa";

import {
  Box,
  Heading,
  Text,
  Stack,
  Divider,
  SimpleGrid,
  Badge,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";

import { LanguageToggle } from "../components/landing/LanguageToggle";

import nl from "../content/landing/nl";
import en from "../content/landing/en";

// ==============================
// FADE CAROUSEL COMPONENT
// ==============================
const FadeCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Box
      position="relative"
      width="100%"
      height="350px"
      overflow="hidden"
      borderRadius="lg"
      boxShadow="lg"
    >
      {images.map((img, i) => (
        <Box
          key={i}
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          opacity={i === index ? 1 : 0}
          transition="opacity 1s ease-in-out"
        >
          <Box
            as="img"
            src={img}
            alt={`Screenshot ${i + 1}`}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </Box>
      ))}
    </Box>
  );
};

// ==============================
// LANDING PAGE
// ==============================
export const LandingPage = () => {
  const [language, setLanguage] = useState("nl");
  const content = language === "nl" ? nl : en;

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.800", "gray.100");

  // ==============================
  // SCREENSHOTS (VUL LATER IN)
  // ==============================
  const screenshots = [
    "https://res.cloudinary.com/dkpp5c90a/image/upload/v1767126786/vvnrcd7pkvoge59rkkgd.png",
    "https://res.cloudinary.com/dkpp5c90a/image/upload/v1767127671/e6aonunake3kgkefgssf.png",
    "https://res.cloudinary.com/dkpp5c90a/image/upload/v1767127833/yegsmsxko4z5jwjjpcpg.png",
    "https://res.cloudinary.com/dkpp5c90a/image/upload/v1767127880/ldnlracaj0s2jlcluzpo.png",
    "https://res.cloudinary.com/dkpp5c90a/image/upload/v1767128017/skxe53uqycc7sitcq1wj.png",
    "https://res.cloudinary.com/dkpp5c90a/image/upload/v1767128095/otvif6h8spbhcosx8bs4.png",
    "https://res.cloudinary.com/dkpp5c90a/image/upload/v1767128155/utgoqawj6d1ehftj8jvv.png",
  ];

  return (
    <Box minH="100vh" bg={bg} py={12}>
      <Box
        maxW="5xl"
        mx="auto"
        bg={cardBg}
        p={{ base: 6, md: 10 }}
        borderRadius="2xl"
        boxShadow="xl"
      >
        <LanguageToggle language={language} setLanguage={setLanguage} />

        {/* ============================== */}
        {/* HERO + CAROUSEL */}
        {/* ============================== */}
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={10}
          alignItems="center"
          mb={16}
        >
          {/* LEFT SIDE */}
          <Stack spacing={6}>
            <Heading size="2xl" color={headingColor}>
              {content.heroTitle}
            </Heading>

            <Text fontSize="lg" color={textColor}>
              {content.heroSubtitle}
            </Text>

            <Stack direction="row" spacing={4}>
              <Badge colorScheme="teal" p={2} borderRadius="md">
                Full‑Stack Project
              </Badge>
              <Badge colorScheme="purple" p={2} borderRadius="md">
                React + Node
              </Badge>
            </Stack>
          </Stack>

          {/* RIGHT SIDE — CAROUSEL */}
          <FadeCarousel images={screenshots} />
        </SimpleGrid>

        {/* ============================== */}
        {/* STORY */}
        {/* ============================== */}
        <Heading size="lg" mb={4} color={headingColor}>
          {content.storyTitle}
        </Heading>
        <Text fontSize="md" mb={4} color={textColor}>
          {content.storyParagraph1}
        </Text>
        <Text fontSize="md" mb={6} color={textColor}>
          {content.storyParagraph2}
        </Text>

        {/* ============================== */}
        {/* TECH STACK */}
        {/* ============================== */}
        <Heading size="lg" mt={12} mb={4} color={headingColor}>
          {content.techTitle}
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Box>
            <Heading size="sm" color={headingColor} mb={2}>
              Frontend
            </Heading>
            <Text color={textColor}>{content.frontend}</Text>
          </Box>

          <Box>
            <Heading size="sm" color={headingColor} mb={2}>
              Backend
            </Heading>
            <Text color={textColor}>{content.backend}</Text>
          </Box>

          <Box>
            <Heading size="sm" color={headingColor} mb={2}>
              Tools
            </Heading>
            <Text color={textColor}>{content.tools}</Text>
          </Box>
        </SimpleGrid>

        {/* ============================== */}
        {/* ARCHITECTURE */}
        {/* ============================== */}
        <Box mt={16}>
          <Divider mb={12} />
          <Heading size="lg" mb={6} color={headingColor}>
            {content.architectureTitle}
          </Heading>
        </Box>

        <Stack spacing={3} color={textColor}>
          {content.architecturePoints.map((point, i) => (
            <Text key={i}>• {point}</Text>
          ))}
        </Stack>

        {/* ============================== */}
        {/* ROADMAP */}
        {/* ============================== */}
        <Box mt={16}>
          <Divider mb={12} />
          <Heading size="lg" mb={6} color={headingColor}>
            {content.roadmapTitle}
          </Heading>
        </Box>

        <Stack spacing={3}>
          {content.roadmap.map((item, i) => (
            <Badge key={i} colorScheme="teal" p={2} borderRadius="md">
              {item}
            </Badge>
          ))}
        </Stack>

        {/* ============================== */}
        {/* ABOUT ME */}
        {/* ============================== */}
        <Box mt={16}>
          <Divider mb={12} />
          <Heading size="lg" mb={6} color={headingColor}>
            {content.aboutMeTitle}
          </Heading>
        </Box>

        {/* FOTO LINKS + CONTACT RECHTS */}
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={10}
          alignItems="center"
        >
          {/* LEFT — PHOTO + QUOTE */}
          <Stack spacing={6} align="center">
            <Avatar name="Gudo" src="https://res.cloudinary.com/dkpp5c90a/image/upload/v1767116876/uj753emjxnqdxedg4drx.png" size="2xl" />

            <Text
              fontSize="lg"
              fontStyle="italic"
              color={headingColor}
              textAlign="center"
            >
              “Copilot is mijn tweede brein: ik debug ermee, structureer ermee
              en sluit mijn werk ermee af.”
            </Text>
          </Stack>

          {/* RIGHT — CONTACT INFO */}
          <Stack
            spacing={4}
            p={6}
            borderRadius="lg"
            bg={useColorModeValue("gray.100", "gray.700")}
            boxShadow="md"
            maxW="350px"
            mx="auto"
          >
            <Heading size="md" color={headingColor} textAlign="center">
              Contact
            </Heading>

            <Stack direction="row" align="center" spacing={3}>
              <MdPhone size={20} color="#3182CE" />
              <Text fontSize="md" color={textColor}>
                +31 6 49038246
              </Text>
            </Stack>

            <Stack direction="row" align="center" spacing={3}>
              <MdEmail size={20} color="#38A169" />
              <Text fontSize="md" color={textColor}>
                g.gieles@telfort.nl
              </Text>
            </Stack>

            <Stack direction="row" align="center" spacing={3}>
              <FaLinkedin size={20} color="#0A66C2" />
              <Text
                fontSize="md"
                color={textColor}
                as="a"
                href="https://www.linkedin.com/in/gudo-gieles-b956395b/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </Text>
            </Stack>

            <Stack direction="row" align="center" spacing={3}>
              <FaGithub size={20} color={headingColor} />
              <Text
                fontSize="md"
                color={textColor}
                as="a"
                href="https://github.com/Gudo1971/bed-final-project"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Text>
            </Stack>
          </Stack>
        </SimpleGrid>

        {/* TEKST BLOK ONDER FOTO + CONTACT */}
        <Stack
          spacing={4}
          maxW="600px"
          mx="auto"
          mt={10}
          textAlign="center"
        >
          {content.aboutMeParagraphs.map((p, i) => (
            <Text key={i} fontSize="md" color={textColor}>
              {p}
            </Text>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
