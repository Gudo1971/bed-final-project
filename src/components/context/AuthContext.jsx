// ==============================================
// = AUTH CONTEXT                               =
// ==============================================

import { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ==============================================
  // = USER & TOKEN STATE                         =
  // ==============================================
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const saveToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // ==============================================
  // = FETCH USER (/api/auth/me)                  =
  // ==============================================
  const fetchUser = async () => {
    if (!token) return;

    try {
      const res = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("❌ Fout bij ophalen /api/auth/me:", err);
      logout();
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  // ==============================================
  // = LOGIN (/api/auth/login)                    =
  // ==============================================
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });

      saveToken(res.data.token);
      await fetchUser();
    } catch (err) {
      const backendError =
        err.response?.data?.error || "Login mislukt. Probeer opnieuw.";
      throw new Error(backendError);
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
  // = REGISTER (/api/auth/register)              =
  // ==============================================
  const registerUser = async (
    username,
    email,
    password,
    name,
    phoneNumber
  ) => {
    try {
      await api.post("/api/auth/register", {
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
  // = UPDATE PROFILE (PUT /api/users/:id)        =
  // ==============================================
  const updateProfile = async (form) => {
    try {
      const res = await api.put(`/api/users/${user.id}`, form);

      const updatedUser = res.data;
      const emailChanged = form.email && form.email !== user.email;

      // Update local user
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Als email is gewijzigd → direct uitloggen
      if (emailChanged) {
        logout();
      }

      return updatedUser;
    } catch (err) {
      const backendError =
        err.response?.data?.error || "Kon profiel niet bijwerken.";
      throw new Error(backendError);
    }
  };

  // ==============================================
  // = BECOME HOST (/api/account/become-host)     =
  // ==============================================
  const becomeHost = async () => {
    try {
      const res = await api.post("/api/account/become-host");

      saveToken(res.data.token);
      await fetchUser();
    } catch (err) {
      const backendError =
        err.response?.data?.error || "Kon geen host worden.";
      throw new Error(backendError);
    }
  };

  // ==============================================
  // = STOP HOST (/api/account/stop-host)         =
  // ==============================================
  const stopHost = async () => {
    try {
      const res = await api.delete("/api/account/stop-host");

      saveToken(res.data.token);
      await fetchUser();
    } catch (err) {
      const backendError =
        err.response?.data?.error || "Kon host account niet stoppen.";
      throw new Error(backendError);
    }
  };

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
