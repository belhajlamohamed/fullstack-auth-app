import { Navigate, useLocation } from "react-router-dom";
import { getUser, getUserRole } from "../../utils/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = getUser();
  const role = getUserRole();
  const location = useLocation();

  // 1. Pas d'utilisateur connecté ? Direction Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Utilisateur connecté mais n'a pas le bon rôle ? Direction Unauthorized ou Home
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Tout est OK, on affiche le composant (Dashboard)
  return children;
}



// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   // On vérifie si l'utilisateur est connecté (exemple via localStorage)
//   // const isAuthenticated = localStorage.getItem("userRole"); 
//   const token = localStorage.getItem('access_token')

//   if (!token) {
//     // Si pas de rôle, on redirige vers le login
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;