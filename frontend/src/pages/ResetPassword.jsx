import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  
  const token = searchParams.get('token'); // On récupère le token dans l'URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reset-password', { 
        token: token, 
        new_password: newPassword 
      });
      setStatus('Mot de passe réinitialisé ! Redirection...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus('Le lien est invalide ou a expiré.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-xl w-96">
        <h2 className="text-xl font-bold mb-6">Nouveau mot de passe</h2>
        {status && <p className="mb-4 text-sm text-blue-600">{status}</p>}
        
        <input 
          type="password" placeholder="Nouveau mot de passe" required
          className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setNewPassword(e.target.value)} 
        />
        <button className="w-full bg-green-600 text-white py-2 rounded font-bold">Valider</button>
      </form>
    </div>
  );
}