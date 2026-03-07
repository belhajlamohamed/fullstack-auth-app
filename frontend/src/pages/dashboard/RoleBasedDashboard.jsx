import React, { useState } from "react";
import {
  Home, BookOpen, Settings, Bell, Menu, User,
  LogOut, ChevronLeft, ChevronRight, PlusCircle,
  Users, BarChart3, GraduationCap
} from "lucide-react";
import QuizInterface from "../../views/QuizInterface";
import SettingsView from "../../views/SettingsView";
import StudentsListView from "../../views/StudentsListView";
import StudentView from "../../views/StudentView";
import TeacherStatsView from "../../views/TeacherStatsView";
import TeacherView from "../../views/TeacherView";
import CreateQuizModal from "../../components/modals/CreateQuizModal"; // Import du modal créé précédemment

export default function RoleBasedDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulation du rôle (à remplacer par ton auth context)
  const userRole = "teacher"; 

  // Menu dynamique selon le rôle
  const menu = [
    { id: "home", label: "Dashboard", icon: Home },
    ...(userRole === "teacher" 
      ? [
          { id: "quizzes", label: "Mes Quiz", icon: BookOpen },
          { id: "students", label: "Étudiants", icon: Users },
          { id: "stats", label: "Stats", icon: BarChart3 },
        ]
      : [{ id: "courses", label: "Mes Cours", icon: BookOpen }]
    ),
    { id: "settings", label: "Paramètres", icon: Settings }
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white font-sans">
      
      {/* OVERLAY MOBILE */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* SIDEBAR ADAPTATIVE */}
      <aside className={`
        fixed md:relative z-50 h-full bg-black border-r border-white/10 transition-all duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        ${collapsed ? "md:w-20" : "md:w-64"} w-64 flex flex-col
      `}>
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#cbff00] p-2 rounded-lg shrink-0">
            <GraduationCap size={24} className="text-black" />
          </div>
          {!collapsed && <span className="font-black text-xl tracking-tighter italic">QUIZLAB</span>}
        </div>

        {/* Toggle collapse Desktop */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-20 bg-[#cbff00] text-black rounded-full p-1 border-4 border-[#0a0a0c]"
        >
          {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 flex flex-col gap-2 p-3 mt-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all group
                  ${isActive ? "bg-[#cbff00] text-black shadow-lg shadow-[#cbff00]/20" : "hover:bg-white/5 text-gray-400"}
                `}
              >
                <Icon size={22} className={isActive ? "text-black" : "group-hover:text-[#cbff00]"} />
                {!collapsed && <span className="text-sm font-bold uppercase tracking-tight">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER DYNAMIQUE */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 bg-white/5 rounded-lg" onClick={() => setMobileOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-gray-400 capitalize">
              {menu.find(m => m.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-[#cbff00] relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setAvatarOpen(!avatarOpen)}
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#cbff00] to-yellow-200 p-[2px]"
              >
                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-[#cbff00]">
                  <User size={20} />
                </div>
              </button>
              {avatarOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-[#121214] border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
                  <button className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl text-sm font-medium">Mon Profil</button>
                  <div className="h-px bg-white/5 my-1" />
                  <button className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-400 rounded-xl text-sm font-bold flex items-center gap-2">
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT LOADER */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-32">
          {activeTab === "home" && <WelcomeView userRole={userRole} />}
          {activeTab === "quizzes" && <TeacherQuizzesView onOpenModal={() => setIsModalOpen(true)} />}
          {activeTab === "stats" && <TeacherStatsView />} {/* <--- Ajouté ici */}
          {activeTab === "students" && <StudentsListView />} {/* <--- Ajouté ici */}
        </main>

        {/* BOTTOM NAV MOBILE (Style App Mobile) */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl flex justify-around items-center px-4 z-40 shadow-2xl">
          {menu.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`p-2 rounded-xl ${activeTab === item.id ? "text-[#cbff00] bg-[#cbff00]/10" : "text-gray-500"}`}>
                <Icon size={24} />
              </button>
            );
          })}
          {userRole === "teacher" && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#cbff00] text-black p-4 rounded-2xl -mt-12 shadow-xl shadow-[#cbff00]/30 border-8 border-[#0a0a0c]"
            >
              <PlusCircle size={24} />
            </button>
          )}
        </nav>
      </div>

      {/* CREATE QUIZ MODAL */}
      {isModalOpen && <CreateQuizModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

// --- SOUS-COMPOSANTS DE VUES ---

function WelcomeView({ userRole }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black italic uppercase">Content de vous revoir !</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-[#cbff00]/50 transition-all cursor-pointer group">
            <div className="text-gray-500 group-hover:text-[#cbff00] font-bold text-xs uppercase tracking-widest mb-2">Statistique {i}</div>
            <div className="text-4xl font-black">240</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// function TeacherQuizzesView({ onOpenModal }) {
//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-black uppercase">Mes Quiz En Ligne</h2>
//         <button 
//           onClick={onOpenModal}
//           className="hidden md:flex items-center gap-2 bg-[#cbff00] text-black px-6 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg shadow-[#cbff00]/20"
//         >
//           <PlusCircle size={20} /> CRÉER UN QUIZ
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {/* Exemple de carte quiz */}
//         {[1, 2].map(quiz => (
//           <div key={quiz} className="bg-[#121214] border border-white/5 rounded-[2.5rem] p-6 hover:bg-[#18181b] transition-all group">
//             <div className="flex justify-between items-start mb-6">
//               <div className="bg-[#673ee5]/20 text-[#673ee5] text-[10px] font-bold px-3 py-1 rounded-full uppercase">Mathématiques</div>
//               <div className="flex gap-2">
//                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                  <span className="text-[10px] text-gray-500 font-bold uppercase">Actif</span>
//               </div>
//             </div>
//             <h3 className="text-xl font-black mb-2 group-hover:text-[#cbff00] transition-colors">Algèbre Linéaire - Semestre 1</h3>
//             <p className="text-gray-500 text-sm mb-6">24 questions • 15min</p>
//             <div className="flex items-center justify-between border-t border-white/5 pt-6">
//                <div className="flex -space-x-3">
//                  {[1, 2, 3].map(u => <div key={u} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[10px] font-bold">U{u}</div>)}
//                </div>
//                <button className="text-[#cbff00] text-sm font-black uppercase tracking-widest">Détails →</button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // --- COMPOSANT STATISTIQUES ENSEIGNANT ---

// function TeacherStatsView() {
//   const statsSummary = [
//     { label: "Moyenne Générale", value: "14.5", suffix: "/20", color: "#cbff00" },
//     { label: "Taux de Réussite", value: "78", suffix: "%", color: "#673ee5" },
//     { label: "Quiz Complétés", value: "1,240", suffix: "", color: "#ffffff" },
//   ];

//   const topStudents = [
//     { name: "Amine Bennani", score: 19.5, progress: 95 },
//     { name: "Sarah Lemoine", score: 18.2, progress: 88 },
//     { name: "Marc Dupont", score: 17.8, progress: 82 },
//   ];

//   return (
//     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
//       {/* HEADER DE LA VUE */}
//       <div className="flex flex-col gap-2">
//         <h2 className="text-3xl font-black uppercase italic tracking-tighter">Analyse des Performances</h2>
//         <p className="text-gray-500 font-medium">Suivez l'évolution de vos classes et identifiez les élèves en difficulté.</p>
//       </div>

//       {/* CARTES DE RÉSUMÉ (KPIs) */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {statsSummary.map((stat, i) => (
//           <div key={i} className="bg-[#121214] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-white/20 transition-all">
//             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:bg-[#cbff00]/10 transition-colors" />
//             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{stat.label}</span>
//             <div className="mt-4 flex items-baseline gap-1">
//               <span className="text-5xl font-black tracking-tighter" style={{ color: stat.color }}>{stat.value}</span>
//               <span className="text-xl font-bold text-gray-400">{stat.suffix}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
//         {/* GRAPHIQUE SIMULÉ : ACTIVITÉ HEBDOMADAIRE */}
//         <div className="bg-[#121214] border border-white/5 p-8 rounded-[3rem] space-y-6">
//           <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
//             <BarChart3 className="text-[#cbff00]" size={20} /> Activité de la semaine
//           </h3>
//           <div className="flex items-end justify-between h-48 gap-2 px-2">
//             {[40, 70, 45, 90, 65, 80, 30].map((height, i) => (
//               <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
//                 <div 
//                   className="w-full bg-white/5 rounded-t-xl group-hover:bg-[#cbff00] transition-all duration-500 relative"
//                   style={{ height: `${height}%` }}
//                 >
//                   <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded">
//                     {height}%
//                   </div>
//                 </div>
//                 <span className="text-[10px] font-bold text-gray-600 uppercase">
//                   {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i]}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* LISTE TOP ÉTUDIANTS */}
//         <div className="bg-[#121214] border border-white/5 p-8 rounded-[3rem] space-y-6">
//           <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
//             <Users className="text-[#673ee5]" size={20} /> Major de promo
//           </h3>
//           <div className="space-y-5">
//             {topStudents.map((student, i) => (
//               <div key={i} className="flex items-center gap-4 group">
//                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-[#cbff00] border border-white/10">
//                   {i + 1}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex justify-between mb-1">
//                     <span className="font-bold text-sm">{student.name}</span>
//                     <span className="font-black text-[#cbff00]">{student.score}/20</span>
//                   </div>
//                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
//                     <div 
//                       className="h-full bg-[#673ee5] transition-all duration-1000" 
//                       style={{ width: `${student.progress}%` }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#cbff00] hover:text-black transition-all">
//             Voir tout le classement
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// // --- COMPOSANT LISTE DES ÉTUDIANTS ---

// function StudentsListView() {
//   const [searchTerm, setSearchTerm] = useState("");
  
//   const students = [
//     { id: 1, name: "Amine Bennani", email: "amine@univ.ma", status: "Inscrit", lastActive: "Il y a 2h", score: "18.5" },
//     { id: 2, name: "Sarah Lemoine", email: "sarah.l@gmail.com", status: "En attente", lastActive: "Hier", score: "-" },
//     { id: 3, name: "Marc Dupont", email: "m.dupont@ecole.fr", status: "Inscrit", lastActive: "Il y a 5 min", score: "14.2" },
//   ];

//   return (
//     <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
      
//       {/* HEADER & RECHERCHE */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-3xl font-black uppercase italic tracking-tighter">Gestion des Étudiants</h2>
//           <p className="text-gray-500 font-medium">Contrôlez les accès et suivez l'engagement de vos classes.</p>
//         </div>
        
//         <div className="relative group">
//           <input 
//             type="text" 
//             placeholder="Rechercher un élève..." 
//             className="bg-[#121214] border border-white/10 rounded-2xl px-12 py-4 outline-none focus:border-[#cbff00] transition-all w-full md:w-80 text-sm font-bold"
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00]">
//             <User size={18} />
//           </div>
//         </div>
//       </div>

//       {/* LISTE DES ÉTUDIANTS */}
//       <div className="space-y-3">
//         {/* En-tête de colonne (Masqué sur mobile) */}
//         <div className="hidden md:grid grid-cols-5 px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
//           <span className="col-span-2">Étudiant</span>
//           <span>Statut</span>
//           <span>Dernière Activité</span>
//           <span className="text-right">Action</span>
//         </div>

//         {students.map((student) => (
//           <div 
//             key={student.id} 
//             className="bg-[#121214] border border-white/5 p-4 md:p-6 md:px-8 rounded-[2rem] md:grid md:grid-cols-5 items-center hover:bg-white/[0.03] hover:border-white/10 transition-all group"
//           >
//             {/* Info Étudiant */}
//             <div className="col-span-2 flex items-center gap-4 mb-4 md:mb-0">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#673ee5] to-purple-900 flex items-center justify-center font-black text-white shadow-lg">
//                 {student.name.charAt(0)}
//               </div>
//               <div>
//                 <h4 className="font-bold text-base group-hover:text-[#cbff00] transition-colors">{student.name}</h4>
//                 <p className="text-xs text-gray-600 font-medium">{student.email}</p>
//               </div>
//             </div>

//             {/* Statut Badge */}
//             <div className="mb-4 md:mb-0">
//               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
//                 student.status === 'Inscrit' ? 'bg-[#cbff00]/10 text-[#cbff00]' : 'bg-orange-500/10 text-orange-500'
//               }`}>
//                 {student.status}
//               </span>
//             </div>

//             {/* Activité */}
//             <div className="mb-6 md:mb-0">
//                <p className="text-xs text-gray-400 font-bold flex items-center gap-2">
//                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div> {student.lastActive}
//                </p>
//             </div>

//             {/* Actions */}
//             <div className="flex justify-end gap-2">
//                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
//                  <Settings size={18} />
//                </button>
//                <button className="p-3 bg-white/5 hover:bg-red-500/10 rounded-xl text-gray-400 hover:text-red-500 transition-all">
//                  <Trash2 size={18} />
//                </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* PAGINATION / FOOTER */}
//       <div className="flex justify-center pt-4">
//         <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-[#cbff00] transition-all">
//           Charger plus d'étudiants
//         </button>
//       </div>
//     </div>
//   );
// }

// // --- COMPOSANT PARAMÈTRES ENSEIGNANT ---

// function SettingsView() {
//   const [notifications, setNotifications] = useState({
//     email: true,
//     quizSubmissions: true,
//     newStudents: false
//   });

//   return (
//     <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
      
//       {/* SECTION 1 : PROFIL PUBLIC */}
//       <section className="space-y-6">
//         <div className="border-l-4 border-[#cbff00] pl-4">
//           <h2 className="text-2xl font-black uppercase italic tracking-tighter">Mon Profil</h2>
//           <p className="text-gray-500 text-sm">Gérez vos informations publiques et votre avatar.</p>
//         </div>

//         <div className="bg-[#121214] border border-white/5 rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
//           <div className="relative group">
//             <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-[#cbff00] to-[#673ee5] p-1">
//               <div className="w-full h-full bg-black rounded-[2.2rem] flex items-center justify-center overflow-hidden">
//                 <User size={60} className="text-gray-700" />
//               </div>
//             </div>
//             <button className="absolute -bottom-2 -right-2 bg-[#cbff00] text-black p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform">
//               <PlusCircle size={20} />
//             </button>
//           </div>

//           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Nom Complet</label>
//               <input type="text" defaultValue="Prof. Amine Bennani" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-[#cbff00] transition-all font-bold" />
//             </div>
//             <div className="space-y-2">
//               <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Spécialité</label>
//               <input type="text" defaultValue="Mathématiques Supérieures" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-[#cbff00] transition-all font-bold" />
//             </div>
//             <div className="md:col-span-2 space-y-2">
//               <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Bio</label>
//               <textarea rows="2" className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-[#cbff00] transition-all font-medium resize-none" placeholder="Parlez de votre parcours..." />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* SECTION 2 : NOTIFICATIONS & SÉCURITÉ */}
//       <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
//         {/* Notifications */}
//         <div className="bg-[#121214] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
//           <h3 className="font-black uppercase flex items-center gap-3">
//             <Bell className="text-[#cbff00]" size={20} /> Alertes
//           </h3>
//           <div className="space-y-4">
//             {Object.keys(notifications).map((key) => (
//               <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
//                 <span className="text-sm font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
//                 <button 
//                   onClick={() => setNotifications({...notifications, [key]: !notifications[key]})}
//                   className={`w-12 h-6 rounded-full transition-all relative ${notifications[key] ? 'bg-[#cbff00]' : 'bg-gray-800'}`}
//                 >
//                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[key] ? 'left-7' : 'left-1'}`} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Sécurité */}
//         <div className="bg-[#121214] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
//           <h3 className="font-black uppercase flex items-center gap-3">
//             <Settings className="text-[#673ee5]" size={20} /> Sécurité
//           </h3>
//           <div className="space-y-4">
//             <button className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-left flex justify-between items-center hover:bg-white/10 transition-all">
//               Changer le mot de passe <ChevronRight size={18} />
//             </button>
//             <button className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-left flex justify-between items-center hover:bg-white/10 transition-all">
//               Double Authentification <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded">DÉSACTIVÉ</span>
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* BOUTONS D'ACTION FINAUX */}
//       <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 pb-12">
//         <button className="px-10 py-4 font-bold text-gray-500 hover:text-white transition-all">Annuler les modifs</button>
//         <button className="px-10 py-4 bg-[#cbff00] text-black rounded-2xl font-black shadow-lg shadow-[#cbff00]/20 hover:scale-[1.05] active:scale-95 transition-all">
//           ENREGISTRER LES PARAMÈTRES
//         </button>
//       </div>
//     </div>
//   );
// }