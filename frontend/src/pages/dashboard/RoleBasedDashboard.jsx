import React, { useState, useEffect } from "react";

// Imports des composants de structure
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Header from "./Header";

export default function RoleBasedDashboard() {
  const [activeView, setActiveView] = useState("home");
  const [userName, setUserName] = useState("Utilisateur");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white relative flex">
      
      {/* SIDEBAR : Fixe à gauche sur Desktop, caché sur Mobile */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* ZONE PRINCIPALE : Se décale si le Sidebar est présent (md:ml-64) */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        
        {/* HEADER : Toujours en haut */}
        <Header userName={userName} handleLogout={handleLogout} />

        {/* MAIN : Vide pour le moment, prêt pour tes futurs composants */}
        <main className="relative z-10 p-6 pb-32 md:pb-10">
          <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-20 flex flex-col items-center justify-center text-gray-500">
            <p className="font-black uppercase tracking-widest text-sm">Vue Actuelle : {activeView}</p>
            <p className="text-[10px] mt-2 italic">Le contenu de Main.jsx s'affichera ici.</p>
          </div>
        </main>
      </div>

      {/* NAVBAR : Fixe en bas sur Mobile, cachée sur Desktop */}
      <Navbar activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
}