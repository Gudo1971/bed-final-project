// ==============================================
// = AUTH CONTEXT                               =
// = Token sync + user sync + host flow         =
// ==============================================

import { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ==============================================
  // = STATE: user + token                        =
  // ==============================================
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // ==============================================
  // = TOKEN HELPERS                              =
  // ==============================================
  const saveToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // ==============================================
  // = FETCH USER (/auth/me)                      =
  // ==============================================
  const fetchUser = async () => {
    if (!token) return;

    try {
      const res = await api.get("/auth/me",{
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("❌ Fout bij ophalen /auth/me:", err);
      logout();
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

// ==============================================
// = LOGIN                                      =
// ==============================================
const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });

    saveToken(res.data.token);
    await fetchUser();
  } catch (err) {
    console.log("❌ Login error in AuthContext:", err);

    // Axios-interceptor geeft ALTIJD: { error: "..." }
    const backendError =
      err.error || err.message || "Login mislukt. Probeer opnieuw.";

    // Gooi in exact hetzelfde formaat door naar LoginPage
    throw { error: backendError };
  }
};


  // ==============================================
  // = LOGOUT                                     =
  // ==============================================
  const logout = () => {
    clearToken();
    localStorage.removeItem("user");
    setUser(null);
  };

  // ==============================================
  // = REGISTER                                   =
  // ==============================================
  const registerUser = async (username, email, password, name, phoneNumber) => {
    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
        name,
        phoneNumber,
      });

      return true;
    } catch (err) {
      const backendError =
        err.response?.data?.error || "Registratie mislukt.";
      throw new Error(backendError);
    }
  };

  // ==============================================
  // = UPDATE PROFILE (email, name, phoneNumber)  =
  // ==============================================
  const updateProfile = async (form) => {
    try {
      const res = await api.patch("/auth/update-profile", form);

      const { user: updatedUser, token: newToken } = res.data;
      const emailChanged = form.email && form.email !== user.email;

      // Token opslaan (alleen als backend een nieuwe geeft)
      if (newToken) {
        saveToken(newToken);
      }

      // User opslaan
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Als email is gewijzigd → DIRECT uitloggen (geen fetchUser!)
      if (emailChanged) {
        logout();
        return updatedUser;
      }

      return updatedUser;
    } catch (err) {
      const backendError =
        err.response?.data?.error || "Kon profiel niet bijwerken.";
      throw new Error(backendError);
    }
  };

  // ==============================================
  // = BECOME HOST                                =
  // ==============================================
  const becomeHost = async () => {
    try {
      const res = await api.post("/account/become-host");

      saveToken(res.data.token);
      await fetchUser();
    } catch (err) {
      const backendError =
        err.response?.data?.error || "Kon geen host worden.";
      throw new Error(backendError);
    }
  };

  // ==============================================
  // = STOP HOST                                  =
  // ==============================================
  const stopHost = async () => {
    try {
      const res = await api.delete("/account/stop-host");

      saveToken(res.data.token);
      await fetchUser();
    } catch (err) {
      const backendError =
        err.response?.data?.error || "Kon host account niet stoppen.";
      throw new Error(backendError);
    }
  };

  // ==============================================
  // = PROVIDER                                   =
  // ==============================================
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        registerUser,
        updateProfile,
        becomeHost,
        stopHost,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
