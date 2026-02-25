import { useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    username: '' 
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Inscription en cours...' });
    
    try {
      // Appel API vers ton backend FastAPI
      const response = await api.post('/register', formData);
      
      setStatus({ 
        type: 'success',
        msg: response.data.message || 'Inscription réussie ! Vérifiez vos emails pour activer votre compte.'
        
      });
      console.log("Détails du succès:", response.data);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        msg: err.response?.data?.detail || "Une erreur est survenue lors de l'inscription." 
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Créer un compte</h2>
        
        {status.msg && (
          <div className={`p-3 mb-4 rounded text-sm ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 
            status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nom complet"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition shadow">
            S'inscrire
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ? <Link to="/login" className="text-blue-500 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}