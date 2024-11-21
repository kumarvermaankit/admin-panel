import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth";

const ProtectedRoutes = () => {
  const { session } = useAuth();
  return session ? <Outlet /> : <Navigate to="/login"  replace />;
};

export default ProtectedRoutes;
