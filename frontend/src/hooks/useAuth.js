import { useState, useEffect } from 'react';
import { getUser, logout as authLogout } from '../utils/auth';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On récupère l'utilisateur via ton helper
    const currentUser = getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const logout = () => {
    authLogout(); // Appelle ta fonction qui vide le localStorage
    setUser(null);
  };

  return { user, loading, logout };
}