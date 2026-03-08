import React, { useState, useEffect } from "react";
import { Users, FileText, CheckCircle, TrendingUp, ArrowUpRight, BookOpen, GraduationCap, Activity, Loader2 } from "lucide-react";
import api from "../../api/axios";

// Composant interne pour les cartes de statistiques
const StatCard = ({ title, value, icon, trend, loading }) => (
  <div className="bg-[#111114] border border-white/[0.05] p-6 rounded-[2rem] hover:border-[#cbff00]/20 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl bg-white/5 text-[#cbff00] group-hover:bg-[#cbff00] group-hover:text-black transition-all">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      {trend && !loading && (
        <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{title}</h3>
      <p className="text-3xl font-black tracking-tight text-white italic">
        {loading ? <span className="animate-pulse">...</span> : value}
      </p>
    </div>
  </div>
);

export default function TeacherHome() {
  const [stats, setStats] = useState(null);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // On récupère les stats et la liste des quiz en parallèle
        const [statsRes, quizzesRes] = await Promise.all([
          api.get("/teachers/stats/summary"),
          api.get("/quizzes/my-quizzes") // Assure-toi que cette route existe
        ]);
        
        setStats(statsRes.data);
        // On ne garde que les 3 derniers quiz pour la page d'accueil
        setRecentQuizzes(quizzesRes.data.slice(0, 3));
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">Tableau de bord</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Vue d'ensemble de votre activité</p>
        </div>
      </div>

      {/* STATS DYNAMIQUES (Étape 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Quiz" 
          value={stats?.total_quizzes || 0} 
          icon={<BookOpen />} 
          loading={loading}
          trend="+2"
        />
        <StatCard 
          title="Participations" 
          value={stats?.total_students || 0} 
          icon={<Users />} 
          loading={loading}
          trend="+12%"
        />
        <StatCard 
          title="Score Moyen" 
          value={`${stats?.average_score || 0}%`} 
          icon={<GraduationCap />} 
          loading={loading}
        />
        <StatCard 
          title="En Direct" 
          value={stats?.active_now || 0} 
          icon={<Activity />} 
          loading={loading}
        />
      </div>

      {/* SECTION RÉCENTE DYNAMIQUE */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
        {/* Effet de brillance en arrière-plan */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#cbff00]/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Vos derniers quiz</h2>
          <button className="text-[10px] font-bold uppercase text-[#cbff00] flex items-center gap-2 hover:opacity-70 transition-all border border-[#cbff00]/20 px-4 py-2 rounded-full">
            Voir tout <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#cbff00]" size={32} />
            </div>
          ) : recentQuizzes.length > 0 ? (
            recentQuizzes.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-5 bg-white/[0.03] rounded-[2rem] border border-white/5 hover:border-[#cbff00]/30 hover:bg-white/[0.06] transition-all cursor-pointer group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/5 group-hover:bg-[#cbff00] rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-black transition-all shadow-inner">
                    <FileText size={22} />
                  </div>
                  <div>
                    <p className="font-black uppercase text-sm text-white italic tracking-wide group-hover:text-[#cbff00] transition-colors">
                      {quiz.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] text-[#cbff00] font-black uppercase tracking-widest bg-[#cbff00]/10 px-2 py-0.5 rounded-md">
                        {quiz.subject_name || "Matière"}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        • {quiz.questions?.length || 0} Questions
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-600 group-hover:text-[#cbff00] group-hover:bg-[#cbff00]/10 transition-all">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white/[0.01] rounded-[2rem] border border-dashed border-white/10">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">Aucun quiz créé pour le moment</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// import React, { useState, useEffect } from "react";
// import { Users, FileText, CheckCircle, TrendingUp, ArrowUpRight, Calendar, Loader2 } from "lucide-react";
// import api from "../../api/axios"; // Ton instance configurée

// const StatCard = ({ title, value, icon, trend }) => (
//   <div className="bg-[#111114] border border-white/[0.05] p-5 rounded-xl hover:border-[#cbff00]/20 transition-all duration-300 group">
//     <div className="flex justify-between items-start mb-4">
//       <div className="p-2 rounded-lg bg-white/5 text-[#cbff00]">
//         {React.cloneElement(icon, { size: 18 })}
//       </div>
//       {trend && (
//         <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">
//           {trend}
//         </span>
//       )}
//     </div>
//     <div>
//       <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">{title}</h3>
//       <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
//     </div>
//   </div>
// );

// export default function TeacherHome() {
//   // const [quizzes, setQuizzes] = useState([]);
  

//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await api.get("/quizzes/stats/summary");
//         setStats(response.data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des stats", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);
//     if (loading) return (
//         <div className="flex h-64 items-center justify-center">
//           <Loader2 className="animate-spin text-[#cbff00]" size={40} />
//         </div>
//       );

//     const statCards = [
//     { label: "Total Quiz", value: stats?.total_quizzes, icon: <BookOpen />, color: "blue" },
//     { label: "Participations", value: stats?.total_students, icon: <Users />, color: "green" },
//     { label: "Score Moyen", value: `${stats?.average_score}%`, icon: <GraduationCap />, color: "yellow" },
//     { label: "En direct", value: stats?.active_now, icon: <Activity />, color: "red" },
//   ];

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       <div className="flex justify-between items-end">
//         <div>
//           <h1 className="text-2xl font-bold text-white uppercase italic">Tableau de bord</h1>
//           <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Vue d'ensemble de votre activité</p>
//         </div>
//       </div>

//       {/* STATS DYNAMIQUES */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard 
//           title="Quiz Créés" 
//           value={loading ? "..." : quizzes.length} 
//           icon={<FileText size={24} />} 
//           trend="+12%" 
//         />
//         <StatCard title="Étudiants" value="450" icon={<Users size={24} />} trend="+5%" />
//         <StatCard title="Complétés" value="1,2k" icon={<CheckCircle size={24} />} trend="+18%" />
//         <StatCard title="Score Moyen" value="76%" icon={<TrendingUp size={24} />} trend="+2%" />
//       </div>

//       {/* SECTION RÉCENTE DYNAMIQUE */}
//       <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-black italic uppercase">Vos derniers quiz</h2>
//           <button className="text-[10px] font-bold uppercase text-[#cbff00] flex items-center gap-1 hover:underline">
//             Voir tout <ArrowUpRight size={14} />
//           </button>
//         </div>

//         <div className="space-y-4">
//           {loading ? (
//             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#cbff00]" /></div>
//           ) : recentQuizzes.length > 0 ? (
//             recentQuizzes.map((quiz) => (
//               <div key={quiz.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/[0.08] transition-colors cursor-pointer group">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-white/5 group-hover:bg-[#cbff00] rounded-xl flex items-center justify-center text-gray-500 group-hover:text-black transition-all">
//                     <FileText size={20} />
//                   </div>
//                   <div>
//                     <p className="font-bold uppercase text-sm text-white">{quiz.title}</p>
//                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
//                       ID Sujet: {quiz.subject_id} • {quiz.questions?.length || 0} Questions
//                     </p>
//                   </div>
//                 </div>
//                 <div className="p-2 bg-white/5 rounded-lg text-gray-500 group-hover:text-white">
//                   <ArrowUpRight size={18} />
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600 text-[10px] font-bold uppercase text-center py-10">Aucun quiz créé pour le moment</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }