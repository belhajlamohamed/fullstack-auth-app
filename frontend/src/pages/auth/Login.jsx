import React, { useState } from "react";
import axios from "axios";
import { Mail, Lock, ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Connexion au backend port 8000
      const response = await axios.post("http://localhost:8000/users/login", formData);
      
      console.log("Données reçues du serveur :", response.data);

      const token = response.data.access_token || response.data.token;
      // On cherche le rôle dans response.data.role ou response.data.user.role
      const role = response.data.role || (response.data.user && response.data.user.role);

      if (token) {
        localStorage.setItem("access_token", token);
        
        if (role) {
          localStorage.setItem("userRole", role);
          console.log("✅ userRole stocké avec succès :", role);
        } else {
          console.warn("⚠️ Le champ 'role' est manquant dans la réponse JSON");
        }

        // Redirection vers le dashboard
        window.location.href = "/dashboard";
      }
    } catch (err) {
      if (!err.response) {
        setError("Serveur injoignable (Vérifiez le port 8000)");
      } else {
        setError(err.response.data.message || "Identifiants incorrects");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
      {/* EFFETS DE FOND */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#673ee5]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full pointer-events-none" />

      <form 
        onSubmit={handleSubmit}
        className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-8 relative z-10 shadow-2xl"
      >
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-[#cbff00] rounded-2xl flex items-center justify-center text-black mx-auto shadow-lg shadow-[#cbff00]/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Connexion</h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Accède à ton espace sécurisé</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#cbff00] transition-colors" />
              <input 
                required name="email" type="email" value={formData.email} onChange={handleChange}
                placeholder="nom@exemple.com" 
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#cbff00] transition-all text-sm font-bold" 
              />
            </div>
          </div>

          {/* MOT DE PASSE */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Mot de passe</label>
              {/* LIEN MOT DE PASSE OUBLIÉ */}
              <a href="/forgot-password" size={18} className="text-[9px] font-black uppercase text-[#cbff00] hover:text-white transition-all underline decoration-[#cbff00]/30 underline-offset-4">
                Oublié ?
              </a>
            </div>
            <div className="relative group">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#673ee5] transition-colors" />
              <input 
                required name="password" type="password" value={formData.password} onChange={handleChange}
                placeholder="••••••••" 
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-[#673ee5] transition-all text-sm font-bold" 
              />
            </div>
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#cbff00] to-green-400 text-black font-black py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <>Se connecter <ArrowRight size={18}/></>}
        </button>

        {/* LIEN D'INSCRIPTION */}
        <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
          Pas encore de compte ? 
          <a href="/register" className="text-[#cbff00] hover:text-white transition-colors ml-2 border-b border-[#cbff00] pb-0.5">
            Créer un compte
          </a>
        </p>
      </form>
    </div>
  );
}


// import React, { useState } from "react";
// import axios from "axios";
// import { Mail, Lock, ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

// export default function Login() {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (error) setError("");
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError("");

//   try {
//     const response = await axios.post("http://localhost:8000/users/login", formData);
    
//     // Log pour vérifier exactement ce que le backend envoie
//     console.log("Données reçues :", response.data);

//     // Extraction sécurisée du token et du rôle
//     const token = response.data.access_token || response.data.token;
    
//     // On cherche le rôle à plusieurs endroits possibles selon ton backend
//     const role = response.data.role || (response.data.user && response.data.user.role);

//     if (token) {
//       localStorage.setItem("access_token", token);
      
//       if (role) {
//         localStorage.setItem("userRole", role);
//         console.log("✅ userRole stocké :", role);
//       } else {
//         console.warn("⚠️ Rôle non trouvé dans la réponse JSON");
//       }

//       window.location.href = "/dashboard";
//     }
//   } catch (err) {
//     setError(err.response?.data?.message || "Erreur de connexion");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
//       {/* Glow effects */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full pointer-events-none" />
      
//       <form onSubmit={handleSubmit} className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-8 relative z-10 shadow-2xl">
//         <div className="flex flex-col items-center space-y-4">
//           <div className="w-20 h-20 bg-gradient-to-tr from-[#cbff00] to-[#673ee5] p-[2px] rounded-[2rem]">
//             <div className="w-full h-full bg-[#0a0a0c] rounded-[1.9rem] flex items-center justify-center">
//                <ShieldCheck size={36} className="text-[#cbff00]" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-black uppercase tracking-tighter italic">Connexion</h1>
//         </div>

//         {error && (
//           <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest">
//             <AlertCircle size={18} /> {error}
//           </div>
//         )}

//         <div className="space-y-5">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email</label>
//             <div className="relative group">
//               <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#cbff00] transition-colors" />
//               <input required name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-[#cbff00] transition-all text-sm font-bold" />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Mot de passe</label>
//             <div className="relative group">
//               <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#673ee5] transition-colors" />
//               <input required name="password" type="password" value={formData.password} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-14 pr-6 outline-none focus:border-[#673ee5] transition-all text-sm font-bold" />
//             </div>
//           </div>
//         </div>

//         <button disabled={loading} className="w-full bg-gradient-to-r from-[#cbff00] to-green-400 text-black font-black py-5 rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 disabled:opacity-50">
//           {loading ? <Loader2 size={22} className="animate-spin" /> : <>Entrer dans l'interface <ArrowRight size={20} /></>}
//         </button>
//       </form>
//     </div>
//   );
// }