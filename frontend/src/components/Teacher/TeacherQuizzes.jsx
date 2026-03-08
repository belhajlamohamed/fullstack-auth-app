import React ,{useState} from "react";
import { Plus, Search, MoreVertical, Users, Clock, Edit3, Trash2, ExternalLink } from "lucide-react";

import CreateQuizModal from "../modals/CreateQuizModal";

export default function TeacherQuizzes() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const quizzes = [
    { id: 1, title: "Algorithmique Avancée - TD 1", status: "Actif", students: 45, date: "08 Mars 2024" },
    { id: 2, title: "Introduction à React JS", status: "Brouillon", students: 0, date: "05 Mars 2024" },
    { id: 3, title: "Base de données NoSQL", status: "Terminé", students: 120, date: "01 Mars 2024" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-full overflow-x-hidden">
      
      {/* HEADER : Adapté au mobile (Stack vertical sur petit écran) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-white">
            Gestion des <span className="text-[#cbff00]">Quiz</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-medium mt-1 uppercase tracking-wider">
            Créez et suivez vos questionnaires
          </p>
        </div>

            <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#cbff00] text-black w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-tight hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(203,255,0,0.1)]">
            <Plus size={18} strokeWidth={3} />
            Nouveau Quiz
            </button>
        </div>

      {/* BARRE DE RECHERCHE */}
      <div className="relative group w-full">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
        <input 
          type="text" 
          placeholder="Rechercher par nom..." 
          className="w-full bg-[#111114] border border-white/[0.05] rounded-xl py-3 pl-12 pr-4 text-xs outline-none focus:border-[#cbff00]/30 transition-all text-white"
        />
      </div>

      {/* --- VUE MOBILE (Cartes) : visible uniquement sur < 768px --- */}
      <div className="grid gap-4 md:hidden">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-[#111114] border border-white/[0.05] rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-[#cbff00]">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">{quiz.title}</p>
                  <p className="text-[9px] text-gray-500 font-bold mt-1 uppercase">{quiz.date}</p>
                </div>
              </div>
              <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded border ${
                quiz.status === "Actif" ? "text-green-500 border-green-500/20 bg-green-500/5" :
                quiz.status === "Brouillon" ? "text-orange-500 border-orange-500/20 bg-orange-500/5" :
                "text-gray-500 border-white/10 bg-white/5"
              }`}>
                {quiz.status}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.05] pt-4">
              <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold">
                <Users size={14} />
                {quiz.students} PARTICIPANTS
              </div>
              <div className="flex gap-1">
                <button className="p-2 bg-white/5 rounded-lg text-gray-400"><Edit3 size={14} /></button>
                <button className="p-2 bg-white/5 rounded-lg text-gray-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- VUE DESKTOP (Tableau) : visible uniquement sur >= 768px --- */}
      <div className="hidden md:block bg-[#111114] border border-white/[0.05] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/[0.05]">
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Nom</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Statut</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Élèves</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05]">
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-white/[0.01] transition-colors group">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 group-hover:text-[#cbff00] transition-colors">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{quiz.title}</p>
                    <p className="text-[9px] text-gray-600 font-bold uppercase">{quiz.date}</p>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${
                    quiz.status === "Actif" ? "text-green-500 border-green-500/20 bg-green-500/5" :
                    "text-gray-500 border-white/10 bg-white/5"
                  }`}>
                    {quiz.status}
                  </span>
                </td>
                <td className="p-4 text-xs font-bold text-gray-400">
                  {quiz.students}
                </td>
                <td className="p-4 text-right">
                   <div className="flex justify-end gap-2 text-gray-500">
                     <Edit3 size={16} className="hover:text-white cursor-pointer" />
                     <Trash2 size={16} className="hover:text-red-500 cursor-pointer" />
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && <CreateQuizModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}