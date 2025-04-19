import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/AuthProvider";
import { useLocation } from "react-router";

const PrivateRoute = () => {
  const location = useLocation();
  const authDetails = useAuth();

  if (!authDetails.token) {
    // TODO: before redirecting store the last meeting link
    localStorage.setItem("meeting-path", location.pathname);
    return <Navigate to="/signin" />;
  }
  return <Outlet />;
};

export default PrivateRoute;
