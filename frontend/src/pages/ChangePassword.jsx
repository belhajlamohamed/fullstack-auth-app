import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      return setStatus({ type: 'error', msg: 'Les nouveaux mots de passe ne correspondent pas.' });
    }

    try {
      // Pas besoin de passer le token ici, l'intercepteur axios.js s'en occupe !
      await api.post('/change-password', {
        old_password: passwords.old_password,
        new_password: passwords.new_password
      });
      
      setStatus({ type: 'success', msg: 'Mot de passe mis à jour ! Redirection vers la connexion...'});
      // --- LA PROTECTION ---
    setTimeout(() => {
      localStorage.removeItem('token'); // On supprime l'ancien token devenu "obsolète"
      navigate('/login');               // Redirection forcée
    }, 2000);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        msg: err.response?.data?.detail || 'Erreur lors du changement.' 
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-xl w-96">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Changer le mot de passe</h2>
        
        {status.msg && (
          <div className={`p-2 mb-4 text-sm rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.msg}
          </div>
        )}

        <input 
          type="password" placeholder="Ancien mot de passe" required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setPasswords({...passwords, old_password: e.target.value})}
        />
        <input 
          type="password" placeholder="Nouveau mot de passe" required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
        />
        <input 
          type="password" placeholder="Confirmer le nouveau" required
          className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setPasswords({...passwords, confirm_password: e.target.value})}
        />

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-bold">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}