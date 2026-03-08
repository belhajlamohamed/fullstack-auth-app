import React from "react";
import { Menu, Search, Bell, User, ChevronDown } from "lucide-react";


export default function Header({ setIsMobileOpen, userName = "Utilisateur" }) {


  // On récupère le rôle pour adapter l'affichage sous le nom
  const rawRole = localStorage.getItem("userRole") || "student";
  
  // On crée un libellé propre (Enseignant ou Élève)
  const roleLabel = rawRole.toLowerCase() === "teacher" ? "Enseignant" : "Élève";

  return (
    <header className="h-20 px-6 flex items-center justify-between bg-[#0a0a0c]/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 transition-all">
      
      {/* GAUCHE : Burger (Mobile) + Recherche (Desktop) */}
      <div className="flex items-center gap-4 flex-1">
        {/* BOUTON BURGER : Apparaît uniquement sur mobile (< 768px) */}
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-2.5 bg-white/5 border border-white/10 rounded-xl text-[#cbff00] hover:bg-[#cbff00]/10 transition-all active:scale-95"
        >
          <Menu size={22} />
        </button>

        {/* BARRE DE RECHERCHE : Masquée sur tout petits écrans */}
        <div className="hidden sm:flex items-center relative group max-w-md w-full">
          <Search 
            size={18} 
            className="absolute left-4 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" 
          />
          <input 
            type="text" 
            placeholder="Rechercher un quiz ou un élève..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:border-[#cbff00]/30 focus:bg-white/[0.07] transition-all text-sm font-medium placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* DROITE : Notifications + Profil */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* NOTIFICATIONS */}
        <button className="relative p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <Bell size={20} />
          {/* Badge de notification (point jaune) */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#cbff00] rounded-full border-2 border-[#0a0a0c] shadow-[0_0_8px_#cbff00]"></span>
        </button>

        {/* SEPARATEUR */}
        <div className="h-8 w-[1px] bg-white/10 hidden xs:block"></div>

        {/* BLOC PROFIL */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right hidden md:block">
            <p className="text-[11px] font-black uppercase tracking-tighter text-white leading-none">
              {userName}
            </p>
            <p className="text-[9px] text-[#cbff00] font-bold uppercase tracking-widest mt-1 opacity-80">
              {roleLabel}
            </p>
          </div>

          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:border-[#cbff00]/50 transition-all">
              <User size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            </div>
            {/* Indicateur de statut "En ligne" */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0c]"></span>
          </div>

          <ChevronDown size={14} className="text-gray-600 group-hover:text-white transition-colors hidden sm:block" />
        </div>
      </div>
    </header>
  );
}