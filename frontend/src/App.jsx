import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
// Import des composants d'authentification
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/auth/ChangePassword';
// import Logout from './pages/auth/Logout';

// Import du Dashboard principal
import RoleBasedDashboard from './pages/dashboard/RoleBasedDashboard';

function App() {
  return (
    <Router>
      {/* Styles globaux pour assurer la cohérence du design (Noir/Violet) */}
    

      <div className="min-h-screen bg-[#0a0a0c]">
        <Routes>
          {/* --- ROUTES AUTHENTIFICATION --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
           <Route path="/change-password" element={<ChangePassword />} />
          {/* <Route path="/logout" element={<Logout />} /> */}

          {/* --- ROUTE PRINCIPALE (DASHBOARD) --- */}
          
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          } 
        />

          {/* --- REDIRECTIONS PAR DÉFAUT --- */}
          {/* Si l'utilisateur arrive sur la racine, on le dirige vers le Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Capture les erreurs 404 et redirige vers login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;