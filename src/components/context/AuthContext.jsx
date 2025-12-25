import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // SAFE PARSE
  const safeParse = (key) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(safeParse("user"));
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (email, password) => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login mislukt");
    }

    // Backend stuurt volledige user terug
    const userData = data.user;

    // Token opslaan (alleen als backend hem meestuurt)
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    }

    // User opslaan
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // -----------------------------
  // REGISTER
  // -----------------------------
  const registerUser = async (username, email, password, name, phoneNumber) => {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
        name,
        phoneNumber,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registratie mislukt");
    }

    return true;
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
