import { Box, Text, Stack, Link, useColorModeValue } from "@chakra-ui/react";
import { MdPhone, MdEmail } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  const textColor = useColorModeValue("gray.700", "gray.300");
  const iconColor = useColorModeValue("teal.600", "teal.300");

  return (
    <Box
      py={8}
      mt={12}
      borderTop="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      textAlign="center"
    >
      <Stack spacing={4} align="center">
        
        {/* CONTACTGEGEVENS */}
        <Stack direction="row" spacing={6} align="center">
          
          <Stack direction="row" align="center" spacing={2}>
            <MdPhone size={18} color={iconColor} />
            <Text fontSize="sm" color={textColor}>+31 6 49038246</Text>
          </Stack>

          <Stack direction="row" align="center" spacing={2}>
            <MdEmail size={18} color={iconColor} />
            <Text fontSize="sm" color={textColor}>g.gieles@telfort.nl</Text>
          </Stack>

          <Stack direction="row" align="center" spacing={2}>
            <FaLinkedin size={18} color="#0A66C2" />
            <Link
              href="https://www.linkedin.com/in/gudo-gieles-b956395b/"
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
              color={textColor}
              textDecoration="underline"
            >
              LinkedIn
            </Link>
          </Stack>

          <Stack direction="row" align="center" spacing={2}>
            <FaGithub size={18} color={iconColor} />
            <Link
              href="https://github.com/Gudo1971/bed-final-project"
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
              color={textColor}
              textDecoration="underline"
            >
              GitHub
            </Link>
          </Stack>

        </Stack>

        {/* COPYRIGHT MET SPACING */}
        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
          © {new Date().getFullYear()} Gudo Gieles
          <Box as="span" px={2}>.</Box>
          StayBnB Portfolio Project
        </Text>

        {/* DISCLAIMER */}
        <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.500")}>
          Deze website is een educatieve demo. Alle accommodaties, prijzen en afbeeldingen zijn fictief.
        </Text>
      </Stack>
    </Box>
  );
};
