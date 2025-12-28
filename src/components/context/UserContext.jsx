import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../../api/axios";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function loadUser() {
      if (isLoading) return;

      if (!isAuthenticated) {
        setUserData(null);
        return;
      }

      try {
        // Auth0 token ophalen
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://staybnb.gudo.dev/api",
            scope: "openid profile email offline_access",
            prompt: "consent",
          },
        });

        // Axios request naar backend
        const res = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    }

    loadUser();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
