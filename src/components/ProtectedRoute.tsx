import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: "admin" | "customer" | "delivery";
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
