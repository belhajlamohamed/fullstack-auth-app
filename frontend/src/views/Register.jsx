import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  User, Mail, Lock, GraduationCap, School, 
  ArrowRight, Loader2, AlertCircle, Inbox, 
  Layers, BookOpen, ChevronDown, Repeat
} from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
    cycle_id: "",
    level_id: "",
    filiere_id: ""
  });

  const [dbData, setDbData] = useState({
    cycles: [],
    levels: [],
    filieres: [],
    loading: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 1. Charger les CYCLES au démarrage
  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const res = await axios.get("http://localhost:8000/academic/cycles");
        setDbData(prev => ({ ...prev, cycles: res.data, loading: false }));
      } catch (err) {
        setError("Erreur de connexion au serveur académique.");
        setDbData(prev => ({ ...prev, loading: false }));
      }
    };
    fetchCycles();
  }, []);

  // 2. Charger les NIVEAUX quand le Cycle change
  useEffect(() => {
    if (formData.cycle_id) {
      axios.get(`http://localhost:8000/academic/cycles/${formData.cycle_id}/levels`)
        .then(res => setDbData(prev => ({ ...prev, levels: res.data })))
        .catch(() => setError("Erreur lors du chargement des niveaux."));
    } else {
      setDbData(prev => ({ ...prev, levels: [], filieres: [] }));
    }
  }, [formData.cycle_id]);

  // 3. Charger les FILIÈRES quand le Niveau change
  useEffect(() => {
    if (formData.level_id) {
      axios.get(`http://localhost:8000/academic/levels/${formData.level_id}/filieres`)
        .then(res => setDbData(prev => ({ ...prev, filieres: res.data })))
        .catch(() => setError("Erreur lors du chargement des filières."));
    } else {
      setDbData(prev => ({ ...prev, filieres: [] }));
    }
  }, [formData.level_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // Préparation d'une copie des données pour ne pas corrompre le state
  const payload = { ...formData };

  // 1. Logique de nettoyage pour Teacher
  if (formData.role === "teacher") {
    payload.level_id = null;    // On force null au lieu de ""
    payload.filiere_id = null;  // On force null au lieu de ""
    payload.cycle_id = null;    // On force null au lieu de ""
  } 
  // 2. Vérification pour Student
  else if (!formData.level_id || !formData.filiere_id) {
    setError("Veuillez sélectionner un niveau et une filière.");
    setLoading(false);
    return;
  }

  try {
    // On envoie 'payload' et non 'formData'
    await axios.post("http://localhost:8000/users/register", payload);
    setIsSubmitted(true);
  } catch (err) {
    // Affiche l'erreur précise du backend pour déboguer (ex: champ manquant)
    const detail = err.response?.data?.detail;
    setError(typeof detail === 'string' ? detail : "Erreur d'inscription.");
  } finally {
    setLoading(false);
  }
};

  if (isSubmitted) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white p-6 text-center">
            <div className="space-y-6">
                <div className="w-20 h-20 bg-[#cbff00]/20 rounded-full flex items-center justify-center mx-auto text-[#cbff00]"><Inbox size={40}/></div>
                <h2 className="text-3xl font-black italic uppercase">Demande envoyée</h2>
                <p className="text-gray-400">Ton compte est en attente de validation par le secrétariat.</p>
                <button onClick={() => window.location.href="/login"} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl uppercase text-[10px] font-bold tracking-widest">Retour</button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white font-sans">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Inscription</h1>
          {error && <div className="text-red-500 text-[10px] font-bold uppercase p-3 bg-red-500/10 rounded-xl">{error}</div>}
        </div>

        {/* ROLE SELECTOR */}
        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => setFormData({...formData, role: "student"})} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${formData.role === "student" ? "border-[#cbff00] text-[#cbff00] bg-[#cbff00]/5" : "border-transparent text-gray-500 bg-white/5"}`}><GraduationCap size={24}/> <span className="text-[10px] font-black uppercase">Étudiant</span></button>
          <button type="button" onClick={() => setFormData({...formData, role: "teacher"})} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 ${formData.role === "teacher" ? "border-[#673ee5] text-[#673ee5] bg-[#673ee5]/5" : "border-transparent text-gray-500 bg-white/5"}`}><School size={24}/> <span className="text-[10px] font-black uppercase">Enseignant</span></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input required name="username" placeholder="Pseudo" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#cbff00]" onChange={handleChange} />
          <input required name="email" type="email" placeholder="Email" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#cbff00]" onChange={handleChange} />
          
          {formData.role === "student" && (
            <>
              {/* SELECT CYCLE */}
              <div className="relative group">
                <select required name="cycle_id" onChange={handleChange} className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#cbff00] appearance-none cursor-pointer">
                    <option value="">Choisir Cycle</option>
                    {dbData.cycles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"/>
              </div>

              {/* SELECT LEVEL */}
              <div className="relative group">
                <select required name="level_id" onChange={handleChange} disabled={!formData.cycle_id} className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#cbff00] appearance-none disabled:opacity-30">
                    <option value="">Choisir Niveau</option>
                    {dbData.levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"/>
              </div>

              {/* SELECT FILIERE */}
              <div className="relative group md:col-span-2">
                <select required name="filiere_id" onChange={handleChange} disabled={!formData.level_id} className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#cbff00] appearance-none disabled:opacity-30">
                    <option value="">Choisir Filière</option>
                    {dbData.filieres.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"/>
              </div>
            </>
          )}

          <input required name="password" type="password" placeholder="Mot de passe" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#673ee5] md:col-span-2" onChange={handleChange} />
        </div>

        <button disabled={loading} className="w-full bg-[#cbff00] text-black font-black py-5 rounded-[2.5rem] uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
          {loading ? <Loader2 className="animate-spin" /> : <>Confirmer <ArrowRight size={20}/></>}
        </button>
      </form>
    </div>
  );
}


// import React, { useState } from "react";
// import axios from "axios";
// import { User, Mail, Lock, GraduationCap, School, ArrowRight, Loader2, AlertCircle, Inbox, Layers, BookOpen } from "lucide-react";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "student",
//     level_id: "", // Ajouté pour le secrétariat
//     filiere_id: "" // Ajouté pour le secrétariat
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Vérification basique pour les étudiants
//     if (formData.role === "student" && (!formData.level_id || !formData.filiere_id)) {
//       setError("Veuillez sélectionner votre niveau et votre filière.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:8000/users/register", formData);
//       if (response.status === 201 || response.status === 200) {
//         setIsSubmitted(true);
//       }
//     } catch (err) {
//       setError(err.response?.data?.detail || "Erreur lors de l'inscription");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isSubmitted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
//         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full" />
//         <div className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 text-center space-y-8 relative z-10 shadow-2xl animate-in zoom-in duration-500">
//           <div className="w-20 h-20 bg-[#cbff00]/10 border border-[#cbff00]/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(203,255,0,0.1)]">
//             <Inbox size={40} className="text-[#cbff00]" />
//           </div>
//           <div className="space-y-4">
//             <h2 className="text-3xl font-black uppercase italic tracking-tighter">Inscription réussie</h2>
//             <p className="text-gray-400 text-sm leading-relaxed">
//               Ton compte a été créé avec succès. <br />
//               <span className="text-[#cbff00] font-bold">Note :</span> Ton accès doit être validé par le secrétariat avant de pouvoir te connecter.
//             </p>
//           </div>
//           <button onClick={() => window.location.href = "/login"} className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-white/10">
//             Retour à la connexion
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
//       <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#673ee5]/10 blur-[120px] rounded-full pointer-events-none" />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full pointer-events-none" />

//       <form onSubmit={handleSubmit} className="w-full max-w-2xl backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 relative z-10 shadow-2xl">
//         <div className="text-center space-y-2">
//           <h1 className="text-4xl font-black uppercase tracking-tighter italic">Inscription</h1>
//           <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Rejoins la plateforme maintenant</p>
//         </div>

//         {error && (
//           <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-black uppercase tracking-widest animate-shake">
//             <AlertCircle size={18} /> {error}
//           </div>
//         )}

//         <div className="grid grid-cols-2 gap-4">
//           <button type="button" onClick={() => setFormData({...formData, role: "student"})} className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "student" ? "bg-[#cbff00]/10 border-[#cbff00] text-[#cbff00]" : "bg-white/5 border-transparent text-gray-500"}`}>
//             <GraduationCap size={28} />
//             <span className="text-[10px] font-black uppercase tracking-widest">Étudiant</span>
//           </button>
//           <button type="button" onClick={() => setFormData({...formData, role: "teacher"})} className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "teacher" ? "bg-[#673ee5]/10 border-[#673ee5] text-[#673ee5]" : "bg-white/5 border-transparent text-gray-500"}`}>
//             <School size={28} />
//             <span className="text-[10px] font-black uppercase tracking-widest">Enseignant</span>
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Username</label>
//             <div className="relative group">
//               <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00]" />
//               <input required name="username" type="text" value={formData.username} onChange={handleChange} placeholder="Pseudo" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] text-sm font-bold" />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email</label>
//             <div className="relative group">
//               <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00]" />
//               <input required name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@exemple.com" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] text-sm font-bold" />
//             </div>
//           </div>

//           {/* Champs spécifiques aux étudiants (Niveau et Filière) */}
//           {formData.role === "student" && (
//             <>
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Niveau d'étude</label>
//                 <div className="relative group">
//                   <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00]" />
//                   <select required name="level_id" value={formData.level_id} onChange={handleChange} className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] text-sm font-bold appearance-none">
//                     <option value="">Sélectionner un niveau</option>
//                     <option value="1">1ère Année (L1)</option>
//                     <option value="2">2ème Année (L2)</option>
//                     <option value="3">3ème Année (L3)</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Filière</label>
//                 <div className="relative group">
//                   <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00]" />
//                   <select required name="filiere_id" value={formData.filiere_id} onChange={handleChange} className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] text-sm font-bold appearance-none">
//                     <option value="">Sélectionner une filière</option>
//                     <option value="1">Informatique de Gestion</option>
//                     <option value="2">Marketing & Digital</option>
//                     <option value="3">Comptabilité & Finance</option>
//                   </select>
//                 </div>
//               </div>
//             </>
//           )}

//           <div className="space-y-2 md:col-span-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Mot de passe</label>
//             <div className="relative group">
//               <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#673ee5]" />
//               <input required name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••••••" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#673ee5] text-sm font-bold" />
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4 pt-2">
//           <button disabled={loading} className="w-full bg-gradient-to-r from-[#cbff00] to-green-400 text-black font-black py-5 rounded-[2.5rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50">
//             {loading ? <Loader2 size={20} className="animate-spin" /> : <>Confirmer l'inscription <ArrowRight size={20}/></>}
//           </button>
//           <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
//             Déjà inscrit ? <a href="/login" className="text-[#cbff00] hover:text-white transition-colors ml-2 border-b border-[#cbff00] pb-0.5">Se connecter</a>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import axios from "axios";
// import { User, Mail, Lock, GraduationCap, School, ArrowRight, Loader2, AlertCircle, Inbox } from "lucide-react";

// export default function Register() {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     role: "student"
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (error) setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Appel au backend sur le port 8000
//       const response = await axios.post("http://localhost:8000/users/register", formData);
//       console.log("DONNEES RECUES: ", response.data)

//       if (response.status === 201 || response.status === 200) {
//         setIsSubmitted(true);
//       }
//     } catch (err) {
//       if (!err.response) {
//         setError("Le serveur est inaccessible.");
//       } else {
//         setError(err.response?.data?.message || "Erreur lors de l'inscription");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (isSubmitted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
//         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full" />
//         <div className="w-full max-w-md backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 text-center space-y-8 relative z-10 shadow-2xl animate-in zoom-in duration-500">
//           <div className="w-20 h-20 bg-[#cbff00]/10 border border-[#cbff00]/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(203,255,0,0.1)]">
//             <Inbox size={40} className="text-[#cbff00]" />
//           </div>
//           <div className="space-y-4">
//             <h2 className="text-3xl font-black uppercase italic tracking-tighter">Vérifie tes emails</h2>
//             <p className="text-gray-400 text-sm leading-relaxed">
//               Un lien de confirmation a été envoyé à <br />
//               <span className="text-white font-bold">{formData.email}</span>. <br />
//               Clique sur le lien pour activer ton compte.
//             </p>
//           </div>
//           <div className="pt-4">
//             <button 
//               onClick={() => window.location.href = "/login"}
//               className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-white/10"
//             >
//               Retour à la connexion
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] p-4 text-white relative overflow-hidden font-sans">
//       <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#673ee5]/10 blur-[120px] rounded-full pointer-events-none" />
//       <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#cbff00]/10 blur-[120px] rounded-full pointer-events-none" />

//       <form 
//         onSubmit={handleSubmit}
//         className="w-full max-w-xl backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 relative z-10 shadow-2xl"
//       >
//         <div className="text-center space-y-2">
//           <h1 className="text-4xl font-black uppercase tracking-tighter italic">Inscription</h1>
//           <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Rejoins la plateforme maintenant</p>
//         </div>

//         {error && (
//           <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-black uppercase tracking-widest animate-shake">
//             <AlertCircle size={18} /> {error}
//           </div>
//         )}

//         {/* Sélection du rôle */}
//         <div className="grid grid-cols-2 gap-4">
//           <button
//             type="button" 
//             onClick={() => setFormData({...formData, role: "student"})}
//             className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "student" ? "bg-[#cbff00]/10 border-[#cbff00] text-[#cbff00]" : "bg-white/5 border-transparent text-gray-500"}`}
//           >
//             <GraduationCap size={28} />
//             <span className="text-[10px] font-black uppercase tracking-widest">Étudiant</span>
//           </button>
//           <button
//             type="button" 
//             onClick={() => setFormData({...formData, role: "teacher"})}
//             className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.role === "teacher" ? "bg-[#673ee5]/10 border-[#673ee5] text-[#673ee5]" : "bg-white/5 border-transparent text-gray-500"}`}
//           >
//             <School size={28} />
//             <span className="text-[10px] font-black uppercase tracking-widest">Enseignant</span>
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Username</label>
//             <div className="relative group">
//               <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
//               <input required name="username" type="text" value={formData.username} onChange={handleChange} placeholder="Pseudo" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] transition-all text-sm font-bold" />
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email</label>
//             <div className="relative group">
//               <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
//               <input required name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@exemple.com" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#cbff00] transition-all text-sm font-bold" />
//             </div>
//           </div>
//           <div className="space-y-2 md:col-span-2">
//             <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Mot de passe</label>
//             <div className="relative group">
//               <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#673ee5] transition-colors" />
//               <input required name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••••••" className="w-full bg-[#121214] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#673ee5] transition-all text-sm font-bold" />
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4 pt-2">
//           <button 
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-[#cbff00] to-green-400 text-black font-black py-5 rounded-[2.5rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
//           >
//             {loading ? <Loader2 size={20} className="animate-spin" /> : <>Confirmer l'inscription <ArrowRight size={20}/></>}
//           </button>

//           {/* AJOUT DU BOUTON SE CONNECTER */}
//           <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">
//             Déjà inscrit ? 
//             <a href="/login" className="text-[#cbff00] hover:text-white transition-colors ml-2 border-b border-[#cbff00] pb-0.5">
//               Se connecter
//             </a>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// }