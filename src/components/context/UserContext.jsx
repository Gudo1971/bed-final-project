import { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function loadUser() {
      // ⛔ Wacht tot Auth0 klaar is
      if (isLoading) return;

      if (!isAuthenticated) {
        setUserData(null);
        return;
      }

      try {
       const token = await getAccessTokenSilently({
  authorizationParams: {
    audience: "https://staybnb.gudo.dev/api",
    scope: "openid profile email offline_access",
    prompt: "consent",
  
  }
});


        const res = await fetch("http://localhost:3000/api/users/me", {

          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load user");

        const data = await res.json();
        setUserData(data);
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
