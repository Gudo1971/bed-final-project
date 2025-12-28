import { Routes, Route } from "react-router-dom";

// Pagina's
import HostDashboardPage from "./pages/host/HostDashboardPage.jsx";
import HostProperties from "./pages/host/HostProperties.jsx";
import HostBookings from "./pages/host/HostBookings.jsx";
import PropertyPage from "./pages/PropertyPage.jsx";
import PropertyDetailPage from "./pages/PropertyDetailPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import RegisterPage from "./pages/register/RegisterPage.jsx";
import HostEarningsPage from "./pages/host/HostEarningsPage.jsx";

// Componenten
import Navbar from "./components/navbar/Navbar.jsx";
import PropertyForm from "./components/properties/PropertyForm.jsx";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<PropertyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/properties" element={<PropertyForm />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Host routes */}
        <Route path="/host" element={<HostDashboardPage />} />
        <Route path="/host/dashboard" element={<HostDashboardPage />} />
        <Route path="/host/properties" element={<HostProperties />} />
        <Route path="/host/bookings" element={<HostBookings />} />
        <Route path="/host/earnings" element={<HostEarningsPage />} />


        <Route path="/booking/:propertyId" element={<BookingPage />} />
        <Route path="/add-property" element={<PropertyForm />} />
      </Routes>
    </>
  );
}
