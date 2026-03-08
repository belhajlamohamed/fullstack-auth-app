import React from "react";
import { Play, Trophy, Clock, Star } from "lucide-react";

export default function StudentHome() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Espace <span className="text-[#cbff00]">Étudiant</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Prêt pour ton prochain défi ?</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
             <Trophy size={18} className="text-[#cbff00]" />
             <span className="font-black italic">1,250 XP</span>
          </div>
        </div>
      </div>

      {/* CARD PRINCIPALE - PROCHAIN QUIZ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#cbff00] to-[#9ecb00] p-1 rounded-[3rem]">
        <div className="bg-[#0a0a0c] rounded-[2.9rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <span className="bg-[#cbff00]/10 text-[#cbff00] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#cbff00]/20">
              Recommandé pour toi
            </span>
            <h2 className="text-4xl font-black italic uppercase leading-none">Intelligence <br/> Artificielle 101</h2>
            <p className="text-gray-400 max-w-sm">Teste tes connaissances sur les bases du Machine Learning et des réseaux de neurones.</p>
            <button className="bg-[#cbff00] text-black px-8 py-4 rounded-2xl font-black uppercase italic tracking-tighter hover:scale-105 transition-transform flex items-center gap-3 mx-auto md:mx-0">
              <Play size={20} fill="currentColor" /> Commencer le quiz
            </button>
          </div>
          <div className="hidden lg:block w-48 h-48 bg-[#cbff00]/10 rounded-full blur-3xl absolute -right-10 -top-10"></div>
        </div>
      </div>

      {/* GRILLE SECONDAIRE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-blue-400" size={20} />
            <h3 className="font-black uppercase italic">Quiz récents</h3>
          </div>
          <div className="text-gray-500 text-center py-10 border border-dashed border-white/10 rounded-3xl">
            Aucun historique récent
          </div>
        </div>
        
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Star className="text-orange-400" size={20} />
            <h3 className="font-black uppercase italic">Badges obtenus</h3>
          </div>
          <div className="flex gap-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 cursor-help transition-all">
                  🏅
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}