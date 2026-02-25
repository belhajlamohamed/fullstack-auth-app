import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';


// --- LE COMPOSANT PROTECTED ROUTE ---
// On le définit ici pour qu'il soit disponible pour toutes les routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // Si le token n'existe pas, on redirige vers le login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Si le token existe, on affiche le composant enfant (le Dashboard)
  return children;
};

function App() {

 
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {/* Route pour l'inscription */}
          <Route path="/register" element={<Register />} />

          
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/dashboard" element={<ProtectedRoute>
                       <Dashboard />
            </ProtectedRoute>} 
            />
          
          {/* Tu ajouteras tes autres routes ici plus tard (Login, Dashboard...) */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
