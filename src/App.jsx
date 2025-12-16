import ProtectedRoute from "./auth/ProtectedRoutes";
import HostRoute from "./auth/HostRoute";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar"; // <-- jouw navbar
import PropertyPage from "./pages/PropertyPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import BookingPage from "./pages/BookingPage";
import PropertyForm from "./components/properties/PropertyForm";


export default function App() {
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

         <Route
          path="/booking/:propertyId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
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

