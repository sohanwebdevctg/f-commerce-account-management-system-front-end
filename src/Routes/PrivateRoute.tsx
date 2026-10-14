import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // send the role dynamically from the outside
}

export const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { token, id, email, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading.........</div>;
  }

  // Check whether the user is logged in and if the data is correct
  const isAuthenticated = Boolean(token && id && email && role);

  // Check if the user's role matches the dynamically passed allowedRoles
  const hasPermission = role ? allowedRoles.includes(role) : false;

  // If the user is not logged in or does not have the required role permissions for this page
  if (!isAuthenticated || !hasPermission) {
    // Redirecting the user to the login page or dashboard if they do not have access
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // The children will render if permission is granted
  return <>{children}</>;
};