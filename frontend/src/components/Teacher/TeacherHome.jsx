import React from "react";
import { Users, FileText, CheckCircle, TrendingUp, ArrowUpRight, Calendar } from "lucide-react";

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-[#111114] border border-white/[0.05] p-5 rounded-xl hover:border-[#cbff00]/20 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-white/5 text-[#cbff00]">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
        {trend}
      </span>
    </div>
    <div>
      <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold tracking-tight text-white">
        {value}
      </p>
    </div>
  </div>
);

export default function TeacherHome() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header simplifié */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-white">
            Tableau de bord <span className="text-[#cbff00]">Enseignant</span>
          </h1>
          <p className="text-gray-500 text-[11px] font-medium mt-1">
            Statistiques de vos classes en temps réel
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase border border-white/5 px-3 py-1.5 rounded-lg bg-white/5">
          <Calendar size={12} />
          Mars 2024
        </div>
      </div>

      {/* Grille de Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Élèves inscrits" value="128" trend="+12%" icon={<Users />} />
        <StatCard title="Quiz créés" value="24" trend="+3" icon={<FileText />} />
        <StatCard title="Sessions terminées" value="1,450" trend="+8%" icon={<CheckCircle />} />
        <StatCard title="Moyenne générale" value="82%" trend="+5%" icon={<TrendingUp />} />
      </div>

      {/* Liste des Quiz - Style Liste de fichiers */}
      <div className="bg-[#111114] border border-white/[0.05] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-white">
            Quiz récents
          </h2>
          <button className="text-[10px] font-bold text-[#cbff00] hover:underline">
            Voir tout
          </button>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400 group-hover:text-[#cbff00] border border-white/5">
                  0{i}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Développement Web - Examen Final</p>
                  <p className="text-[10px] text-gray-500 font-medium">Créé il y a 2 jours • 32 élèves</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:block text-[9px] font-bold uppercase text-gray-600 bg-white/5 px-2 py-1 rounded">Actif</span>
                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// import React from "react";
// import { Users, FileText, CheckCircle, TrendingUp, ArrowUpRight } from "lucide-react";

// // Sous-composant pour les cartes de statistiques
// const StatCard = ({ title, value, icon, trend }) => (
//   <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl hover:bg-white/[0.05] hover:border-[#cbff00]/20 transition-all duration-300 group">
//     <div className="flex justify-between items-start mb-3">
//       <div className="p-2.5 rounded-xl bg-[#cbff00]/10 text-[#cbff00] group-hover:scale-105 transition-transform duration-300">
//         {React.cloneElement(icon, { size: 18 })}
//       </div>
//       <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
//         <ArrowUpRight size={10} />
//         {trend}
//       </div>
//     </div>
//     <div>
//       <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">
//         {title}
//       </h3>
//       <p className="text-2xl font-black tracking-tight text-white italic">
//         {value}
//       </p>
//     </div>
//   </div>
// );

// export default function TeacherHome() {
//   return (
//     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
//       {/* Header de section */}
//       <div className="flex flex-col gap-1">
//         <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
//           Dashboard <span className="text-[#cbff00]">Enseignant</span>
//         </h1>
//         <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
//           Vue d'ensemble des performances
//         </p>
//       </div>

//       {/* Grille de Stats : On diminue le gap et on affine les cartes */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard title="Total Élèves" value="128" trend="+12%" icon={<Users />} />
//         <StatCard title="Quiz Créés" value="24" trend="+3" icon={<FileText />} />
//         <StatCard title="Complétés" value="1,450" trend="+8%" icon={<CheckCircle />} />
//         <StatCard title="Score Moyen" value="82%" trend="+5%" icon={<TrendingUp />} />
//       </div>

//       {/* Section Liste : Plus compacte */}
//       <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-sm font-black italic uppercase tracking-wider flex items-center gap-2">
//             <span className="w-1.5 h-1.5 bg-[#cbff00] rounded-full shadow-[0_0_8px_#cbff00]"></span>
//             Derniers Quiz Activés
//           </h2>
//           <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#cbff00] transition-colors">
//             Voir tout
//           </button>
//         </div>

//         <div className="grid gap-3">
//           {[1, 2].map((i) => (
//             <div key={i} className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 transition-all group">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 bg-black border border-white/5 rounded-lg flex items-center justify-center text-[#cbff00] font-black text-xs italic group-hover:border-[#cbff00]/30 transition-all">
//                   Q{i}
//                 </div>
//                 <div>
//                   <p className="font-bold text-xs uppercase tracking-tight text-white/90">
//                     Algorithmique Avancée - TD {i}
//                   </p>
//                   <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">
//                     45 Participants • <span className="text-gray-500">Il y a 2h</span>
//                   </p>
//                 </div>
//               </div>
//               <button className="h-8 px-4 bg-white/5 hover:bg-[#cbff00] hover:text-black rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
//                 Détails
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// import React from "react";
// import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";

// const StatCard = ({ title, value, icon, color }) => (
//   <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] hover:border-[#cbff00]/30 transition-all group">
//     <div className="flex justify-between items-start mb-4">
//       <div className={`p-3 rounded-2xl bg-white/5 text-[#cbff00] group-hover:scale-110 transition-transform`}>
//         {icon}
//       </div>
//       <TrendingUp size={16} className="text-green-500 opacity-50" />
//     </div>
//     <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest">{title}</h3>
//     <p className="text-3xl font-black italic mt-1">{value}</p>
//   </div>
// );

// export default function TeacherHome() {
//   return (
//     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//       <div>
//         <h1 className="text-3xl font-black italic uppercase tracking-tighter">
//           Dashboard <span className="text-[#cbff00]">Enseignant</span>
//         </h1>
//         <p className="text-gray-500 text-sm font-medium mt-1">Bon retour, voici vos performances actuelles.</p>
//       </div>

//       {/* GRILLE DE STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="Total Élèves" value="128" icon={<Users size={24} />} />
//         <StatCard title="Quiz Créés" value="24" icon={<FileText size={24} />} />
//         <StatCard title="Complétés" value="1,450" icon={<CheckCircle size={24} />} />
//         <StatCard title="Score Moyen" value="82%" icon={<TrendingUp size={24} />} />
//       </div>

//       {/* SECTION RÉCENTE (Placeholder) */}
//       <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8">
//         <h2 className="text-xl font-black italic uppercase mb-6">Derniers Quiz Activés</h2>
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-colors cursor-pointer">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-[#cbff00] rounded-xl flex items-center justify-center text-black font-black italic">Q{i}</div>
//                 <div>
//                   <p className="font-bold uppercase text-sm">Algorithmique Avancée - TD {i}</p>
//                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">45 Participants • Il y a 2h</p>
//                 </div>
//               </div>
//               <button className="text-[#cbff00] text-xs font-black uppercase tracking-widest hover:underline">Voir détails</button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }