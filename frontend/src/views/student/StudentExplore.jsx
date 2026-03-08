import React, { useState, useEffect } from "react";
import { Search, Play, BookOpen, User, Clock, Loader2, ArrowUpRight } from "lucide-react";
import api from "../../api/axios";

export default function StudentExplore() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        // Cette route doit retourner tous les quiz de la BDD
        const response = await api.get("/quizzes/all");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllQuizzes();
  }, []);

  // Filtrage dynamique
  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.subject_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-[#cbff00]" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Recherche */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">Explorer les Quiz</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Trouve un sujet et teste tes connaissances</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" size={18} />
          <input 
            type="text"
            placeholder="RECHERCHER UN QUIZ OU UNE MATIÈRE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-white uppercase tracking-widest focus:outline-none focus:border-[#cbff00]/50 focus:ring-1 focus:ring-[#cbff00]/50 transition-all w-full md:w-80"
          />
        </div>
      </div>

      {/* Grille de Quiz */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="bg-[#111114] border border-white/[0.05] rounded-[2.5rem] p-8 hover:border-[#cbff00]/30 transition-all duration-300 group relative overflow-hidden">
              {/* Badge Matière */}
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-[#cbff00]/10 text-[#cbff00] px-3 py-1.5 rounded-lg">
                  {quiz.subject_name || "Général"}
                </span>
                <div className="p-2 bg-white/5 rounded-xl text-gray-500">
                  <BookOpen size={18} />
                </div>
              </div>

              {/* Infos Quiz */}
              <div className="mb-8">
                <h3 className="text-xl font-black text-white uppercase italic leading-tight group-hover:text-[#cbff00] transition-colors">
                  {quiz.title}
                </h3>
                <div className="flex items-center gap-4 mt-3">
                   <div className="flex items-center gap-1.5 text-gray-500">
                      <User size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{quiz.teacher_name || "Professeur"}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{quiz.questions_count || 0} Qs</span>
                   </div>
                </div>
              </div>

              {/* Bouton Action */}
              <button 
                className="w-full bg-white/5 hover:bg-[#cbff00] text-white hover:text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all transform group-active:scale-95"
                onClick={() => console.log("Lancer le quiz:", quiz.id)}
              >
                <Play size={14} fill="currentColor" /> Commencer le Quiz
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">Aucun quiz ne correspond à votre recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}