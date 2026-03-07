import React from "react";

const SidebarItem = ({ icon, label, collapsed, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group
        ${active 
          ? "bg-[#cbff00] text-black shadow-[0_0_15px_rgba(203,255,0,0.2)]" 
          : "hover:bg-white/5 text-gray-400 hover:text-[#cbff00]"
        }
        ${collapsed ? "justify-center" : "justify-start"}`}
    >
      <div className={`${active ? "scale-110" : "group-hover:scale-110"} transition-transform`}>
        {icon}
      </div>
      {!collapsed && (
        <span className={`text-sm font-semibold tracking-wide ${active ? "text-black" : ""}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default SidebarItem;