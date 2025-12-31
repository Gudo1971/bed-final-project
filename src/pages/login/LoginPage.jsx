// ============================================================
// = LOGIN PAGE                                                =
// = Inloggen bij StayBnB                                      =
// ============================================================

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

// 👉 JOUW AXIOS INSTANCE
import api from "../../lib/api";

// ============================================================
// = API CALL: CHECK EMAIL BESTAAT?                           =
// ============================================================
async function checkEmailExists(email) {
  const res = await api.get(`/auth/check-email`, {
    params: { email },
  });

  return res.data;
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorField, setErrorField] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ============================================================
  // = EMAIL SYNTAX VALIDATIE                                   =
  // ============================================================
  function validateEmailFormat(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const inputStyle = {
    bg: useColorModeValue("gray.100", "gray.800"),
    border: "1px solid",
    borderColor: useColorModeValue("gray.300", "gray.600"),
    _placeholder: { color: useColorModeValue("gray.500", "gray.400") },
  };

  // ============================================================
  // = SUBMIT HANDLER                                           =
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorField("");
    setErrorMessage("");

    // 1. Syntactische check
    if (!validateEmailFormat(email)) {
      setErrorField("email");
      setErrorMessage("Voer een geldig e-mailadres in");
      return;
    }

    // 2. Backend check
    try {
      await checkEmailExists(email);
    } catch (err) {
      setErrorField("email");
      setErrorMessage(err.error || "We hebben geen account gevonden met dit email adres");
      return;
    }

    // 3. Inloggen
    try {
      await login(email, password);

      toast({
        title: "Welkom terug!",
        status: "success",
        duration: 3000,
      });

      navigate("/");
    } catch (err) {
      const backendError = err.error || err.message || "";
      const msg = backendError.toLowerCase();

      if (msg.includes("email")) {
        setErrorField("email");
        setErrorMessage(backendError);
      } 
      else if (msg.includes("wachtwoord")) {
        setErrorField("password");
        setErrorMessage(backendError);
      } 
      else {
        setErrorField("form");
        setErrorMessage(backendError || "Inloggen mislukt");
      }
    }
  };

  // ============================================================
  // = RENDER                                                   =
  // ============================================================
  return (
    <Box
      maxW="420px"
      mx="auto"
      mt={{ base: "60px", md: "80px" }}
      p={{ base: 6, md: 8 }}
      borderRadius="md"
      boxShadow="lg"
      bg={useColorModeValue("white", "gray.700")}
    >
      <Heading
        mb={6}
        textAlign="center"
        fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="extrabold"
        color={useColorModeValue("teal.600", "teal.300")}
      >
        Inloggen bij StayBnB
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">

          {/* EMAIL */}
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

          {/* PASSWORD */}
          <FormControl isRequired isInvalid={errorField === "password"}>
            <FormLabel>Wachtwoord</FormLabel>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={async () => {
                if (!validateEmailFormat(email)) {
                  setErrorField("email");
                  setErrorMessage("Voer een geldig e-mailadres in");
                  return;
                }

                try {
                  await checkEmailExists(email);
                  if (errorField === "email") {
                    setErrorField("");
                    setErrorMessage("");
                  }
                } catch (err) {
                  setErrorField("email");
                  setErrorMessage(err.error || "We hebben geen account gevonden met dit email adres");
                }
              }}
              {...inputStyle}
            />
            {errorField === "password" && (
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            )}
          </FormControl>

          {/* ALGEMENE FOUT */}
          {errorField === "form" && (
            <Text color="red.400" fontSize="sm" textAlign="center">
              {errorMessage}
            </Text>
          )}

          {/* KNOPPEN */}
          <Button colorScheme="teal" type="submit" width="100%" size="lg">
            Inloggen
          </Button>

          <Button
            variant="outline"
            width="100%"
            size="lg"
            onClick={() => navigate("/")}
          >
            Annuleren
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
