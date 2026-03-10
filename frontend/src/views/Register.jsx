import React, { useState } from "react";
import axios from "axios";
import { User, Mail, Lock, GraduationCap, School, ArrowRight, Loader2, AlertCircle, Inbox } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Appel au backend sur le port 8000
      const response = await axios.post("http://localhost:8000/users/register", formData);
      console.log("DONNEES RECUES: ", response.data)

      if (response.status === 201 || response.status === 200) {
        setIsSubmitted(true);
      }
    } catch (err) {
      if (!err.response) {
        setError("Le serveur est inaccessible.");
      } else {
        setError(err.response?.data?.message || "Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full" />
        <div className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 text-center space-y-8 relative z-10 shadow-2xl animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-[#cbff00]/10 border border-[#cbff00]/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(203,255,0,0.1)]">
            <Inbox size={40} className="text-[#cbff00]" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Vérifie tes emails</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Un lien de confirmation a été envoyé à <br />
              <span className="text-white font-bold">{formData.email}</span>. <br />
              Clique sur le lien pour activer ton compte.
            </p>
          </div>
          <div className="pt-4">
            <button 
              onClick={() => window.location.href = "/login"}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-white/10"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#673ee5]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full pointer-events-none" />

      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-xl backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 relative z-10 shadow-2xl"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Inscription</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Rejoins la plateforme maintenant</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-black uppercase tracking-widest animate-shake">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Sélection du rôle */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button" 
            onClick={() => setFormData({...formData, role: "student"})}
            className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "student" ? "bg-[#cbff00]/10 border-[#cbff00] text-[#cbff00]" : "bg-white/5 border-transparent text-gray-500"}`}
          >
            <GraduationCap size={28} />
            <span className="text-[10px] font-black uppercase tracking-widest">Étudiant</span>
          </button>
          <button
            type="button" 
            onClick={() => setFormData({...formData, role: "teacher"})}
            className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "teacher" ? "bg-[#673ee5]/10 border-[#673ee5] text-[#673ee5]" : "bg-white/5 border-transparent text-gray-500"}`}
          >
            <School size={28} />
            <span className="text-[10px] font-black uppercase tracking-widest">Enseignant</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Username</label>
            <div className="relative group">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
              <input required name="username" type="text" value={formData.username} onChange={handleChange} placeholder="Pseudo" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] transition-all text-sm font-bold" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
              <input required name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@exemple.com" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] transition-all text-sm font-bold" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Mot de passe</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#673ee5] transition-colors" />
              <input required name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••••••" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#673ee5] transition-all text-sm font-bold" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <button 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#cbff00] to-green-400 text-black font-black py-5 rounded-[2.5rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Confirmer l'inscription <ArrowRight size={20}/></>}
          </button>

          {/* AJOUT DU BOUTON SE CONNECTER */}
          <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Déjà inscrit ? 
            <a href="/login" className="text-[#cbff00] hover:text-white transition-colors ml-2 border-b border-[#cbff00] pb-0.5">
              Se connecter
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}