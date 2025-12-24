import { Routes, Route } from "react-router-dom";

// Pagina's
import HostDashboardPage from "./pages/host/HostDashboardPage";
import PropertyPage from "./pages/PropertyPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/login/LoginPage.jsx";   
import RegisterPage from "./pages/register/RegisterPage.jsx";

// Componenten
import Navbar from "./components/navbar/Navbar.jsx";
import PropertyForm from "./components/properties/PropertyForm";

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
        <Route path="/host" element={<HostDashboardPage />} />
        <Route path="/booking/:propertyId" element={<BookingPage />} />
        <Route path="/add-property" element={<PropertyForm />} />
      </Routes>
    </>
  );
}
