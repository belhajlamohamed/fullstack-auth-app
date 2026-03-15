import React from "react";
import { 
  Home, 
  Layout, 
  BarChart3, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  LogOut, 
  BookOpen, 
  GraduationCap,
  UserCheck,
  ShieldAlert
} from "lucide-react";
import { logout, getUserRole } from "../../utils/auth";

export default function Sidebar({ 
  activeView, setActiveView, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen 
}) {

  // On récupère le rôle et on force en majuscules pour le menuConfig
  const userRole = (getUserRole() || "student").toUpperCase();

  const menuConfig = [
    { 
      id: "home", 
      label: "Dashboard", 
      icon: <Home size={22} />, 
      roles: ["TEACHER", "STUDENT", "SECRETAIRE", "ADMIN"] 
    },
    { 
      id: "my-quizzes", 
      label: "Mes Quiz", 
      icon: <Layout size={22} />, 
      roles: ["TEACHER"] 
    },
    { 
      id: "explore", 
      label: "Explorer", 
      icon: <BookOpen size={22} />, 
      roles: ["STUDENT"] 
    },
    { 
      id: "results", 
      label: "Mes Notes", 
      icon: <GraduationCap size={22} />, 
      roles: ["STUDENT"] 
    },
    { 
      id: "stats", 
      label: "Statistiques", 
      icon: <BarChart3 size={22} />, 
      roles: ["TEACHER", "SECRETAIRE", "ADMIN"] 
    },
    { 
      id: "profile", 
      label: "Mon Profil", 
      icon: <User size={22} />, 
      roles: ["TEACHER", "STUDENT"] 
    },
  ];

  // Filtrage : On ne garde que ce qui correspond au rôle de l'utilisateur
  const filteredMenu = menuConfig.filter(item => item.roles.includes(userRole));

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-[120] bg-[#0a0a0c] border-r border-white/5 transition-all duration-300 flex flex-col
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        ${isCollapsed ? "w-20" : "w-64"} 
        md:translate-x-0 
      `}>
        
        <div className={`p-4 flex items-center border-b border-white/5 h-20 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && (
            <div className="flex flex-col ml-2 animate-in fade-in duration-300">
              <span className="text-lg font-black uppercase italic tracking-tighter text-[#cbff00]">SKYQUIZ</span>
              <span className="text-[8px] font-bold text-gray-500 tracking-[0.3em] uppercase">{userRole}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-[#cbff00] transition-all"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-2 text-gray-500"><X size={20} /></button>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-2">
          {filteredMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => {setActiveView(item.id); if(window.innerWidth < 768) setIsMobileOpen(false);}}
              className={`w-full flex items-center rounded-2xl transition-all py-3.5
                ${isCollapsed ? "justify-center px-0" : "px-4 gap-4"}
                ${activeView === item.id 
                  ? "bg-[#cbff00] text-black shadow-lg shadow-[#cbff00]/20 font-black italic" 
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {!isCollapsed && (
                <span className="font-bold uppercase text-[10px] tracking-widest whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={logout} className={`w-full flex items-center text-red-500/70 hover:text-red-500 py-3 rounded-xl transition-all ${isCollapsed ? "justify-center" : "px-4 gap-4"}`}>
            <LogOut size={20} />
            {!isCollapsed && <span className="font-bold uppercase text-[10px] tracking-widest">Quitter</span>}
          </button>
        </div>
      </aside>
    </>
  );
}



// import React from "react";
// import { 
//   Home, 
//   Layout, 
//   BarChart3, 
//   User, 
//   ChevronLeft, 
//   ChevronRight, 
//   X, 
//   LogOut, 
//   BookOpen, 
//   GraduationCap,
//   UserCheck,
//   ShieldAlert
// } from "lucide-react";
// import { logout, getUserRole } from "../../utils/auth";

// export default function Sidebar({ 
//   activeView, setActiveView, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen 
// }) {

//   // On récupère le rôle et on force en majuscules pour correspondre aux rôles du menuConfig
//   const userRole = (getUserRole() || "student").toUpperCase();

//   const menuConfig = [
//     { 
//       id: "home", 
//       label: "Dashboard", 
//       icon: <Home size={22} />, 
//       roles: ["TEACHER", "STUDENT", "SECRETAIRE", "ADMIN"] 
//     },
//     { 
//       id: "my-quizzes", 
//       label: "Mes Quiz", 
//       icon: <Layout size={22} />, 
//       roles: ["TEACHER"] 
//     },
//     { 
//       id: "explore", 
//       label: "Explorer", 
//       icon: <BookOpen size={22} />, 
//       roles: ["STUDENT"] 
//     },
//     { 
//       id: "results", 
//       label: "Mes Notes", 
//       icon: <GraduationCap size={22} />, 
//       roles: ["STUDENT"] 
//     },
//     { 
//       id: "stats", 
//       label: "Statistiques", 
//       icon: <BarChart3 size={22} />, 
//       roles: ["TEACHER", "SECRETAIRE", "ADMIN"] 
//     },
//     { 
//       id: "validations", 
//       label: "Validations", 
//       icon: <UserCheck size={22} />, 
//       roles: ["SECRETAIRE", "ADMIN"] 
//     },
//     { 
//       id: "manage-staff", 
//       label: "Gestion Staff", 
//       icon: <ShieldAlert size={22} />, 
//       roles: ["ADMIN"] 
//     },
//     { 
//       id: "profile", 
//       label: "Mon Profil", 
//       icon: <User size={22} />, 
//       roles: ["TEACHER", "STUDENT"] 
//     },
//   ];

//   // Filtrage du menu selon le rôle de l'utilisateur connecté
//   const filteredMenu = menuConfig.filter(item => item.roles.includes(userRole));

//   return (
//     <>
//       {/* Overlay pour le menu mobile */}
//       {isMobileOpen && (
//         <div 
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       <aside className={`
//         fixed top-0 left-0 h-full z-[120] bg-[#0a0a0c] border-r border-white/5 transition-all duration-300 flex flex-col
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
//         ${isCollapsed ? "w-20" : "w-64"} 
//         md:translate-x-0 
//       `}>
        
//         {/* LOGO ET TOGGLE */}
//         <div className={`p-4 flex items-center border-b border-white/5 h-20 ${isCollapsed ? "justify-center" : "justify-between"}`}>
//           {!isCollapsed && (
//             <div className="flex flex-col ml-2 animate-in fade-in duration-300">
//               <span className="text-lg font-black uppercase italic tracking-tighter text-[#cbff00]">SKYQUIZ</span>
//               <span className="text-[8px] font-bold text-gray-500 tracking-[0.3em] uppercase">{userRole}</span>
//             </div>
//           )}

//           <div className="flex items-center gap-1">
//             <button 
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="flex p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-[#cbff00] transition-all"
//             >
//               {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
//             </button>

//             <button 
//               onClick={() => setIsMobileOpen(false)}
//               className="md:hidden p-2 text-gray-500 hover:text-red-500"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>

//         {/* LISTE DES MENUS (DYNAMIQUE) */}
//         <nav className="flex-1 px-3 mt-4 space-y-2">
//           {filteredMenu.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => {
//                 setActiveView(item.id);
//                 if (window.innerWidth < 768) setIsMobileOpen(false); // Ferme le menu mobile après clic
//               }}
//               className={`w-full flex items-center rounded-2xl transition-all py-3.5
//                 ${isCollapsed ? "justify-center px-0" : "px-4 gap-4"}
//                 ${activeView === item.id 
//                   ? "bg-[#cbff00] text-black shadow-lg shadow-[#cbff00]/20 font-black italic" 
//                   : "text-gray-500 hover:bg-white/5 hover:text-white"
//                 }
//               `}
//             >
//               <div className="flex-shrink-0">{item.icon}</div>
//               {!isCollapsed && (
//                 <span className="font-bold uppercase text-[10px] tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-left-2">
//                   {item.label}
//                 </span>
//               )}
//             </button>
//           ))}
//         </nav>

//         {/* DÉCONNEXION */}
//         <div className="p-4 border-t border-white/5">
//           <button 
//             onClick={logout}
//             className={`w-full flex items-center text-red-500/70 hover:text-red-500 py-3 rounded-xl transition-all ${isCollapsed ? "justify-center" : "px-4 gap-4"}`}
//           >
//             <LogOut size={20} />
//             {!isCollapsed && <span className="font-bold uppercase text-[10px] tracking-widest">Quitter</span>}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }



// // import React from "react";
// // import { 
// //   Home, 
// //   BarChart3, 
// //   ChevronLeft, 
// //   ChevronRight, 
// //   X, 
// //   LogOut, 
// //   BookOpen, 
// //   UserCheck, 
// //   Search 
// // } from "lucide-react";
// // import { logout, getUserRole } from "../../utils/auth";

// // export default function Sidebar({ 
// //   activeView, setActiveView, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen 
// // }) {

// //   // On récupère le rôle via l'utilitaire (en minuscules pour correspondre à ton objet menuItems)
// //   const userRole = (getUserRole() || "student").toLowerCase();

// //   // Ta nouvelle structure de menu organisée par rôle
// //   // const menuItems = {
// //   //   teacher: [
// //   //     { id: "home", label: "Dashboard", icon: <Home size={22} /> },
// //   //     { id: "my-quizzes", label: "Mes Quiz", icon: <BookOpen size={22} /> },
// //   //     { id: "stats", label: "Statistiques", icon: <BarChart3 size={22} /> },
// //   //   ],
// //   //   student: [
// //   //     { id: "home", label: "Dashboard", icon: <Home size={22} /> },
// //   //     { id: "explore", label: "Parcourir", icon: <Search size={22} /> },
// //   //   ],
// //   //   secretaire: [
// //   //     { id: "home", label: "Validations", icon: <UserCheck size={22} /> },
// //   //     { id: "stats", label: "Statistiques", icon: <BarChart3 size={22} /> },
// //   //   ],
// //   //   admin: [
// //   //     { id: "home", label: "Gestion Centrale", icon: <UserCheck size={22} /> },
// //   //     { id: "stats", label: "Analytiques", icon: <BarChart3 size={22} /> },
// //   //   ]
// //   // };
// //   const menuConfig = [
// //   { id: "home", label: "Dashboard", icon: <Home size={22} />, roles: ["TEACHER", "STUDENT", "SECRETAIRE", "ADMIN"] },
// //   { id: "my-quizzes", label: "Mes Quiz", icon: <Layout size={22} />, roles: ["TEACHER"] },
// //   { id: "explore", label: "Explorer", icon: <BookOpen size={22} />, roles: ["STUDENT"] },
// //   { id: "results", label: "Mes Notes", icon: <GraduationCap size={22} />, roles: ["STUDENT"] },
// //   { id: "stats", label: "Statistiques", icon: <BarChart3 size={22} />, roles: ["TEACHER", "SECRETAIRE", "ADMIN"] },
// //   { id: "profile", label: "Mon Profil", icon: <User size={22} />, roles: ["TEACHER", "STUDENT"] },
  
// //   // Nouveaux items pour le Secrétaire et l'Admin
// //   { id: "validations", label: "Validations", icon: <UserCheck size={22} />, roles: ["SECRETAIRE", "ADMIN"] },
// //   { id: "manage-staff", label: "Gestion Staff", icon: <ShieldAlert size={22} />, roles: ["ADMIN"] },
// // ];

// //   // On récupère les items correspondants au rôle actuel
// //   const filteredMenu = menuConfig[userRole] || [];

// //   return (
// //     <>
// //       {/* Overlay mobile */}
// //       {isMobileOpen && (
// //         <div 
// //           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
// //           onClick={() => setIsMobileOpen(false)}
// //         />
// //       )}

// //       <aside className={`
// //         fixed top-0 left-0 h-full z-[120] bg-[#0a0a0c] border-r border-white/5 transition-all duration-300 flex flex-col
// //         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
// //         ${isCollapsed ? "w-20" : "w-64"} 
// //         md:translate-x-0 
// //       `}>
        
// //         {/* HEADER DU SIDEBAR */}
// //         <div className={`p-4 flex items-center border-b border-white/5 h-20 ${isCollapsed ? "justify-center" : "justify-between"}`}>
// //           {!isCollapsed && (
// //             <div className="flex flex-col ml-2 animate-in fade-in duration-300">
// //               <span className="text-lg font-black uppercase italic tracking-tighter text-[#cbff00]">SKYQUIZ</span>
// //               <span className="text-[8px] font-bold text-gray-500 tracking-[0.3em] uppercase">{userRole}</span>
// //             </div>
// //           )}

// //           <div className="flex items-center gap-1">
// //             <button 
// //               onClick={() => setIsCollapsed(!isCollapsed)}
// //               className="flex p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-[#cbff00] transition-all"
// //             >
// //               {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
// //             </button>

// //             <button 
// //               onClick={() => setIsMobileOpen(false)}
// //               className="md:hidden p-2 text-gray-500 hover:text-red-500"
// //             >
// //               <X size={20} />
// //             </button>
// //           </div>
// //         </div>

// //         {/* NAVIGATION */}
// //         <nav className="flex-1 px-3 mt-4 space-y-2 text-white">
// //           {filteredMenu.map((item) => (
// //             <button
// //               key={item.id}
// //               onClick={() => {
// //                 console.log("Navigation vers:", item.id);
// //                 setActiveView(item.id);
// //                 if(window.innerWidth < 768) setIsMobileOpen(false); // Ferme sur mobile après clic
// //               }}
// //               className={`w-full flex items-center rounded-2xl transition-all py-3.5
// //                 ${isCollapsed ? "justify-center px-0" : "px-4 gap-4"}
// //                 ${activeView === item.id 
// //                   ? "bg-[#cbff00] text-black shadow-lg shadow-[#cbff00]/20 font-black italic" 
// //                   : "text-gray-500 hover:bg-white/5 hover:text-white"
// //                 }
// //               `}
// //             >
// //               <div className="flex-shrink-0">{item.icon}</div>
// //               {!isCollapsed && (
// //                 <span className="font-bold uppercase text-[10px] tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-left-2">
// //                   {item.label}
// //                 </span>
// //               )}
// //             </button>
// //           ))}
// //         </nav>

// //         {/* LOGOUT */}
// //         <div className="p-4 border-t border-white/5">
// //           <button 
// //             onClick={logout}
// //             className={`w-full flex items-center text-red-500/70 hover:text-red-500 py-3 rounded-xl transition-all ${isCollapsed ? "justify-center" : "px-4 gap-4"}`}
// //           >
// //             <LogOut size={20} />
// //             {!isCollapsed && <span className="font-bold uppercase text-[10px] tracking-widest">Quitter</span>}
// //           </button>
// //         </div>
// //       </aside>
// //     </>
// //   );
// // }



// // // import React from "react";
// // // import { 
// // //   Home, Layout, BarChart3, User, 
// // //   ChevronLeft, ChevronRight, X, LogOut, BookOpen, GraduationCap 
// // // } from "lucide-react";
// // // import { logout, getUserRole } from "../../utils/auth";

// // // export default function Sidebar({ 
// // //   activeView, setActiveView, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen 
// // // }) {

// // //   // On récupère le rôle proprement via l'utilitaire
// // //   const userRole = (getUserRole() || "student").toUpperCase();

// // //   const menuConfig = [
// // //     { id: "home", label: "Dashboard", icon: <Home size={22} />, roles: ["TEACHER", "STUDENT"] },
// // //     { id: "my-quizzes", label: "Mes Quiz", icon: <Layout size={22} />, roles: ["TEACHER"] },
// // //     { id: "explore", label: "Explorer", icon: <BookOpen size={22} />, roles: ["STUDENT"] },
// // //     { id: "results", label: "Mes Notes", icon: <GraduationCap size={22} />, roles: ["STUDENT"] },
// // //     { id: "stats", label: "Statistiques", icon: <BarChart3 size={22} />, roles: ["TEACHER"] },
// // //     { id: "profile", label: "Mon Profil", icon: <User size={22} />, roles: ["TEACHER", "STUDENT"] },
// // //   ];


// // //   const filteredMenu = menuConfig.filter(item => item.roles.includes(userRole));
  
 

// // //   return (
// // //     <>
// // //       {/* Overlay : On le garde pour pouvoir fermer complètement le menu sur mobile */}
// // //       {isMobileOpen && (
// // //         <div 
// // //           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
// // //           onClick={() => setIsMobileOpen(false)}
// // //         />
// // //       )}

// // //       <aside className={`
// // //         fixed top-0 left-0 h-full z-[120] bg-[#0a0a0c] border-r border-white/5 transition-all duration-300 flex flex-col
// // //         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
// // //         ${isCollapsed ? "w-20" : "w-64"} 
// // //         md:translate-x-0 
// // //       `}>
        
// // //         {/* HEADER DU SIDEBAR */}
// // //         <div className={`p-4 flex items-center border-b border-white/5 h-20 ${isCollapsed ? "justify-center" : "justify-between"}`}>
// // //           {!isCollapsed && (
// // //             <div className="flex flex-col ml-2 animate-in fade-in duration-300">
// // //               <span className="text-lg font-black uppercase italic tracking-tighter text-[#cbff00]">SKYQUIZ</span>
// // //               <span className="text-[8px] font-bold text-gray-500 tracking-[0.3em] uppercase">{userRole}</span>
// // //             </div>
// // //           )}

// // //           <div className="flex items-center gap-1">
// // //             {/* CHEVRON : Maintenant visible sur TOUS les écrans pour réduire/élargir */}
// // //             <button 
// // //               onClick={() => setIsCollapsed(!isCollapsed)}
// // //               className="flex p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-[#cbff00] transition-all"
// // //             >
// // //               {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
// // //             </button>

// // //             {/* BOUTON X : Uniquement pour fermer COMPLÈTEMENT sur mobile */}
// // //             <button 
// // //               onClick={() => setIsMobileOpen(false)}
// // //               className="md:hidden p-2 text-gray-500 hover:text-red-500"
// // //             >
// // //               <X size={20} />
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* NAVIGATION */}
// // //         <nav className="flex-1 px-3 mt-4 space-y-2">
// // //           {filteredMenu.map((item) => (
// // //             <button
// // //               key={item.id}
// // //               onClick={() => {console.log("Clic sur:", item.id);setActiveView(item.id)}}
// // //               className={`w-full flex items-center rounded-2xl transition-all py-3.5
// // //                 ${isCollapsed ? "justify-center px-0" : "px-4 gap-4"}
// // //                 ${activeView === item.id ? "bg-[#cbff00] text-black shadow-lg shadow-[#cbff00]/20" : "text-gray-500 hover:bg-white/5 hover:text-white"}
// // //               `}
// // //             >
// // //               <div className="flex-shrink-0">{item.icon}</div>
// // //               {!isCollapsed && (
// // //                 <span className="font-bold uppercase text-[10px] tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-left-2">
// // //                   {item.label}
// // //                 </span>
// // //               )}
// // //             </button>
// // //           ))}
// // //         </nav>

// // //         {/* LOGOUT */}
// // //         <div className="p-4 border-t border-white/5">
// // //           <button 
// // //           onClick={logout}
// // //           className={`w-full flex items-center text-red-500/70 hover:text-red-500 py-3 rounded-xl transition-all ${isCollapsed ? "justify-center" : "px-4 gap-4"}`}>
// // //             <LogOut size={20} />
// // //             {!isCollapsed && <span className="font-bold uppercase text-[10px] tracking-widest">Quitter</span>}
// // //           </button>
// // //         </div>
// // //       </aside>
// // //     </>
// // //   );
// // // }
