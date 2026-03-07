import React, { useState } from "react";
import { Timer, ArrowRight, ArrowLeft, Flag, CheckCircle2 } from "lucide-react";

export default function QuizInterface() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0a0c] flex flex-col font-sans text-white overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#673ee5]/10 blur-[150px] rounded-full pointer-events-none" />

      <header className="h-24 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-8 md:px-16 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">Temps Restant</span>
            <div className="flex items-center gap-3">
              <Timer className="text-[#cbff00]" size={20} />
              <span className="text-2xl font-black italic tracking-tighter tabular-nums text-white">08:45</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Progression</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((s, i) => (
              <div key={i} className={`h-1.5 w-10 rounded-full transition-all ${i === 2 ? 'bg-[#cbff00]' : i < 2 ? 'bg-[#673ee5]' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
          <Flag size={14} /> Abandonner
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-3xl space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#673ee5] bg-[#673ee5]/10 px-6 py-2 rounded-full border border-[#673ee5]/20">Question 03 / 15</span>
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight">
              Quel algorithme est utilisé pour le rendu des ombres en Ray Tracing ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              "L'algorithme de Dijkstra",
              "Le lancer de rayons (Ray Casting)",
              "L'ombrage de Phong",
              "La rastérisation classique"
            ].map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`group relative p-8 rounded-[2.5rem] border-2 transition-all text-left flex items-center justify-between ${
                  selected === i 
                  ? "bg-gradient-to-r from-[#cbff00]/20 to-transparent border-[#cbff00] shadow-[0_0_40px_rgba(203,255,0,0.1)]" 
                  : "bg-white/[0.03] border-white/5 hover:border-white/20"
                }`}
              >
                <span className={`text-sm font-black uppercase tracking-tight ${selected === i ? "text-[#cbff00]" : "text-gray-400"}`}>
                  {opt}
                </span>
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                  selected === i ? "bg-[#cbff00] border-[#cbff00]" : "border-gray-800"
                }`}>
                  {selected === i && <CheckCircle2 size={18} className="text-black" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="h-28 border-t border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-8 md:px-16 relative z-10">
        <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-all">
          <ArrowLeft size={20} /> Précédent
        </button>

        <button className="bg-gradient-to-r from-[#cbff00] to-green-400 text-black px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#cbff00]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
          Question Suivante <ArrowRight size={20} />
        </button>
      </footer>
    </div>
  );
}