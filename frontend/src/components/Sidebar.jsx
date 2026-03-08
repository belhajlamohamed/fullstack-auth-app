import React from "react";
import { useNavigate } from "react-router-dom";

import { 
  Home, 
  Layout, 
  BarChart3, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  X,
  LogOut 
} from "lucide-react";

export default function Sidebar({ 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen, 
  activeView, 
  setActiveView 
}) {

  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Supprimer les données d'authentification
    localStorage.removeItem("userRole"); 
    localStorage.removeItem("access_token");
    // Optionnel : localStorage.clear(); // Pour tout vider d'un coup
    
    // 2. Rediriger immédiatement vers le Login
    // Le "replace: true" empêche l'utilisateur de revenir en arrière avec le bouton du navigateur
    navigate("/login", { replace: true });
  };
  
  const menuItems = [
    { id: "home", label: "Dashboard", icon: <Home size={22} /> },
    { id: "quiz", label: "Mes Quiz", icon: <Layout size={22} /> },
    { id: "stats", label: "Statistiques", icon: <BarChart3 size={22} /> },
    { id: "profile", label: "Mon Profil", icon: <User size={22} /> },
  ];

  return (
    <>
      {/* 1. OVERLAY MOBILE */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
          onClick={() => setIsMobileOpen(false)} // Permet de fermer en cliquant à côté
        />
      )}

      {/* 2. LE SIDEBAR */}
      <aside className={`
        fixed top-0 left-0 h-full z-[110] bg-[#0a0a0c] border-r border-white/5 transition-all duration-300 ease-in-out flex flex-col
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        ${isCollapsed ? "md:w-20" : "md:w-64"} 
        md:translate-x-0
      `}>
        
        {/* HEADER DU SIDEBAR */}
        <div className={`p-4 flex items-center border-b border-white/5 h-20 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <span className="text-lg font-black uppercase  tracking-tighter text-[#cbff00] ml-2">
              SKYQUIZ
            </span>
          )}

          <div className="flex gap-1">
            {/* CHEVRON : Desktop (Réduire/Élargir) */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-2 hover:bg-white/10 rounded-xl text-gray-400 hover:text-[#cbff00] transition-all"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* BOUTON X (BURGER) : Mobile (Fermer) */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden group relative flex items-center justify-center w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 transition-all duration-300 active:scale-90 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              title="Fermer le menu"
            >
              {/* Effet de lueur interne au hover */}
              <X size={22} strokeWidth={2.5} className="relative z-10 transition-transform duration-300 group-hover:rotate-90" />
              
              {/* Animation d'onde au clic (facultatif via CSS) */}
              <span className="absolute inset-0 rounded-xl bg-red-500 opacity-0 group-active:opacity-20 transition-opacity"></span>
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 mt-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                // J'AI RETIRÉ LA LIGNE QUI FERMAIT LE SIDEBAR ICI
              }}
              className={`w-full flex items-center rounded-2xl transition-all py-3.5
                ${isCollapsed ? "justify-center px-0" : "px-4 gap-4"}
                ${activeView === item.id ? "bg-[#cbff00] text-black shadow-lg" : "text-gray-500 hover:bg-white/5 hover:text-white"}
              `}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {!isCollapsed && (
                <span className="font-bold uppercase text-[10px] tracking-[0.2em] whitespace-nowrap animate-in fade-in duration-300">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/5">
          <button className={`w-full flex items-center text-red-500/70 hover:text-red-500 py-3 rounded-xl transition-all ${isCollapsed ? "justify-center" : "px-4 gap-4"}`}
          onClick={handleLogout}
          >
          
            <LogOut size={20} />
            {!isCollapsed && <span className="font-bold uppercase text-[10px] tracking-widest">Quitter</span>}
          </button>
        </div>
      </aside>
    </>
  );
}