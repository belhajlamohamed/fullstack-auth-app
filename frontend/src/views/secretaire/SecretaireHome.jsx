import React, { useState, useEffect } from "react";
import { 
  Users, UserCheck, Clock, Search, Loader2, ShieldCheck, Mail, GraduationCap, School, CheckCircle2 
} from "lucide-react";
import api from "../../api/axios";

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

const SecretaireHome = () => {
  // AJOUT de totalTeachers dans le state initial
  const [stats, setStats] = useState({ 
    totalStudents: 0, 
    totalTeachers: 0, 
    pendingValidation: 0, 
    activeStudents: 0 
  });
  
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get("/secretaire/secretaire-stats"),
        api.get("/secretaire/pending-requests")
      ]);
      setStats(statsRes.data);
      setPendingUsers(pendingRes.data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (userId) => {
    setProcessingId(userId);
    try {
      await api.post(`/secretaire/validate-user/${userId}`);
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      
      // Rafraîchir les compteurs après validation
      const statsRes = await api.get("/secretaire/secretaire-stats");
      setStats(statsRes.data);
    } catch (error) {
      alert("Erreur: " + (error.response?.data?.detail || "Impossible de valider"));
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = pendingUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
            Dashboard <span className="text-[#cbff00] text-sm not-italic font-bold tracking-widest border border-[#cbff00]/30 px-3 py-1 rounded-full">SECRÉTARIAT</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Gestion administrative</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full bg-[#111114] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] text-xs font-bold transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* STATS - MAINTENANT AVEC 4 CARTES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <StatCard title="Élèves" value={stats.totalStudents} icon={<Users />} loading={loading} />
        <StatCard title="Enseignants" value={stats.totalTeachers} icon={<School />} loading={loading} />
        <StatCard title="En attente" value={stats.pendingValidation} icon={<Clock />} loading={loading} />
        <StatCard title="Actifs" value={stats.activeStudents} icon={<UserCheck />} loading={loading} />
      </div>

      {/* LISTE DES DEMANDES */}
      <div className="bg-[#111114]/50 border border-white/5 rounded-[3rem] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="text-[#cbff00]" size={20} />
          <h2 className="text-xs font-black uppercase tracking-widest">Demandes d'inscription</h2>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#cbff00]" size={40} /></div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-[#16161a] border border-white/5 rounded-[2rem] p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-[#1c1c21] transition-all">
                <div className="flex items-center gap-5 w-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${user.role === 'teacher' ? 'bg-purple-500/10 text-purple-400' : 'bg-[#cbff00]/10 text-[#cbff00]'}`}>
                    {user.role === 'teacher' ? <School size={20} /> : <GraduationCap size={20} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm uppercase italic">{user.username}</h4>
                      <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${user.role === 'teacher' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">{user.email}</p>
                    <p className="text-[9px] text-[#cbff00]/60 font-bold mt-1 uppercase">
                      {user.role === 'teacher' ? "Dossier Personnel" : `${user.level_name} • ${user.filiere_name}`}
                    </p>
                  </div>
                </div>

                <button 
                  disabled={processingId === user.id}
                  onClick={() => handleValidate(user.id)}
                  className="w-full md:w-auto px-6 py-3 bg-[#cbff00] text-black rounded-xl font-black uppercase text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processingId === user.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                  Valider
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-600 text-[10px] font-black uppercase tracking-widest">
              Aucune demande à traiter
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecretaireHome;


// import React, { useState, useEffect } from "react";
// import { 
//   Users, UserCheck, Clock, Search, Loader2, ShieldCheck, Mail, GraduationCap, School, CheckCircle2 
// } from "lucide-react";
// import api from "../../api/axios";

// const StatCard = ({ title, value, icon, loading }) => (
//   <div className="bg-[#111114] border border-white/[0.05] p-6 rounded-[2rem] hover:border-[#cbff00]/20 transition-all duration-300 group">
//     <div className="flex justify-between items-start mb-4">
//       <div className="p-3 rounded-2xl bg-white/5 text-[#cbff00] group-hover:bg-[#cbff00] group-hover:text-black transition-all">
//         {React.cloneElement(icon, { size: 20 })}
//       </div>
//     </div>
//     <div>
//       <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{title}</h3>
//       <p className="text-3xl font-black tracking-tight text-white italic">
//         {loading ? <span className="animate-pulse">...</span> : value}
//       </p>
//     </div>
//   </div>
// );

// const SecretaireHome = () => {
//   const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, pendingValidation: 0, activeStudents: 0 });
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [processingId, setProcessingId] = useState(null); // Pour l'état de chargement du bouton

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       const [statsRes, pendingRes] = await Promise.all([
//         api.get("/secretaire/secretaire-stats"),
//         api.get("/secretaire/pending-requests") // Route mise à jour pour profs + élèves
//       ]);
//       setStats(statsRes.data);
//       console.log(statsRes.data);
//       setPendingUsers(pendingRes.data);
//       console.log(pendingRes.data)

//     } catch (error) {
//       console.error("Erreur de chargement:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleValidate = async (userId) => {
//     setProcessingId(userId);
//     try {
//       // Appel à ta route backend existante
//       await api.post(`/secretaire/validate-user/${userId}`);
      
//       // Notification de succès (optionnel)
//       console.log(`Utilisateur ${userId} validé avec succès`);
      
//       // Rafraîchissement local immédiat pour une UX fluide
//       setPendingUsers(prev => prev.filter(user => user.id !== userId));
      
//       // Mise à jour des compteurs globaux
//       const statsRes = await api.get("/secretaire/secretaire-stats");
//       setStats(statsRes.data);
//     } catch (error) {
//       alert("Erreur: " + (error.response?.data?.detail || "Impossible de valider cet utilisateur"));
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   const filteredUsers = pendingUsers.filter(user =>
//     user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
//         <div className="space-y-2">
//           <h1 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
//             Dashboard <span className="text-[#cbff00] text-sm not-italic font-bold tracking-widest border border-[#cbff00]/30 px-3 py-1 rounded-full">SECRÉTARIAT</span>
//           </h1>
//           <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Validation des nouveaux inscrits</p>
//         </div>

//         <div className="relative w-full md:w-80">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
//           <input 
//             type="text" 
//             placeholder="Rechercher un nom ou email..." 
//             className="w-full bg-[#111114] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] text-xs font-bold transition-all"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//         <StatCard title="Total Étudiants" value={stats.totalStudents} icon={<Users />} loading={loading} />
//         <StatCard title="Total Enseignants" value={stats.totalTeachers} icon={<School />} loading={loading} />
//         <StatCard title="En attente" value={stats.pendingValidation} icon={<Clock />} loading={loading} />
//         <StatCard title="Comptes Actifs" value={stats.activeStudents} icon={<UserCheck />} loading={loading} />
//       </div>

//       {/* LISTE DES DEMANDES */}
//       <div className="bg-[#111114]/50 border border-white/5 rounded-[3rem] p-8">
//         <div className="flex items-center gap-3 mb-8">
//           <ShieldCheck className="text-[#cbff00]" size={20} />
//           <h2 className="text-xs font-black uppercase tracking-widest">Inscriptions à traiter</h2>
//         </div>

//         <div className="space-y-4">
//           {loading ? (
//             <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#cbff00]" size={40} /></div>
//           ) : filteredUsers.length > 0 ? (
//             filteredUsers.map((user) => (
//               <div key={user.id} className="bg-[#16161a] border border-white/5 rounded-[2rem] p-5 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-[#1c1c21] transition-all">
//                 <div className="flex items-center gap-5 w-full">
//                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${user.role === 'teacher' ? 'bg-purple-500/10 text-purple-400' : 'bg-[#cbff00]/10 text-[#cbff00]'}`}>
//                     {user.role === 'teacher' ? <School size={20} /> : <GraduationCap size={20} />}
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <h4 className="font-bold text-sm uppercase italic">{user.username}</h4>
//                       <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${user.role === 'teacher' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
//                         {user.role}
//                       </span>
//                     </div>
//                     <p className="text-[10px] text-gray-500 font-medium">{user.email}</p>
//                     <p className="text-[9px] text-[#cbff00]/60 font-bold mt-1 uppercase">
//                       {user.role === 'teacher' ? "Dossier Enseignant" : `${user.level_name} • ${user.filiere_name}`}
//                     </p>
//                   </div>
//                 </div>

//                 <button 
//                   disabled={processingId === user.id}
//                   onClick={() => handleValidate(user.id)}
//                   className="w-full md:w-auto px-6 py-3 bg-[#cbff00] text-black rounded-xl font-black uppercase text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//                 >
//                   {processingId === user.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
//                   Valider l'accès
//                 </button>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-20 text-gray-600 text-[10px] font-black uppercase tracking-widest">
//               Aucune demande en attente de validation
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SecretaireHome;