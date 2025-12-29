import {
  Box,
  Heading,
  Text,
  Avatar,
  Center,
  VStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router-dom";

export default function HostProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { host } = location.state;
  console.log("HOST RECEIVED IN PROFILE PAGE:", host);
console.log("ABOUT ME VALUE:", host.aboutMe);
console.log("TYPE:", typeof host.aboutMe);


  const backColor = useColorModeValue("gray.700", "teal.200");
  const backHover = useColorModeValue("teal.600", "teal.300");
  const titleColor = useColorModeValue("gray.900", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const bioColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }}>
      <Text
        onClick={() => navigate(-1)}
        cursor="pointer"
        textDecoration="underline"
        mb={4}
        color={backColor}
        _hover={{ color: backHover }}
      >
        ← Terug
      </Text>

      <Heading mb={6} fontSize="2xl" fontWeight="extrabold" color={titleColor}>
        Hostprofiel
      </Heading>

      <VStack spacing={4} align="start">
        <Avatar size="xl" src={host.pictureUrl} name={host.name} />

        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {host.name}
          </Text>

          <Text fontSize="md" color={textColor}>
            {host.email}
          </Text>

          {host.phoneNumber && (
            <Text fontSize="md" color={textColor}>
              📞 {host.phoneNumber}
            </Text>
          )}
        </Box>

        <Divider />

        <Text fontSize="lg" fontWeight="medium">
          Over deze host
        </Text>

        <Text color={bioColor}>
          {host.aboutMe || "Deze host heeft nog geen persoonlijke bio toegevoegd."}
        </Text>
      </VStack>
    </Box>
  );
}
