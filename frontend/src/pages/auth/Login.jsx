import React, { useState } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white overflow-hidden relative font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#673ee5]/20 blur-[120px] rounded-full pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#cbff00] to-[#673ee5] p-[2px] rounded-2xl">
            <div className="w-full h-full bg-[#0a0a0c] rounded-[14px] flex items-center justify-center">
               <ShieldCheck size={32} className="text-[#cbff00]" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Connexion</h1>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Accède à ton dashboard</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Adresse Email</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
              <input
                required type="email" placeholder="nom@exemple.com"
                className="w-full bg-[#121214]/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] focus:ring-4 focus:ring-[#cbff00]/5 transition-all font-medium"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Mot de passe</label>
              <a href="/forgot-password" size={18} className="text-[10px] font-black uppercase text-[#cbff00] hover:underline transition-all">Oublié ?</a>
            </div>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#673ee5] transition-colors" />
              <input
                required type="password" placeholder="••••••••"
                className="w-full bg-[#121214]/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#673ee5] focus:ring-4 focus:ring-[#673ee5]/5 transition-all font-medium"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#cbff00] to-green-400 text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#cbff00]/20 uppercase text-xs tracking-widest"
        >
          Se connecter <ArrowRight size={18} />
        </button>

        <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-tight">
          Pas encore de compte ? 
          <a href="/register" className="text-[#cbff00] hover:text-white transition-colors ml-1">Créer un compte</a>
        </p>
      </form>
    </div>
  );
}
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
// import axios from "../../api/axios";

// export default function Login() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [credentials, setCredentials] = useState({ email: "", password: "" });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Envoi JSON à la route /users/login
//       const response = await axios.post("http://localhost:8000/users/login", credentials);
      
//       // Stockage des données reçues du backend
//       localStorage.setItem("access_token", response.data.access_token);
//       localStorage.setItem("user", JSON.stringify(response.data.user));
      
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.detail || "Identifiants invalides");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white p-4">
//       <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md space-y-6">
//         <div className="text-center">
//           <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"><LogIn size={24} /></div>
//           <h2 className="text-3xl font-bold">Bon retour !</h2>
//         </div>

//         {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl text-xs text-center">{error}</div>}

//         <div className="space-y-4">
//           <div className="relative">
//             <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
//             <input type="email" placeholder="Email" onChange={(e) => setCredentials({...credentials, email: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-purple-500" required />
//           </div>
//           <div className="relative">
//             <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
//             <input type="password" placeholder="Mot de passe" onChange={(e) => setCredentials({...credentials, password: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-purple-500" required />
//           </div>
//         </div>

//         <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-purple-500 transition flex items-center justify-center gap-2">
//           {loading ? <Loader2 className="animate-spin" /> : "Se connecter"}
//         </button>

//         <p className="text-center text-sm text-gray-400">
//           Pas encore de compte ? <Link to="/register" className="text-purple-400 font-semibold hover:underline">Créer un compte</Link>
//         </p>
//       </form>
//     </div>
//   );
// }