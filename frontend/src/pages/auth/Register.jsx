import React, { useState } from "react";
import axios from "../../api/axios";
import { User, Mail, Lock, GraduationCap, School, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function Register() {
  // 1. États du formulaire
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  
  // États de l'interface
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 2. Gestion des changements d'input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Efface l'erreur quand l'utilisateur recommence à taper
  };

  // 3. Soumission avec Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/users/register", {
        ...formData,
        role: role
      });

      // Avec Axios, la réponse est déjà parsée en JSON dans response.data
      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        // Optionnel : Redirection après 2 secondes
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      // Gestion d'erreur robuste avec Axios
      const message = err.response?.data?.message || "Une erreur réseau est survenue";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
      {/* EFFETS VISUELS DE FOND */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#673ee5]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full pointer-events-none" />

      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-xl backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 relative z-10 shadow-2xl"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Inscription</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Crée ton compte futuriste</p>
        </div>

        {/* MESSAGES D'ÉTAT */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-black uppercase tracking-widest animate-shake">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {success && (
          <div className="bg-[#cbff00]/10 border border-[#cbff00]/20 text-[#cbff00] p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-center">
            Compte créé avec succès ! Redirection...
          </div>
        )}

        {/* SÉLECTEUR DE RÔLE */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button" 
            onClick={() => setRole("student")}
            className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${role === "student" ? "bg-[#cbff00]/10 border-[#cbff00] text-[#cbff00] shadow-[0_0_20px_rgba(203,255,0,0.1)]" : "bg-white/5 border-transparent text-gray-500 hover:bg-white/10"}`}
          >
            <GraduationCap size={28} />
            <span className="text-[10px] font-black uppercase tracking-widest">Étudiant</span>
          </button>
          <button
            type="button" 
            onClick={() => setRole("teacher")}
            className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${role === "teacher" ? "bg-[#673ee5]/10 border-[#673ee5] text-[#673ee5] shadow-[0_0_20px_rgba(103,62,229,0.1)]" : "bg-white/5 border-transparent text-gray-500 hover:bg-white/10"}`}
          >
            <School size={28} />
            <span className="text-[10px] font-black uppercase tracking-widest">Enseignant</span>
          </button>
        </div>

        {/* INPUTS D'INSCRIPTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 text-xs">Nom d'utilisateur</label>
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
              <input 
                required
                name="username"
                type="text" 
                value={formData.username}
                onChange={handleChange}
                placeholder="Ex: Neo2024" 
                className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] transition-all text-white placeholder:text-gray-700" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 text-xs">Adresse Email</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
              <input 
                required
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="neo@matrix.com" 
                className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] transition-all text-white placeholder:text-gray-700" 
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 text-xs">Mot de passe</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#673ee5] transition-colors" />
              <input 
                required
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••" 
                className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#673ee5] transition-all text-white placeholder:text-gray-700" 
              />
            </div>
          </div>
        </div>

        {/* BOUTON D'ACTION */}
        <button 
          disabled={loading || success}
          className="w-full bg-gradient-to-r from-[#cbff00] to-green-400 text-black font-black py-5 rounded-[2rem] shadow-xl shadow-[#cbff00]/10 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              Confirmer l'inscription 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
          Déjà membre ? 
          <a href="/login" className="text-[#cbff00] hover:text-white transition-colors ml-2 border-b border-[#cbff00]">Se connecter</a>
        </p>
      </form>
    </div>
  );
}