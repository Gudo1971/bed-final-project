// ==============================================
// = APP ROUTER                                  =
// = Alle pagina-routes van StayBnB              =
// ==============================================

import { Routes, Route } from "react-router-dom";

// ==============================================
// = PAGINA'S                                    =
// ==============================================
import HostDashboardPage from "./pages/host/HostDashboardPage.jsx";
import HostProperties from "./pages/host/HostProperties.jsx";
import HostBookings from "./pages/host/HostBookings.jsx";
import HostEarningsPage from "./pages/host/HostEarningsPage.jsx";

import PropertyPage from "./pages/PropertyPage.jsx";
import PropertyDetailPage from "./pages/PropertyDetailPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import LoginPage from "./pages/login/LoginPage.jsx";
import RegisterPage from "./pages/register/RegisterPage.jsx";

// ==============================================
// = COMPONENTEN                                 =
// ==============================================
import Navbar from "./components/navbar/Navbar.jsx";
import PropertyForm from "./components/properties/PropertyForm.jsx";

// ==============================================
// = COMPONENT                                   =
// ==============================================
export default function App() {
  return (
    <>
      {/* ============================================== */}
      {/* = NAVBAR                                      = */}
      {/* ============================================== */}
      <Navbar />

      {/* ============================================== */}
      {/* = ROUTES                                      = */}
      {/* ============================================== */}
      <Routes>
        {/* ---------------------------------------------- */}
        {/* PUBLIC ROUTES                                 */}
        {/* ---------------------------------------------- */}
        <Route path="/" element={<PropertyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ---------------------------------------------- */}
        {/* PROPERTY ROUTES                               */}
        {/* ---------------------------------------------- */}
        <Route path="/properties" element={<PropertyForm />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />

        {/* ---------------------------------------------- */}
        {/* USER PROFILE                                  */}
        {/* ---------------------------------------------- */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* ---------------------------------------------- */}
        {/* HOST ROUTES                                   */}
        {/* ---------------------------------------------- */}
        <Route path="/host" element={<HostDashboardPage />} />
        <Route path="/host/dashboard" element={<HostDashboardPage />} />
        <Route path="/host/properties" element={<HostProperties />} />
        <Route path="/host/bookings" element={<HostBookings />} />
        <Route path="/host/earnings" element={<HostEarningsPage />} />

        {/* ---------------------------------------------- */}
        {/* BOOKING FLOW                                  */}
        {/* ---------------------------------------------- */}
        <Route path="/booking/:propertyId" element={<BookingPage />} />

        {/* ---------------------------------------------- */}
        {/* ADD PROPERTY                                  */}
        {/* ---------------------------------------------- */}
        <Route path="/add-property" element={<PropertyForm />} />
      </Routes>
    </>
  );
}
