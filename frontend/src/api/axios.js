import axios from 'axios';


// 1. Création de l'instance avec l'URL de base de ton FastAPI
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});
// 2. L'INTERCEPTEUR : Le "douanier" qui ajoute le token à chaque envoi
api.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token');
    
    // Si un token existe, on l'ajoute dans le header Authorization
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. INTERCEPTEUR DE RÉPONSE : Pour gérer les sessions expirées (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le backend renvoie 401 (Unauthorized), c'est que le token n'est plus valide
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Optionnel : rediriger vers le login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;