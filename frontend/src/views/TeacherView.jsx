import React, { useState, useEffect } from "react";
import { 
  PlusCircle, BookOpen, Users, CheckCircle 
} from "lucide-react";
import api from "../api/axios"; 

export default function TeacherView({ onOpenCreateModal }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get("/quizzes/my-quizzes");
      // Sécurité anti-crash pour subject_id null
      const validQuizzes = response.data.filter(q => q.subject_id !== null);
      setQuizzes(validQuizzes);
    } catch (err) {
      console.error("Erreur détaillée:", err.response?.data);
      if (err.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white uppercase italic">
            Dashboard <span className="text-[#cbff00]">Formateur</span>
          </h2>
          <p className="text-gray-400">Gérez vos quiz et suivez la progression de vos étudiants.</p>
        </div>
        
        <button 
          onClick={onOpenCreateModal}
          className="bg-[#cbff00] text-black font-bold px-6 py-4 rounded-2xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(203,255,0,0.4)] transition-all active:scale-95 group"
        >
          <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
          Nouveau Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Quiz Créés" value={quizzes.length} icon={<BookOpen size={20}/>} color="text-[#cbff00]" />
        <StatCard title="Étudiants" value="124" icon={<Users size={20}/>} color="text-purple-400" />
        <StatCard title="Moyenne" value="78%" icon={<CheckCircle size={20}/>} color="text-blue-400" />
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold mb-6 text-white italic uppercase tracking-wider">Mes Quiz récents</h3>
        {loading ? (
          <div className="text-center py-20 text-gray-500">Chargement des quiz...</div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-[#cbff00]/50 transition-colors group">
                <h4 className="text-lg font-bold mb-2 text-white group-hover:text-[#cbff00] transition-colors">{quiz.title}</h4>
                <p className="text-sm text-gray-400 mb-4">{quiz.description || "Pas de description"}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono uppercase">
                   <span className="bg-white/5 px-2 py-1 rounded">ID: {quiz.id}</span>
                   <span className="bg-white/5 px-2 py-1 rounded">Sujet: {quiz.subject_id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-16 text-center">
            <p className="text-gray-500 italic">Aucun quiz trouvé. Cliquez sur "Nouveau Quiz" pour commencer.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-5">
      <div className={`p-4 bg-black/40 rounded-2xl ${color} border border-white/5`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-black text-white mt-1">{value}</p>
      </div>
    </div>
  );
}