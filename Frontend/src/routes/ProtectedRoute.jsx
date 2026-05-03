// routes/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isAuthenticated");

  return isAuth ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;