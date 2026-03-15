import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Ajout de Link pour le mot de passe oublié
import { LogIn, Loader2, AlertCircle } from "lucide-react";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/users/login", { email, password });
      const { access_token, user } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role.toLowerCase() === "teacher" || user.role.toLowerCase() === "student" || user.role.toLowerCase() === "secretaire" || user.role.toLowerCase() === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4">
      {/* Retrait du overflow-hidden s'il y en avait un et ajustement du max-width */}
      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-6 md:p-10 rounded-[2.5rem] shadow-2xl my-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-[#cbff00] rounded-2xl mb-4 shadow-[0_0_20px_rgba(203,255,0,0.15)]">
            <LogIn className="text-black" size={24} />
          </div>
          <h1 className="text-xl font-black uppercase italic text-white tracking-tight">Connexion</h1>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-2">Espace QuizLab</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-500 ml-1 tracking-widest">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:border-[#cbff00]/40 outline-none transition-all"
              placeholder="votre@email.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Mot de passe</label>
              {/* LIEN FORGOT PASSWORD ICI */}
              <Link to="/forgot-password" size="sm" className="text-[9px] font-bold text-[#cbff00] uppercase hover:underline">
                Oublié ?
              </Link>
            </div>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white focus:border-[#cbff00]/40 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#cbff00] text-black py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(203,255,0,0.1)]"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Se connecter"}
            </button>
          </div>
          
          <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-4">
            Pas encore de compte ? <Link to="/register" className="text-white hover:text-[#cbff00]">S'inscrire</Link>
          </p>
        </form>
      </div>
    </div>
  );
}