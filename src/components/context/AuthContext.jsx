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
  // = FETCH USER (/auth/me)                      =
  // ==============================================
  const fetchUser = async () => {
    if (!token) return;

    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("❌ Fout bij ophalen /auth/me:", err);

      clearToken();
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  // ==============================================
  // = LOGOUT (EDGE-PROOF)                        =
  // ==============================================
  const logout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      setUser(null);
      setToken(null);

      // Cookies verwijderen
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
      });

      // Service workers verwijderen
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.unregister();
        }
      }

      // Cache leegmaken
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        for (const name of cacheNames) {
          await caches.delete(name);
        }
      }
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
  };

  // ==============================================
  // = LOGIN (/auth/login)                        =
  // ==============================================
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      saveToken(res.data.token);
      await fetchUser();
    } catch (err) {
      // ⭐ BELANGRIJK: laat de originele Axios error intact
      throw err;
    }
  };

  // ==============================================
  // = REGISTER (/auth/register)                  =
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
      throw err;
    }
  };

  // ==============================================
  // = UPDATE PROFILE (PUT /users/:id)            =
  // ==============================================
  const updateProfile = async (form) => {
    try {
      const res = await api.put(`/users/${user.id}`, form);

      const updatedUser = res.data;
      const emailChanged = form.email && form.email !== user.email;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (emailChanged) {
        logout(); // ← werkt nu correct
      }

      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  // ==============================================
  // = BECOME HOST (/account/become-host)         =
  // ==============================================
  const becomeHost = async () => {
    try {
      const res = await api.post("/account/become-host");

      saveToken(res.data.token);
      await fetchUser();
    } catch (err) {
      throw err;
    }
  };

  // ==============================================
  // = STOP HOST (/account/stop-host)             =
  // ==============================================
  const stopHost = async () => {
    try {
      const res = await api.delete("/account/stop-host");

      saveToken(res.data.token);
      await fetchUser();
    } catch (err) {
      throw err;
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
