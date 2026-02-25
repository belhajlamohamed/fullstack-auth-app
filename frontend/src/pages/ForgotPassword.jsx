import { useState } from 'react';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/forgot-password', { email });
      setMessage({ type: 'success', text: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Une erreur est survenue.' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-lg rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">Mot de passe oublié</h2>
        <p className="text-sm text-gray-600 mb-6">Entrez votre email pour recevoir un lien de récupération.</p>
        
        {message.text && (
          <div className={`p-2 mb-4 text-sm rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <input 
          type="email" placeholder="votre@email.com" required
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setEmail(e.target.value)} 
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">Envoyer le lien</button>
      </form>
    </div>
  );
}