import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Context/AuthContext";

// List of authorized roles
const ALLOWED_ROLES = ["ADMIN", "MODERATOR", "STAFF"];

interface ProtectedRouteProps {
  children?: React.ReactNode;
}


export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token, id, email, role, loading } = useAuth();
  const location = useLocation();

  // It will wait while initial loading is in progress
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if all data and roles in local storage/state are correct
  const isAuthenticated = Boolean(token && id && email && role && ALLOWED_ROLES.includes(role));

  // Redirects directly to the login page if the data or role is invalid
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If everything is in order, it will display Children
  return <>{children}</>;
};