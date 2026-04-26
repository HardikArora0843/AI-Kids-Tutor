import { Navigate } from "react-router-dom";

const clearChildSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("sessionExpiresAt");
};

const getSafeChildUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = getSafeChildUser();
  const expiresAt = Number(localStorage.getItem("sessionExpiresAt") || 0);
  const isExpired = !expiresAt || Date.now() > expiresAt;

  if (isExpired) {
    clearChildSession();
  }

  if (!token || !user || isExpired) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    clearChildSession();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
