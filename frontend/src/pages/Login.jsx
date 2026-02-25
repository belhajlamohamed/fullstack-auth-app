import { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // Envoi en JSON pur
    const response = await api.post('/login', { 
      email: email, 
      password: password 
    });

    localStorage.setItem('token', response.data.access_token);
    navigate('/dashboard');
  } catch (err) {
    setError(err.response?.data?.detail || "Erreur de connexion");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion</h2>
        
        {error && <p className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">{error}</p>}
        
        <input 
          type="email" placeholder="Email" required
          className="w-full p-2 mb-4 border rounded outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" placeholder="Mot de passe" required
          className="w-full p-2 mb-6 border rounded outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition">
          Se connecter
        </button>
        
        <div className="mt-4 flex justify-between text-xs text-blue-600">
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
          <Link to="/register">Créer un compte</Link>
        </div>
      </form>
    </div>
  );
}