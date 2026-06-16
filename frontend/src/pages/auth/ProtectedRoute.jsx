import { Navigate } from "react-router-dom";

const normalizeRole = (role) => {
  if (!role) return "";
  return role.toString().replace(/^ROLE_/i, "").toUpperCase();
};

const isTokenValid = () => {
  const token = sessionStorage.getItem("jwt");
  if (!token) return false;

  try {
    // JWT structure: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    // Decode the payload (base64url → JSON)
    const payload = JSON.parse(atob(parts[1]));

    // Check expiration
    if (payload.exp) {
      const expiryMs = payload.exp * 1000; // JWT exp is in seconds
      if (Date.now() > expiryMs) {
        // Token expired — clear session
        sessionStorage.clear();
        return false;
      }
    }

    return true;
  } catch {
    // Malformed token — not a valid JWT
    return false;
  }
};

const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/login" }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const userRole = normalizeRole(sessionStorage.getItem("userType"));
  const normalizedRoles = allowedRoles?.map(normalizeRole);

  if (!isLoggedIn || !isTokenValid()) {
    return <Navigate to={redirectTo} replace />;
  }

  if (normalizedRoles && !normalizedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
