import React, { useState, useEffect } from "react";
import { Users, FileText, CheckCircle, TrendingUp, ArrowUpRight, Calendar, Loader2 } from "lucide-react";
import api from "../../api/axios"; // Ton instance configurée

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-[#111114] border border-white/[0.05] p-5 rounded-xl hover:border-[#cbff00]/20 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-white/5 text-[#cbff00]">
        {React.cloneElement(icon, { size: 18 })}
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">{title}</h3>
      <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
    </div>
  </div>
);

export default function TeacherHome() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // On récupère tes quiz (le backend triera par date si configuré)
        const response = await api.get("/quizzes/my-quizzes");
        setQuizzes(response.data);
      } catch (error) {
        console.error("Erreur de chargement home:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // On ne prend que les 3 derniers pour l'affichage "Récent"
  const recentQuizzes = quizzes.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase italic">Tableau de bord</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Vue d'ensemble de votre activité</p>
        </div>
      </div>

      {/* STATS DYNAMIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Quiz Créés" 
          value={loading ? "..." : quizzes.length} 
          icon={<FileText size={24} />} 
          trend="+12%" 
        />
        <StatCard title="Étudiants" value="450" icon={<Users size={24} />} trend="+5%" />
        <StatCard title="Complétés" value="1,2k" icon={<CheckCircle size={24} />} trend="+18%" />
        <StatCard title="Score Moyen" value="76%" icon={<TrendingUp size={24} />} trend="+2%" />
      </div>

      {/* SECTION RÉCENTE DYNAMIQUE */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black italic uppercase">Vos derniers quiz</h2>
          <button className="text-[10px] font-bold uppercase text-[#cbff00] flex items-center gap-1 hover:underline">
            Voir tout <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#cbff00]" /></div>
          ) : recentQuizzes.length > 0 ? (
            recentQuizzes.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 group-hover:bg-[#cbff00] rounded-xl flex items-center justify-center text-gray-500 group-hover:text-black transition-all">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold uppercase text-sm text-white">{quiz.title}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      ID Sujet: {quiz.subject_id} • {quiz.questions?.length || 0} Questions
                    </p>
                  </div>
                </div>
                <div className="p-2 bg-white/5 rounded-lg text-gray-500 group-hover:text-white">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-[10px] font-bold uppercase text-center py-10">Aucun quiz créé pour le moment</p>
          )}
        </div>
      </div>
    </div>
  );
}