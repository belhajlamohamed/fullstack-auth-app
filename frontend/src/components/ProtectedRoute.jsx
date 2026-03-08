import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // On vérifie si l'utilisateur est connecté (exemple via localStorage)
  // const isAuthenticated = localStorage.getItem("userRole"); 
  const token = localStorage.getItem('access_token')

  if (!token) {
    // Si pas de rôle, on redirige vers le login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;