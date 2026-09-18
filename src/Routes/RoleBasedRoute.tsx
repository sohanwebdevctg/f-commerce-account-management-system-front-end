import { Navigate, useLocation } from "react-router";
import { useAuth } from "../Context/AuthContext";

interface RoleBasedRouteProps{
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleBasedRoute = ({children, allowedRoles}: RoleBasedRouteProps) => {

  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if(!user || !allowedRoles.includes(user.role.toUpperCase())){
    return <Navigate to="/dashboard" state={{from: location}} replace />
  }

  return <>{children}</>;
}

{/* <RoleBasedRoute allowedRoles={['ADMIN', 'STAFF']}></RoleBasedRoute> */}