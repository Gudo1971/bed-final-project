import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropertyPage from "./pages/PropertyPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PropertyPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
