import { Navigate } from "react-router-dom";

const clearParentSession = () => {
  localStorage.removeItem("parentToken");
  localStorage.removeItem("parentUser");
  localStorage.removeItem("parentSessionExpiresAt");
};

const getSafeParentUser = () => {
  try {
    const stored = localStorage.getItem("parentUser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("parentToken");
  const user = getSafeParentUser();
  const expiresAt = Number(localStorage.getItem("parentSessionExpiresAt") || 0);
  const isExpired = !expiresAt || Date.now() > expiresAt;

  if (isExpired) {
    clearParentSession();
  }

  if (!token || !user || isExpired) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "parent") {
    clearParentSession();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
