import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Text,
  Link as ChakraLink,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../components/context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorField, setErrorField] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const inputStyle = {
    bg: useColorModeValue("gray.100", "gray.800"),
    border: "1px solid",
    borderColor: useColorModeValue("gray.300", "gray.600"),
    _placeholder: { color: useColorModeValue("gray.500", "gray.400") },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorField("");
    setErrorMessage("");

    try {
      await registerUser(username, email, password);
      toast({
        title: "Account aangemaakt!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (err) {
      const msg = err.message.toLowerCase();

      if (msg.includes("username")) setErrorField("username");
      else if (msg.includes("email")) setErrorField("email");
      else if (msg.includes("password")) setErrorField("password");
      else setErrorField("form");

      setErrorMessage(err.message);
    }
  };

  return (
    <Box
      maxW="420px"
      mx="auto"
      mt="80px"
      p={8}
      borderRadius="md"
      boxShadow="lg"
      bg={useColorModeValue("white", "gray.700")}
    >
      <Heading mb={6} textAlign="center" fontSize="2xl">
        Registreren bij StayBnB
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">

          <FormControl isRequired isInvalid={errorField === "username"}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Choose a nickname"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              {...inputStyle}
            />
            {errorField === "username" && (
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={errorField === "email"}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="jij@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              {...inputStyle}
            />
            {errorField === "email" && (
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={errorField === "password"}>
            <FormLabel>Wachtwoord</FormLabel>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              {...inputStyle}
            />
            {errorField === "password" && (
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            )}
          </FormControl>

          {errorField === "form" && (
            <Text color="red.400" fontSize="sm" textAlign="center">
              {errorMessage}
            </Text>
          )}

          <Button colorScheme="teal" type="submit" width="100%">
            Account aanmaken
          </Button>

          <Text fontSize="sm" textAlign="center">
            Heb je al een account?{" "}
            <ChakraLink as={Link} to="/login" color="teal.500">
              Log hier in
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
