import React from "react";
import { 
  Home, Layout, BarChart3, User, 
  ChevronLeft, ChevronRight, X, LogOut, BookOpen, GraduationCap 
} from "lucide-react";
import { logout, getUserRole } from "../../utils/auth";

export default function Sidebar({ 
  activeView, setActiveView, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen 
}) {

  // On récupère le rôle proprement via l'utilitaire
  const userRole = (getUserRole() || "student").toUpperCase();

  const menuConfig = [
    { id: "home", label: "Dashboard", icon: <Home size={22} />, roles: ["TEACHER", "STUDENT"] },
    { id: "my-quizzes", label: "Mes Quiz", icon: <Layout size={22} />, roles: ["TEACHER"] },
    { id: "explore", label: "Explorer", icon: <BookOpen size={22} />, roles: ["STUDENT"] },
    { id: "results", label: "Mes Notes", icon: <GraduationCap size={22} />, roles: ["STUDENT"] },
    { id: "stats", label: "Statistiques", icon: <BarChart3 size={22} />, roles: ["TEACHER"] },
    { id: "profile", label: "Mon Profil", icon: <User size={22} />, roles: ["TEACHER", "STUDENT"] },
  ];


  const filteredMenu = menuConfig.filter(item => item.roles.includes(userRole));
  
 

  return (
    <>
      {/* Overlay : On le garde pour pouvoir fermer complètement le menu sur mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-[120] bg-[#0a0a0c] border-r border-white/5 transition-all duration-300 flex flex-col
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        ${isCollapsed ? "w-20" : "w-64"} 
        md:translate-x-0 
      `}>
        
        {/* HEADER DU SIDEBAR */}
        <div className={`p-4 flex items-center border-b border-white/5 h-20 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <div className="flex flex-col ml-2 animate-in fade-in duration-300">
              <span className="text-lg font-black uppercase italic tracking-tighter text-[#cbff00]">SKYQUIZ</span>
              <span className="text-[8px] font-bold text-gray-500 tracking-[0.3em] uppercase">{userRole}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* CHEVRON : Maintenant visible sur TOUS les écrans pour réduire/élargir */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-[#cbff00] transition-all"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* BOUTON X : Uniquement pour fermer COMPLÈTEMENT sur mobile */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-2 text-gray-500 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 mt-4 space-y-2">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => {console.log("Clic sur:", item.id);setActiveView(item.id)}}
              className={`w-full flex items-center rounded-2xl transition-all py-3.5
                ${isCollapsed ? "justify-center px-0" : "px-4 gap-4"}
                ${activeView === item.id ? "bg-[#cbff00] text-black shadow-lg shadow-[#cbff00]/20" : "text-gray-500 hover:bg-white/5 hover:text-white"}
              `}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {!isCollapsed && (
                <span className="font-bold uppercase text-[10px] tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-white/5">
          <button 
          onClick={logout}
          className={`w-full flex items-center text-red-500/70 hover:text-red-500 py-3 rounded-xl transition-all ${isCollapsed ? "justify-center" : "px-4 gap-4"}`}>
            <LogOut size={20} />
            {!isCollapsed && <span className="font-bold uppercase text-[10px] tracking-widest">Quitter</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
