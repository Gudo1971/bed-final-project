import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // -----------------------------
  // INIT STATE
  // -----------------------------
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

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
  
    // Alleen token opslaan
    localStorage.setItem("token", data.token);
    setToken(data.token);
  
    // User NIET opslaan vanuit login
    // /auth/me haalt de echte user op
  };


  // -----------------------------
  // FETCH AUTH USER (/auth/me)
  // -----------------------------
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Token ongeldig → automatisch uitloggen
        if (res.status === 401 || res.status === 403 || res.status === 404) {
          logout();
          return;
        }

        const data = await res.json();

        if (res.ok) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.error("❌ Fout bij ophalen /auth/me:", err);
      }
    };

    fetchUser();
  }, [token]);

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
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
  // BECOME HOST
  // -----------------------------
  const becomeHost = async () => {
    const res = await fetch("http://localhost:3000/auth/become-host", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Kon geen host worden");
    }

    // Nieuwe token opslaan
    localStorage.setItem("token", data.token);
    setToken(data.token);

    // Nieuwe user ophalen via /auth/me
    const meRes = await fetch("http://localhost:3000/auth/me", {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    const meData = await meRes.json();

    if (meRes.ok) {
      setUser(meData);
      localStorage.setItem("user", JSON.stringify(meData));
    }

    return true;
  };

  // -----------------------------
  // UPDATE USER STATE (bijv. na Become Host)
  // -----------------------------
  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        registerUser,
        updateUser,
        becomeHost, // <— NIEUW
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
