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

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

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
      await login(email, password);
      toast({
        title: "Welkom terug!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (err) {
      if (err.message.toLowerCase().includes("email")) {
        setErrorField("email");
      } else if (err.message.toLowerCase().includes("password")) {
        setErrorField("password");
      } else {
        setErrorField("form");
      }
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
        Inloggen bij StayBnB
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">

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
            Inloggen
          </Button>

          <Text fontSize="sm" textAlign="center">
            Nog geen account?{" "}
            <ChakraLink as={Link} to="/register" color="teal.500">
              Registreer hier
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
