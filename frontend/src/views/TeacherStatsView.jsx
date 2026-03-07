import React from "react";
import { BarChart3, TrendingUp, Users, Target, Zap } from "lucide-react";

export default function TeacherStatsView() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans pb-10">
      <div className="flex items-center gap-4 border-l-4 border-[#673ee5] pl-4">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Analyse de Performance</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Taux Réussite", val: "84%", color: "text-[#cbff00]", icon: Target },
          { label: "Participation", val: "92%", color: "text-blue-400", icon: Zap },
          { label: "Moyenne G.", val: "15.8", color: "text-purple-400", icon: TrendingUp },
          { label: "Quiz Totaux", val: "48", color: "text-white", icon: BarChart3 },
        ].map((item, i) => (
          <div key={i} className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 space-y-4">
            <item.icon className={item.color} size={24} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</p>
              <p className="text-3xl font-black text-white mt-1">{item.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 space-y-8">
          <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Activité Hebdomadaire</h3>
          <div className="flex items-end justify-between h-48 gap-4 px-2">
            {[40, 70, 45, 95, 65, 80, 50].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full bg-white/5 rounded-2xl group-hover:bg-gradient-to-t group-hover:from-[#673ee5] group-hover:to-[#cbff00] transition-all duration-500 relative min-h-[10px]" style={{ height: `${h}%` }}>
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-2 py-1 rounded-lg uppercase transition-all">
                    {h}%
                  </div>
                </div>
                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-10">
          <h3 className="text-lg font-black uppercase italic tracking-tighter text-white mb-8">Top Performer</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#121214] flex items-center justify-center font-black text-[#cbff00] border border-white/5 italic">
                  #{i+1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-white">Étudiant {i+1}</span>
                    <span className="text-[#cbff00]">19.0/20</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#673ee5] rounded-full" style={{ width: `${95 - (i*10)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}