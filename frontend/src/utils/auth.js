// Tes fonctions getUser(), logout(), etc.
// src/utils/auth.js

/**
 * Récupère l'objet utilisateur complet depuis le localStorage
 */
export const getUser = () => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Erreur lors de la lecture de l'utilisateur", error);
        return null;
    }
};

/**
 * Récupère spécifiquement le rôle
 */
export const getUserRole = () => {
    const user = getUser();
    return user?.role?.toLowerCase() || null;
};

/**
 * Récupère spécifiquement le nom d'utilisateur
 */
export const getUsername = () => {
    const user = getUser();
    return user?.username || "Utilisateur";
};

/**
 * Supprime toutes les données (Logout)
 */
export const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // Redirection forcée
};