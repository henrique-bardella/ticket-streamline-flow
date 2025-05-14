
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { UserRole } from "@/types";

interface AuthLayoutProps {
  requiredRole?: UserRole | UserRole[];
}

const AuthLayout = ({ requiredRole }: AuthLayoutProps) => {
  const { isAuthenticated, hasPermission } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check for required role if specified
  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AuthLayout;
