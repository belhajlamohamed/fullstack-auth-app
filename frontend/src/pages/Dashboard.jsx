import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // L'intercepteur Axios ajoute automatiquement le token Bearer
        const response = await api.get('/me');
        setUser(response.data);
      } catch (err) {
        console.error("Erreur de récupération du profil:", err);
        // Si 401, l'intercepteur gère la redirection, sinon on force ici
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Optionnel : supprime le header par défaut si tu l'as fixé manuellement
  delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  if (loading) return <div className="flex justify-center mt-20">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de navigation simple */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
        <h1 className="text-xl font-bold text-blue-600">Mon App</h1>
        <div className="flex gap-4 items-center">
          <Link to="/change-password" title="Paramètres">
            <button className="text-gray-600 hover:text-blue-600 transition">⚙️</button>
          </Link>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-blue-500">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Ravi de vous revoir, {user?.username || 'Utilisateur'} !
          </h2>
          <p className="text-gray-500 italic mb-6">Connecté en tant que : {user?.email}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <span className="block text-xs font-semibold text-blue-400 uppercase">Statut du compte</span>
              <span className="text-lg font-medium text-blue-800">
                {user?.is_active ? '✅ Activé' : '❌ En attente'}
              </span>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <span className="block text-xs font-semibold text-green-400 uppercase">Rôle</span>
              <span className="text-lg font-medium text-green-800">Utilisateur Standard</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}