// ==============================================
// = USER CONTEXT                                =
// = Auth0 → Backend user sync                   =
// ==============================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { useAuth0 } from "@auth0/auth0-react";
import api from "../../api/axios";

const UserContext = createContext(null);

// ==============================================
// = PROVIDER                                    =
// ==============================================
export function UserProvider({ children }) {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  const [userData, setUserData] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [error, setError] = useState(null);

  // ==============================================
  // = USER LADEN                                 =
  // ==============================================
  const loadUser = useCallback(async () => {
    if (isLoading || !isAuthenticated) {
      setUserData(null);
      return;
    }

    try {
      setIsFetchingUser(true);
      setError(null);

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://staybnb.gudo.dev/api",
          scope: "openid profile email offline_access",
        },
      });

      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(res.data);
    } catch (err) {
      console.error("❌ Failed to load user:", err);
      setError(err);
      setUserData(null);
    } finally {
      setIsFetchingUser(false);
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  // ==============================================
  // = AUTO LOAD BIJ AUTH CHANGE                  =
  // ==============================================
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ==============================================
  // = MEMOIZED CONTEXT VALUE                     =
  // ==============================================
  const value = useMemo(
    () => ({
      userData,
      setUserData,
      isFetchingUser,
      error,
      refreshUser: loadUser,
    }),
    [userData, isFetchingUser, error, loadUser]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ==============================================
// = HOOK                                        =
// ==============================================
export function useUser() {
  return useContext(UserContext);
}
