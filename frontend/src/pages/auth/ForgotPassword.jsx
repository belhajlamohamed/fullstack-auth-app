import React from "react";
import { Mail, ChevronLeft, Send } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[400px] bg-[#cbff00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 space-y-8 relative z-10">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
            <Mail size={28} className="text-[#cbff00]" />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Mot de passe oublié ?</h1>
          <p className="text-gray-500 text-xs font-medium leading-relaxed">
            Pas de panique. Saisissez votre adresse email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Votre Email</label>
          <div className="relative group">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00]" />
            <input type="email" placeholder="nom@exemple.com" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] transition-all" />
          </div>
        </div>

        <button className="w-full bg-[#cbff00] text-black font-black py-4 rounded-2xl shadow-xl shadow-[#cbff00]/10 hover:scale-[1.02] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
          Envoyer le lien <Send size={16}/>
        </button>

        <a href="/login" className="flex items-center justify-center gap-2 text-xs font-black uppercase text-gray-500 hover:text-white transition-all">
          <ChevronLeft size={16}/> Retour à la connexion
        </a>
      </div>
    </div>
  );
}


// import React from "react";
// import { ArrowLeft, Mail, Send } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function ForgotPassword() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white p-4">
//       <div className="bg-white/5 border border-white/10 p-8 rounded-3xl w-full max-w-md space-y-6">
//         <Link to="/login" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
//           <ArrowLeft size={16} /> Retour
//         </Link>
//         <div className="text-center space-y-2">
//           <h2 className="text-2xl font-bold">Récupération</h2>
//           <p className="text-gray-400 text-sm">Entrez votre email pour recevoir un lien de réinitialisation.</p>
//         </div>
//         <div className="relative">
//           <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
//           <input type="email" placeholder="Email" className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl outline-none focus:border-purple-500" />
//         </div>
//         <button className="w-full bg-purple-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
//           Envoyer le lien <Send size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }