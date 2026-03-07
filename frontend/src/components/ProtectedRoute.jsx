import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");

  // Si pas de token, on redirige vers le login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si le token existe, on affiche le composant enfant (le Dashboard)
  return children;
};

export default ProtectedRoute;