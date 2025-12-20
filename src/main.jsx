import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { UserProvider } from "../src/components/context/UserContext.jsx";

function AuthWrapper({ children }) {
  const { isLoading } = useAuth0();

  // Auth0 React handelt de redirect automatisch af.
  // Geen handleRedirectCallback meer nodig.
  if (isLoading) return <div>Loading authentication...</div>;

  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-u34emqv2lh0qdxoi.us.auth0.com"
        clientId="TeroCNBGeOjreWy33sHVVpekvuU3gA4D"
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://staybnb.gudo.dev/api",
          scope: "openid profile email offline_access"
        }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
      >
        <ChakraProvider>
          <AuthWrapper>
            <UserProvider>
              <App />
            </UserProvider>
          </AuthWrapper>
        </ChakraProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
