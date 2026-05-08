import { Navigate } from "react-router-dom";

const normalizeRole = (role) => {
  if (!role) return "";
  return role.toString().replace(/^ROLE_/i, "").toUpperCase();
};

const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/login" }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const userRole = normalizeRole(sessionStorage.getItem("userType"));
  const normalizedRoles = allowedRoles?.map(normalizeRole);

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  if (normalizedRoles && !normalizedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
