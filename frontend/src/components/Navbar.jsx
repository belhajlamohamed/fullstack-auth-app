import React from "react";
import { Home, Layout, Plus, BarChart3, User } from "lucide-react";

export default function Navbar({ activeView, setActiveView }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-[#0a0a0c]/80 backdrop-blur-xl border-t border-white/10 px-6 py-3 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-lg mx-auto flex items-center justify-between relative">
        
        {/* HOME */}
        <button 
          onClick={() => setActiveView("home")}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === "home" ? "text-[#cbff00]" : "text-gray-500"}`}
        >
          <Home size={22} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Home</span>
        </button>

        {/* QUIZ */}
        <button 
          onClick={() => setActiveView("quiz")}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === "quiz" ? "text-[#cbff00]" : "text-gray-500"}`}
        >
          <Layout size={22} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Quiz</span>
        </button>

        {/* BOUTON CENTRAL (+) */}
        <div className="relative -top-10">
          <button 
            onClick={() => setActiveView("create")}
            className="bg-[#cbff00] text-black p-4 rounded-[1.5rem] shadow-[0_0_25px_rgba(203,255,0,0.3)] active:scale-90 transition-all border-[6px] border-[#0a0a0c]"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        {/* STATS */}
        <button 
          onClick={() => setActiveView("stats")}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === "stats" ? "text-[#cbff00]" : "text-gray-500"}`}
        >
          <BarChart3 size={22} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Stats</span>
        </button>

        {/* PROFIL */}
        <button 
          onClick={() => setActiveView("profile")}
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${activeView === "profile" ? "text-[#cbff00]" : "text-gray-500"}`}
        >
          <User size={22} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Profil</span>
        </button>

      </div>
    </nav>
  );
}