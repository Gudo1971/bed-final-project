// ============================================================
// = APP ROUTER                                                =
// ============================================================

import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import HostLayout from "./layouts/HostLayout.jsx";

// Public pages
import PropertyPage from "./pages/PropertyPage.jsx";
import PropertyDetailPage from "./pages/PropertyDetailPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import HostProfilePage from "./pages/host/HostProfilePage.jsx"; 

// Auth pages
import LoginPage from "./pages/login/LoginPage.jsx";
import RegisterPage from "./pages/register/RegisterPage.jsx";

// Host pages
import HostDashboardPage from "./pages/host/HostDashboardPage.jsx";
import HostProperties from "./pages/host/HostProperties.jsx";
import HostBookings from "./pages/host/HostBookings.jsx";
import HostEarningsPage from "./pages/host/HostEarningsPage.jsx";

// Property form
import PropertyForm from "./components/properties/PropertyForm.jsx";

export default function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PropertyPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/booking/:propertyId" element={<BookingPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/*  HOST PROFIEL PAGINA */}
        <Route path="/host-profile/:id" element={<HostProfilePage />} />
      </Route>

      {/* AUTH ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* HOST ROUTES */}
      <Route element={<HostLayout />}>
        <Route path="/host" element={<HostDashboardPage />} />
        <Route path="/host/dashboard" element={<HostDashboardPage />} />
        <Route path="/host/properties" element={<HostProperties />} />
        <Route path="/host/bookings" element={<HostBookings />} />
        <Route path="/host/earnings" element={<HostEarningsPage />} />
        <Route path="/add-property" element={<PropertyForm />} />
      </Route>

    </Routes>
  );
}
