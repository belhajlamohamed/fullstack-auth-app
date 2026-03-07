import React from "react";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";

export default function PasswordReset() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative">
      <div className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 space-y-8 relative z-10 shadow-2xl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Nouveau mot de passe</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">Définit ton nouvel accès sécurisé</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Nouveau mot de passe</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#673ee5]" />
              <input type="password" placeholder="••••••••••••" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#673ee5] transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Confirmer le mot de passe</label>
            <div className="relative group">
              <CheckCircle2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00]" />
              <input type="password" placeholder="••••••••••••" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] transition-all" />
            </div>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-[#673ee5] to-[#cbff00] text-white font-black py-4 rounded-2xl hover:scale-[1.02] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
          Réinitialiser mon accès <ArrowRight size={18}/>
        </button>
      </div>
    </div>
  );
}


// import React from "react";
// import { Lock, ShieldCheck } from "lucide-react";

// export default function ResetPassword() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white p-4">
//       <div className="bg-white/5 border border-white/10 p-8 rounded-3xl w-full max-w-md space-y-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold">Nouveau mot de passe</h2>
//         </div>
//         <div className="space-y-4">
//           <input type="password" placeholder="Nouveau mot de passe" className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl outline-none focus:border-purple-500" />
//           <input type="password" placeholder="Confirmer le mot de passe" className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl outline-none focus:border-purple-500" />
//         </div>
//         <button className="w-full bg-[#cbff00] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
//           Mettre à jour <ShieldCheck size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }