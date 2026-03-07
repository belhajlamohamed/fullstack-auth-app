import React, { useState } from "react";
import { User, Bell, Shield, Key, ChevronRight, Save, Camera } from "lucide-react";

export default function SettingsView() {
  const [notifs, setNotifs] = useState({ email: true, quiz: true, global: false });

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500 font-sans pb-20">
      <section className="space-y-6">
        <div className="flex items-center gap-4 border-l-4 border-[#cbff00] pl-4">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Profil</h2>
        </div>

        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-[#cbff00] to-[#673ee5] p-[2px]">
              <div className="w-full h-full bg-[#0a0a0c] rounded-[2.3rem] flex items-center justify-center overflow-hidden">
                <User size={60} className="text-gray-800" />
              </div>
            </div>
            <button className="absolute -bottom-2 -right-2 bg-[#cbff00] text-black p-3 rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-[#0a0a0c]">
              <Camera size={18} />
            </button>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nom Complet</label>
              <input type="text" defaultValue="Prof. Amine Bennani" className="w-full bg-[#121214]/50 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#cbff00] transition-all font-bold text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Spécialité</label>
              <input type="text" defaultValue="Mathématiques" className="w-full bg-[#121214]/50 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#cbff00] transition-all font-bold text-white" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 space-y-6">
          <h3 className="font-black uppercase flex items-center gap-3 text-white italic tracking-tighter">
            <Bell className="text-[#cbff00]" size={20} /> Notifications
          </h3>
          <div className="space-y-4">
            {Object.keys(notifs).map((key) => (
              <div key={key} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{key}</span>
                <button 
                  onClick={() => setNotifs({...notifs, [key]: !notifs[key]})}
                  className={`w-12 h-6 rounded-full transition-all relative ${notifs[key] ? 'bg-[#cbff00]' : 'bg-gray-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifs[key] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 space-y-6">
          <h3 className="font-black uppercase flex items-center gap-3 text-white italic tracking-tighter">
            <Shield className="text-[#673ee5]" size={20} /> Sécurité
          </h3>
          <div className="space-y-4">
            <button className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex justify-between items-center hover:bg-white/10 transition-all text-white">
              Changer le mot de passe <ChevronRight size={18} className="text-[#673ee5]" />
            </button>
            <button className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex justify-between items-center opacity-50 cursor-not-allowed text-white">
              Double Auth (2FA) <span className="text-[8px] bg-red-500/20 text-red-500 px-2 py-1 rounded">OFF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-[#cbff00] to-green-400 text-black px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-[#cbff00]/20 hover:scale-105 transition-all flex items-center gap-3">
          Enregistrer <Save size={18} />
        </button>
      </div>
    </div>
  );
}