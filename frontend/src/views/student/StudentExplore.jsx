import React, { useState, useEffect } from "react";
import { Search, Play, BookOpen, User, Clock, Loader2, Sparkles } from "lucide-react";
import api from "../../api/axios";
import QuizPlay from "./QuizPlay";

export default function StudentExplore() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // ÉTATS POUR LE MODAL
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [isPlayModalOpen, setIsPlayModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        const response = await api.get("/quizzes/all");
        console.log(response.data)
        setQuizzes(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllQuizzes();
  }, []);

  const handleOpenQuiz = (id) => {
    console.log("Lancement du quiz ID:", id);
    setActiveQuizId(id);
    setIsPlayModalOpen(true);
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-[#cbff00]" size={40} />
    </div>
  );

  return (
    /* Conteneur relatif pour servir de base au modal si nécessaire */
    <div className="relative space-y-10 animate-in fade-in duration-500 pb-10">
      
      {/* Header & Barre de Recherche */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
            Explorer <Sparkles size={20} className="text-[#cbff00]" />
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Teste tes compétences en temps réel
          </p>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" size={18} />
          <input 
            type="text"
            placeholder="RECHERCHER UN QUIZ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#111114] border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-[10px] font-bold text-white uppercase tracking-widest focus:outline-none focus:border-[#cbff00]/50 transition-all w-full"
          />
        </div>
      </div>

      {/* Grille de Quiz - 3 Colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className="bg-[#111114] border border-white/[0.05] rounded-[2.5rem] p-8 hover:border-[#cbff00]/30 transition-all duration-300 group flex flex-col justify-between min-h-[320px] shadow-xl"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl text-gray-500 group-hover:text-[#cbff00] transition-colors">
                    <BookOpen size={22} />
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-[9px] font-black uppercase tracking-widest">
                    <Clock size={12} />
                    <span>{quiz.question_count || 0} Questions</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-black text-white uppercase italic leading-tight group-hover:text-[#cbff00] transition-colors line-clamp-2">
                    {quiz.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-3 text-gray-600">
                    <User size={12} />
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em]">
                      {quiz.teacher_name || "Enseignant SKYQUIZ"}
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleOpenQuiz(quiz.id)}
                className="w-full bg-white/5 hover:bg-[#cbff00] text-white hover:text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg"
              >
                <Play size={14} fill="currentColor" /> Commencer le quiz
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem]">
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">
              Aucun quiz disponible pour cette recherche
            </p>
          </div>
        )}
      </div>

      {/* IMPORTANT: Le Modal est rendu à la fin du flux 
          pour garantir qu'il est au-dessus du reste.
      */}
      {isPlayModalOpen && (
        <QuizPlay 
          quizId={activeQuizId} 
          onClose={() => setIsPlayModalOpen(false)} 
        />
      )}
    </div>
  );
}