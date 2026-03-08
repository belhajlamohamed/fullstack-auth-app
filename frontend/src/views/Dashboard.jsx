import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import TeacherHome from "../views/teacher/TeacherHome";
import TeacherQuizzes from "../views/teacher/TeacherQuizzes";
import StudentHome from "../views/student/StudentHome";
import { getUserRole, getUsername } from '../utils/auth'

export default function Dashboard() {
  // On récupère le rôle et on le transforme immédiatement en minuscules pour la logique
  const [activeView, setActiveView] = useState("home");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // On utilise nos fonctions utilitaires
  const role = getUserRole();
  const userName = getUsername();

  // LOGIQUE DE RENDU
  const renderContent = () => {
    // Debug pour être sûr de ce qu'on compare
    console.log("Rendu - Vue:", activeView, "| Rôle traité:", role);

    if (!role) {
      return <div className="p-10 text-gray-500 italic">Vérification de l'authentification...</div>;
    }

    // Comparaison en minuscules pour correspondre au LocalStorage
    if (role === "teacher") {
      switch (activeView) {
        case "home": return <TeacherHome />;
        case "my-quizzes": return <TeacherQuizzes />;
        case "stats": return <div className="p-10 text-2xl font-black uppercase">Statistiques</div>;
        case "profile": return <div className="p-10 text-2xl font-black uppercase">Mon Profil</div>;
        default: return <TeacherHome />;
      }
    } 

    if (role === "student") {
      switch (activeView) {
        case "home": return <StudentHome />;
        case "explore": return <div className="p-10 text-2xl font-black italic uppercase">Explorer les Quiz</div>;
        case "results": return <div className="p-10 text-2xl font-black italic uppercase">Mes Résultats</div>;
        case "profile": return <div className="p-10 text-2xl font-black italic uppercase">Mon Profil</div>;
        default: return <StudentHome />;
      }
    }

    // Si on arrive ici, c'est que le rôle n'est ni teacher ni student
    return (
      <div className="p-20 flex flex-col items-center justify-center border-2 border-red-500/20 rounded-[3rem] bg-red-500/5">
        <p className="text-red-500 font-black uppercase italic text-xl">Accès Refusé</p>
        <p className="text-gray-500 text-sm mt-2">Rôle détecté : <span className="text-white font-mono bg-white/10 px-2 rounded">{role}</span></p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex overflow-x-hidden font-sans">
        
      
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out 
        ${isCollapsed ? "ml-20" : "ml-64"} 
        ${!isMobileOpen ? "max-md:ml-0" : ""}
      `}>
        
        <Header setIsMobileOpen={setIsMobileOpen} userName={userName} />

        <main className="p-6 md:p-10 flex-1 relative z-10">
          {renderContent()}
        </main>
        
      </div>
    </div>
  );
}
