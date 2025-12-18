import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import ProtectedRoute from "./auth/ProtectedRoutes";
import HostRoute from "./auth/HostRoute";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import PropertyPage from "./pages/PropertyPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import BookingPage from "./pages/BookingPage";
import PropertyForm from "./components/properties/PropertyForm";
import ProfilePage from "./pages/ProfilePage";
export default function App() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  // -------------------------------
  // ⭐ syncUser boven useEffect
  // -------------------------------
  async function syncUser() {
    try {
      // ⭐ BELANGRIJK: audience MOET meegegeven worden
    const token = await getAccessTokenSilently({
  audience: "https://staybnb-api/",
  scope: "openid profile email"
});

console.log("🔐 TOKEN:", token);


      await fetch("http://localhost:3000/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user.email
        })
      });
    } catch (err) {
      console.error("Sync error:", err);
    }
  }

  // -------------------------------
  // ⭐ useEffect roept syncUser aan
  // -------------------------------
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     syncUser();
  //   }
  // }, [isAuthenticated]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/properties"
          element={
            <HostRoute>
              <PropertyForm />
            </HostRoute>
          }
        />
        
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route
          path="/booking/:propertyId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

    

        <Route path="/" element={<PropertyPage />} />
      </Routes>
    </>
  );
}
