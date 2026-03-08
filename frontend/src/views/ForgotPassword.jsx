import React, { useState } from "react";
import axios from "axios";
import { Mail, ArrowRight, Loader2, AlertCircle, ChevronLeft, Send, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Envoi de l'email au format JSON vers le backend
      const response = await axios.post("http://localhost:8000/users/forgot-password", { 
        email 
      });

      if (response.status === 200 || response.status === 201) {
        setIsSent(true);
      }
    } catch (err) {
      if (!err.response) {
        setError("Le serveur est injoignable (Port 8000)");
      } else {
        setError(err.response.data.message || "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
      {/* EFFETS DE FOND */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#673ee5]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 relative z-10 shadow-2xl">
        
        {/* ÉCRAN DE SUCCÈS APRÈS ENVOI */}
        {isSent ? (
          <div className="text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#cbff00]/10 border border-[#cbff00]/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(203,255,0,0.1)]">
              <CheckCircle2 size={40} className="text-[#cbff00]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Email envoyé !</h2>
              <p className="text-gray-400 text-xs leading-relaxed uppercase tracking-widest font-bold">
                Vérifie ta boîte de réception à l'adresse <br/>
                <span className="text-white">{email}</span>
              </p>
            </div>
            <button 
              onClick={() => window.location.href = "/login"}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-white/10 flex items-center justify-center gap-2"
            >
              <ChevronLeft size={16} /> Retour à la connexion
            </button>
          </div>
        ) : (
          /* FORMULAIRE DE RÉCUPÉRATION */
          <>
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Send size={28} className="text-[#cbff00]" />
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">Mot de passe oublié</h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Saisis ton email pour continuer</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-shake">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Adresse Email</label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#cbff00] transition-colors" />
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com" 
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-[#cbff00] transition-all text-sm font-bold" 
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#cbff00] to-green-400 text-black font-black py-5 rounded-[2rem] shadow-xl shadow-[#cbff00]/10 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Réinitialiser <ArrowRight size={20}/></>}
              </button>
            </form>

            <button 
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all tracking-[0.2em]"
            >
              <ChevronLeft size={14}/> Retour
            </button>
          </>
        )}
      </div>
    </div>
  );
}