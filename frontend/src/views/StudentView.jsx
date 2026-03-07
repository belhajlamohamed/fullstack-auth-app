import React from "react";
import { Play, Trophy, Clock, Star, ArrowRight, Zap } from "lucide-react";

export default function StudentView() {
  const quizzes = [
    { title: "Neuroscience", sub: "Biologie", q: 20, time: "15m", color: "from-blue-600 to-cyan-400" },
    { title: "React Design", sub: "Frontend", q: 10, time: "10m", color: "from-[#cbff00] to-green-400" },
    { title: "Cyber Security", sub: "IT Security", q: 15, time: "20m", color: "from-purple-600 to-pink-500" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 font-sans pb-10">
      <div className="relative overflow-hidden rounded-[3.5rem] bg-gradient-to-br from-[#673ee5]/20 to-transparent border border-white/10 p-10 md:p-16">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#cbff00]/10 blur-[100px] rounded-full" />
        <div className="relative z-10 space-y-6">
          <span className="bg-[#cbff00] text-black text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg shadow-[#cbff00]/20">
            Niveau 12
          </span>
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
            EXPLORE TON <br/><span className="text-[#cbff00]">POTENTIEL.</span>
          </h2>
          <p className="text-gray-400 max-w-md font-medium text-lg leading-relaxed">
            3 nouveaux quiz ont été publiés par tes professeurs. Relève le défi maintenant.
          </p>
          <button className="bg-white text-black px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-[#cbff00] transition-all flex items-center gap-3 group shadow-2xl">
            Voir mes cours <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizzes.map((quiz, i) => (
          <div key={i} className="group relative backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-1 overflow-hidden transition-all hover:border-white/20">
            <div className="bg-[#0a0a0c] rounded-[2.8rem] p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${quiz.color} flex items-center justify-center text-black shadow-lg shadow-black/20`}>
                  <Zap size={24} fill="currentColor" />
                </div>
                <div className="flex items-center gap-1 text-[#cbff00]">
                  <Star size={12} fill="currentColor" />
                  <span className="text-[10px] font-black">Xp +500</span>
                </div>
              </div>

              <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase group-hover:text-[#cbff00] transition-colors">
                {quiz.title}
              </h4>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">{quiz.sub}</p>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-4 text-gray-600 text-[10px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Trophy size={14}/> {quiz.q}Q</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {quiz.time}</span>
                </div>
                <button className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${quiz.color} flex items-center justify-center text-black hover:scale-110 transition-all shadow-xl`}>
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}