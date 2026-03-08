import React, { useState,useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { Menu } from "lucide-react";
import Header from "../../components/Header";


// Importation des sous-composants (Modules de contenu)
// Importe tes composants ici quand ils seront prêts
const TeacherHome = () => <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><h2 className="text-2xl font-black italic">TABLEAU DE BORD <span className="text-[#cbff00]">ENSEIGNANT</span></h2><p className="text-gray-500 mt-2 uppercase tracking-widest text-xs">Statistiques globales et activité récente.</p></div>;
const StudentHome = () => <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><h2 className="text-2xl font-black italic">TABLEAU DE BORD <span className="text-[#cbff00]">ÉLÈVE</span></h2><p className="text-gray-500 mt-2 uppercase tracking-widest text-xs">Tes progrès et tes quiz à venir.</p></div>;
const ProfileSettings = () => <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 italic font-bold">Paramètres du profil</div>;


export default function App() {
  // États de contrôle
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState("home");

  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("Utilisateur");


  // --- CHARGEMENT DES INFOS UTILISATEUR ---
  useEffect(() => {
    const role = localStorage.getItem("userRole"); // "TEACHER" ou "STUDENT"
    const name = localStorage.getItem("userName");
    if (role) setUserRole(role);
    if (name) setUserName(name);
  }, []);

// --- LOGIQUE DE RENDU DYNAMIQUE ---
  const renderContent = () => {
    if (!userRole) return <div className="flex items-center justify-center h-64">Chargement...</div>;

    if (userRole === "TEACHER") {
      switch (activeView) {
        case "home": return <TeacherHome />;
        case "my-quizzes": return <div className="font-black uppercase italic text-xl text-[#cbff00]">Gestion de mes Quiz (Enseignant)</div>;
        case "stats": return <div className="font-black uppercase italic text-xl">Statistiques détaillées</div>;
        case "profile": return <ProfileSettings />;
        default: return <TeacherHome />;
      }
    } 

    if (userRole === "STUDENT") {
      switch (activeView) {
        case "home": return <StudentHome />;
        case "explore": return <div className="font-black uppercase italic text-xl text-[#cbff00]">Explorer les Quiz disponibles</div>;
        case "results": return <div className="font-black uppercase italic text-xl">Mes Notes et Résultats</div>;
        case "profile": return <ProfileSettings />;
        default: return <StudentHome />;
      }
    }
  };

  return (
     <div className="min-h-screen bg-[#0a0a0c] text-white flex overflow-x-hidden font-sans">
      
     {/* 1. SIDEBAR (Gestionnaire de navigation) */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* 2. ZONE PRINCIPALE (Header + Main) */}
      {/* La marge s'adapte dynamiquement à la largeur du Sidebar sur Desktop */}

      {/* ZONE DE CONTENU PRINCIPALE */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
     

       {/* HEADER (Barre de recherche, Notifications, Profil) */}
        <Header setIsMobileOpen={setIsMobileOpen} userName={userName} />

        {/* MAIN DE TEST */}
        <main className="p-6 md:p-10 flex-1 relative">

            {/* Décoration d'arrière-plan subtile (Glow effet) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#cbff00]/5 blur-[120px] pointer-events-none -z-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none -z-10 rounded-full"></div>
         {/* Injection du contenu selon l'état activeView */}
          <div className="relative z-10">
            {renderContent()}
          </div>
        </main>
        {/* FOOTER DISCRET (Optionnel) */}
        <footer className="p-6 text-[9px] text-gray-700 uppercase tracking-[0.4em] text-center border-t border-white/[0.02]">
          SkyQuiz &copy; 2026 • Système de Gestion de Quiz Intelligents
        </footer>

      </div>
    </div>
  );
}

