// src/views/student/StudentHome.jsx
import React, { useState, useEffect } from "react";
import { BookOpen, Award, Zap, Activity, Loader2, ArrowUpRight, Play } from "lucide-react";
import api from "../../api/axios";

// On réutilise le même design de carte que pour le Teacher pour garder l'unité visuelle
const StatCard = ({ title, value, icon, loading }) => (
  <div className="bg-[#111114] border border-white/[0.05] p-6 rounded-[2rem] hover:border-[#cbff00]/20 transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl bg-white/5 text-[#cbff00] group-hover:bg-[#cbff00] group-hover:text-black transition-all">
        {React.cloneElement(icon, { size: 20 })}
      </div>
    </div>
    <div>
      <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{title}</h3>
      <p className="text-3xl font-black tracking-tight text-white italic">
        {loading ? <span className="animate-pulse">...</span> : value}
      </p>
    </div>
  </div>
);

export default function StudentHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentStats = async () => {
      try {
        // APPEL À L'API ÉTUDIANT (Différente de celle du teacher)
        const response = await api.get("/students/stats/summary");
        setStats(response.data);
      } catch (error) {
        console.error("Erreur stats étudiant:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER ÉTUDIANT */}
      <div>
        <h1 className="text-2xl font-black text-white uppercase italic tracking-tight">Mon Espace</h1>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Tes performances et ton activité</p>
      </div>

      {/* STATS ÉTUDIANT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Quiz Terminés" value={stats?.completed || 0} icon={<BookOpen />} loading={loading} />
        <StatCard title="Score Moyen" value={`${stats?.avg_score || 0}%`} icon={<Award />} loading={loading} />
        <StatCard title="Points Totaux" value={stats?.points || 0} icon={<Zap />} loading={loading} />
      </div>

      {/* BANNIÈRE D'ACTION (Spécifique à l'élève) */}
      <div className="bg-[#cbff00] rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-black uppercase italic tracking-tighter">Prêt pour un défi ?</h2>
          <p className="text-black/60 font-bold text-xs uppercase mt-2 tracking-wide">Découvre les nouveaux quiz de tes professeurs</p>
        </div>
        <button className="relative z-10 bg-black text-[#cbff00] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:scale-105 transition-all shadow-xl">
          Explorer les quiz <ArrowUpRight size={18} />
        </button>
        {/* Déco abstraite */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </div>
    </div>
  );
}