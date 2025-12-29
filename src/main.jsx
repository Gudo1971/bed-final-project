// ==============================================
// = APPLICATION ENTRY POINT                     =
// ==============================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { AuthProvider } from "./components/context/AuthContext.jsx";
import { UserProvider } from "./components/context/UserContext.jsx";

import theme from "./theme.js";

// ==============================================
// = RENDER                                      =
// ==============================================
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </AuthProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
