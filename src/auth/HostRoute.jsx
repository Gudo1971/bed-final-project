import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

export default function HostRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return null; // of een spinner
  }

  const roles = user?.["https://gudo.dev/roles"] || [];

  if (!isAuthenticated || !roles.includes("host")) {
    return <Navigate to="/" replace />;
  }

  return children;
}
