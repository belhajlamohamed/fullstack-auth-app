import React from "react";
import { User, Search, MoreHorizontal, Mail, ExternalLink } from "lucide-react";

export default function StudentsListView() {
  const students = [
    { id: 1, name: "Amine Bennani", email: "amine@univ.ma", status: "Actif", score: "18.5" },
    { id: 2, name: "Sarah Lemoine", email: "sarah.l@gmail.com", status: "Inactif", score: "14.2" },
    { id: 3, name: "Marc Dupont", email: "m.dupont@ecole.fr", status: "Actif", score: "16.8" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Étudiants</h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Gestion de la promotion</p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
          <input 
            type="text" 
            placeholder="RECHERCHER..." 
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] transition-all text-xs font-black tracking-widest text-white"
          />
        </div>
      </div>

      <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                <th className="p-8">Profil</th>
                <th>Statut</th>
                <th>Score Moyen</th>
                <th className="p-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((s) => (
                <tr key={s.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#673ee5] to-purple-900 flex items-center justify-center font-black text-white text-lg">
                        {s.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-white italic text-base group-hover:text-[#cbff00] transition-colors">{s.name}</p>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      s.status === 'Actif' ? 'bg-[#cbff00]/10 text-[#cbff00] border border-[#cbff00]/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="font-black text-white italic text-lg tracking-tighter">
                    {s.score}<span className="text-[10px] text-gray-600 ml-1">/20</span>
                  </td>
                  <td className="p-8 text-right">
                    <button className="p-3 bg-white/5 rounded-xl text-gray-500 hover:text-[#cbff00] hover:bg-[#cbff00]/10 transition-all">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}