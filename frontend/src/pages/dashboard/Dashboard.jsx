import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Menu } from "lucide-react";
import Header from "../../components/Header";

export default function App() {
  // États de contrôle
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState("home");

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex overflow-hidden">
      
      {/* APPEL DU SIDEBAR */}
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* ZONE DE CONTENU PRINCIPALE */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        
        {/* HEADER DE TEST (Pour le bouton Burger mobile) */}
       <Header setIsMobileOpen={setIsMobileOpen} userName="Abdel" />

        {/* MAIN DE TEST */}
        <main className="p-10">
          <div className="border-2 border-dashed border-white/10 rounded-[3rem] h-[60vh] flex flex-col items-center justify-center">
            <h1 className="text-4xl font-black italic text-white mb-4">
              VUE : <span className="text-[#cbff00]">{activeView.toUpperCase()}</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">
              {isCollapsed ? "Sidebar Réduit" : "Sidebar Large"}
            </p>
          </div>
        </main>

      </div>
    </div>
  );
}

