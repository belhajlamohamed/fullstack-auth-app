import React, { useState } from "react";
import { Bell, Search, User, Menu } from "lucide-react";

import Sidebar from "../../components/Sidebar";
import TeacherView from "../../views/TeacherView";
import CreateQuizModal from "../../components/modals/CreateQuizModal";
import { MENU_CONFIG } from "../../config/menuConfig";

export default function RoleBasedDashboard() {

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userData = JSON.parse(
    localStorage.getItem("user") ||
    '{"role":"TEACHER","username":"Professeur"}'
  );

  const role = userData.role.toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const renderContent = () => {
    if (role === "TEACHER") {
      switch (activeTab) {
        case "home":
          return (
            <TeacherView
              onOpenCreateModal={() => setIsModalOpen(true)}
            />
          );

        default:
          return (
            <TeacherView
              onOpenCreateModal={() => setIsModalOpen(true)}
            />
          );
      }
    }

    return (
      <div className="p-10 text-center">
        Vue Étudiant en construction...
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0c] text-white">

      {/* SIDEBAR DESKTOP */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          role={role}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
          menuConfig={MENU_CONFIG}
        />
      </div>

      {/* SIDEBAR MOBILE */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative z-50 w-64 h-full">
            <Sidebar
              collapsed={false}
              setCollapsed={setCollapsed}
              role={role}
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileOpen(false);
              }}
              handleLogout={handleLogout}
              menuConfig={MENU_CONFIG}
            />
          </div>

        </div>
      )}

      {/* CONTENU PRINCIPAL */}
      <div className="flex flex-1 flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-16 sm:h-20 border-b border-white/5 bg-black/20 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* HAMBURGER MOBILE */}
            <button
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* SEARCH */}
            <div className="relative w-64 hidden md:block">

              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <input
                type="text"
                placeholder="Rechercher un quiz ou un cours..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm outline-none focus:border-[#cbff00]/50"
              />

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 sm:gap-6">

            {/* NOTIFICATION */}
            <button className="relative p-2 text-gray-400 hover:text-[#cbff00]">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0c]"></span>
            </button>

            {/* USER */}
            <div className="flex items-center gap-3 sm:pl-6 sm:border-l border-white/10">

              <div className="text-right hidden sm:block">

                <p className="text-sm font-bold">
                  {userData.username}
                </p>

                <p className="text-[10px] text-[#cbff00] uppercase font-black">
                  {role}
                </p>

              </div>

              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#cbff00] to-green-500 rounded-full flex items-center justify-center">

                <User size={18} className="text-black" />

              </div>

            </div>

          </div>

        </header>

        {/* MAIN */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

          {renderContent()}

        </main>

      </div>

      {/* MODAL */}
      <CreateQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          window.location.reload();
        }}
      />

    </div>
  );
}



// import React, { useState } from "react";
// import { 
//   Bell, 
//   Search, 
//   User 
// } from "lucide-react";

// // Imports des composants
// import Sidebar from "../../components/Sidebar";
// import TeacherView from "../../views/TeacherView"; 
// import CreateQuizModal from "../../components/modals/CreateQuizModal"; 
// import { MENU_CONFIG } from "../../config/menuConfig";

// export default function RoleBasedDashboard() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [activeTab, setActiveTab] = useState("home");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Récupération des données utilisateur
//   const userData = JSON.parse(localStorage.getItem("user") || '{"role":"TEACHER", "username":"Professeur"}');
//   const role = userData.role.toUpperCase();

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/login";
//   };

//   // Mapping des vues
//   const renderContent = () => {
//     if (role === "TEACHER") {
//       switch (activeTab) {
//         case "home": 
//           return <TeacherView onOpenCreateModal={() => setIsModalOpen(true)} />;
//         default: 
//           return <TeacherView onOpenCreateModal={() => setIsModalOpen(true)} />;
//       }
//     }
//     return <div className="p-10 text-center">Vue Étudiant en construction...</div>;
//   };

//   return (
//     <div className="flex min-h-screen bg-[#0a0a0c] text-white overflow-hidden">
//       {/* 1. SIDEBAR */}
//       <Sidebar 
//         collapsed={collapsed} 
//         setCollapsed={setCollapsed} 
//         role={role} 
//         activeTab={activeTab} 
//         setActiveTab={setActiveTab} 
//         handleLogout={handleLogout}
//         menuConfig={MENU_CONFIG}
//       />
      
//       {/* 2. CONTENU PRINCIPAL */}
//       <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
//         {/* --- HEADER RESTAURÉ --- */}
//         <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-md px-8 flex items-center justify-between z-40">
//           <div className="relative w-96 hidden md:block">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
//             <input 
//               type="text" 
//               placeholder="Rechercher un quiz, un cours..." 
//               className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm outline-none focus:border-[#cbff00]/50 transition-all"
//             />
//           </div>

//           <div className="flex items-center gap-6">
//             <button className="relative p-2 text-gray-400 hover:text-[#cbff00] transition-colors">
//               <Bell size={20} />
//               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0c]"></span>
//             </button>

//             <div className="flex items-center gap-3 pl-6 border-l border-white/10">
//               <div className="text-right hidden sm:block">
//                 <p className="text-sm font-bold text-white">{userData.username}</p>
//                 <p className="text-[10px] text-[#cbff00] font-black uppercase tracking-tighter">{role}</p>
//               </div>
//               <div className="w-10 h-10 bg-gradient-to-br from-[#cbff00] to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-[#cbff00]/10">
//                 <User size={20} className="text-black" />
//               </div>
//             </div>
//           </div>
//         </header>
//         {/* --- FIN DU HEADER --- */}

//         <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
//           {renderContent()}
//         </main>
//       </div>

//       {/* MODAL */}
//       <CreateQuizModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         onSuccess={() => {
//             setIsModalOpen(false);
//             window.location.reload(); 
//         }} 
//       />
//     </div>
//   );
// }