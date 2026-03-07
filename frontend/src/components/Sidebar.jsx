import React from "react";
import { LayoutDashboard, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import SidebarItem from "./SidebarItem";

const Sidebar = ({collapsed, setCollapsed, mobileOpen, role, activeTab, setActiveTab, handleLogout, menuConfig}) => {
  // Récupération du menu selon le rôle
  const currentMenu = menuConfig[role.toUpperCase()] || [];

  return (
    <aside
      className={`fixed md:sticky top-0 z-50 h-screen bg-black/60 backdrop-blur-xl border-r border-white/10 transition-all duration-300 flex flex-col
      ${collapsed ? "w-20" : "w-64"}
      ${mobileOpen ? "left-0" : "-left-64 md:left-0"}`}
    >
      {/* 1. Header Sidebar */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#cbff00] p-2 rounded-lg">
          <LayoutDashboard size={20} className="text-black" />
        </div>
        {!collapsed && (
          <span className="text-xl font-bold tracking-tight text-white uppercase italic">
            Quiz<span className="text-[#cbff00]">Lab</span>
          </span>
        )}
      </div>

      {/* 2. Navigation (flex-1 pour pousser le logout en bas) */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto mt-4">
        {currentMenu.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </nav>

      {/* 3. Section Logout (Toujours en bas) */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group
          ${collapsed ? "justify-center" : "justify-start"}`}
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          {!collapsed && <span className="font-bold text-sm">Logout</span>}
        </button>
      </div>

      {/* Bouton de repli (Desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex absolute top-10 -right-4 bg-[#cbff00] text-black p-1.5 rounded-full shadow-xl hover:scale-110 transition border-4 border-[#0a0a0c]"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;