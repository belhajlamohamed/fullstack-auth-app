import React from "react";
import { KeyRound, Lock, ShieldCheck, ArrowRight, ChevronLeft } from "lucide-react";

export default function PasswordChange() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
      {/* GLOW EFFECT */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#673ee5]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8 relative z-10 shadow-2xl">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-[#cbff00] rounded-2xl flex items-center justify-center text-black shadow-lg shadow-[#cbff00]/20">
            <KeyRound size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Sécurité</h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              Mise à jour du mot de passe
            </p>
          </div>
        </div>

        {/* FORM */}
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Ancien mot de passe</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-[#121214]/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-white/20 transition-all text-white" 
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Nouveau mot de passe</label>
              <input 
                type="password" 
                placeholder="Minimum 8 caractères" 
                className="w-full bg-[#121214]/50 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#cbff00] transition-all text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Confirmation</label>
              <input 
                type="password" 
                placeholder="Confirmer le pass" 
                className="w-full bg-[#121214]/50 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#cbff00] transition-all text-white" 
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#cbff00] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-[10px] shadow-xl shadow-white/5"
          >
            Mettre à jour <ShieldCheck size={18}/>
          </button>
        </form>

        <button 
          onClick={() => window.history.back()}
          className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-white transition-all"
        >
          <ChevronLeft size={14}/> Retour
        </button>
      </div>
    </div>
  );
}