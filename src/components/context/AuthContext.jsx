import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ---------------------------------------------------------
  // USER STATE (komt altijd uit /auth/me)
  // ---------------------------------------------------------
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // ---------------------------------------------------------
  // TOKEN KOMT ALTIJD UIT LOCALSTORAGE — GEEN STATE MEER
  // ---------------------------------------------------------
  const getToken = () => localStorage.getItem("token");

 // ---------------------------------------------------------
// LOGIN
// ---------------------------------------------------------
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

  // Token opslaan
  localStorage.setItem("token", data.token);

  // ⭐ BELANGRIJK: user ophalen
  await fetchUser();
};


  // ---------------------------------------------------------
  // FETCH USER VIA /auth/me
  // ---------------------------------------------------------
  const fetchUser = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch("http://localhost:3000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error("❌ Fout bij ophalen /auth/me:", err);
    }
  };

  // ---------------------------------------------------------
  // AUTO FETCH USER BIJ START
  // ---------------------------------------------------------
  useEffect(() => {
    fetchUser();
  }, []);

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ---------------------------------------------------------
  // REGISTER
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // BECOME HOST
  // ---------------------------------------------------------
  const becomeHost = async () => {
    const token = getToken();

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

    // DIRECT refreshen zodat nieuwe token wordt gebruikt
   
  };

  // ---------------------------------------------------------
  // UPDATE USER
  // ---------------------------------------------------------
  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: getToken(), // altijd de actuele token
        login,
        logout,
        registerUser,
        updateUser,
        becomeHost,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
