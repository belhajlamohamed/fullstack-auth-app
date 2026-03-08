import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Save, Plus, Trash2, CheckCircle2, Layout, Loader2 } from "lucide-react";
import api from "../../api/axios";

export default function CreateQuizModal({ isOpen, onClose, onSuccess, editingQuiz = null }) {
  const [subjects, setSubjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction pour générer une structure de question par défaut avec 4 options
  const generateDefaultQuestion = () => ({
    text: "",
    options: [
      { text: "", is_correct: true },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ]
  });

  const [formData, setFormData] = useState({
    title: "",
    subject_id: "",
    questions: [generateDefaultQuestion()]
  });

  useEffect(() => {
    if (!isOpen) return;
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/quizzes/subjects");
        setSubjects(res.data);
        if (editingQuiz) {
          setFormData({
            title: editingQuiz.title,
            subject_id: editingQuiz.subject_id,
            questions: editingQuiz.questions
          });
        } else if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, subject_id: res.data[0].id }));
        }
      } catch (err) { console.error("Erreur sujets:", err); }
    };
    fetchSubjects();
  }, [isOpen, editingQuiz]);

  // --- GESTION DES QUESTIONS ---
const addQuestion = () => {
  setFormData({ 
    ...formData, 
    // On place la nouvelle question AU DÉBUT du tableau
    questions: [generateDefaultQuestion(), ...formData.questions] 
  });
};

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updated = formData.questions.filter((_, i) => i !== index);
      setFormData({ ...formData, questions: updated });
    }
  };

  const updateQuestionText = (index, val) => {
    const updated = [...formData.questions];
    updated[index].text = val;
    setFormData({ ...formData, questions: updated });
  };

  // --- GESTION DES OPTIONS ---
  const updateOptionText = (qIdx, oIdx, val) => {
    const updated = [...formData.questions];
    updated[qIdx].options[oIdx].text = val;
    setFormData({ ...formData, questions: updated });
  };

  const setCorrectOption = (qIdx, oIdx) => {
    const updated = [...formData.questions];
    updated[qIdx].options = updated[qIdx].options.map((opt, i) => ({
      ...opt,
      is_correct: i === oIdx
    }));
    setFormData({ ...formData, questions: updated });
  };

// Dans ta fonction handleSubmit de CreateQuizModal.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    if (editingQuiz && editingQuiz.id) {
      // SI UN ID EXISTE -> UPDATE (PUT)
      await api.put(`/quizzes/${editingQuiz.id}`, formData);
    } else {
      // SINON -> CRÉATION (POST)
      await api.post("/quizzes/create", formData);
    }
    
    onSuccess(); // Rafraîchir la liste des quiz
    onClose();   // Fermer la modal
  } catch (err) {
    alert("Erreur lors de l'enregistrement");
  } finally {
    setIsSubmitting(false);
  }
};

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#111114] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#cbff00] rounded-xl text-black">
              <Plus size={20} strokeWidth={3} />
            </div>
            <h2 className="text-white font-black uppercase italic tracking-tight">
              {editingQuiz ? "Modifier le Quiz" : "Nouveau Quiz"}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-8 custom-scrollbar flex-1">
          
          {/* Section 1: Infos de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Titre du quiz</label>
              <input 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-[#cbff00]/50 outline-none transition-all"
                placeholder="Ex: Calcul sur la multiplication"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Matière</label>
              <select 
                value={formData.subject_id}
                onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none cursor-pointer"
              >
                {subjects.map(s => <option key={s.id} value={s.id} className="bg-[#111114]">{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Section 2: Questions */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-xs font-black uppercase text-[#cbff00] italic">Questions ({formData.questions.length})</h3>
              <button 
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#cbff00] bg-[#cbff00]/10 px-3 py-1.5 rounded-lg hover:bg-[#cbff00]/20 transition-all"
              >
                <Plus size={14} /> Ajouter une question
              </button>
            </div>

            {formData.questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-white/[0.02] border border-white/5 p-5 rounded-3xl space-y-4 relative group">
                {formData.questions.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeQuestion(qIdx)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-gray-600 uppercase">Question {qIdx + 1}</label>
                  <input 
                    required
                    value={q.text}
                    onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 pb-2 text-white text-sm outline-none focus:border-[#cbff00] transition-all"
                    placeholder="Énoncez votre question..."
                  />
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, oIdx) => (
                    <div 
                      key={oIdx} 
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${opt.is_correct ? 'bg-[#cbff00]/10 border-[#cbff00]/30' : 'bg-white/5 border-white/5'}`}
                    >
                      <button 
                        type="button"
                        onClick={() => setCorrectOption(qIdx, oIdx)}
                        className={`p-1.5 rounded-lg transition-all ${opt.is_correct ? 'bg-[#cbff00] text-black' : 'bg-white/10 text-gray-500'}`}
                      >
                        <CheckCircle2 size={14} />
                      </button>
                      <input 
                        required
                        value={opt.text}
                        onChange={(e) => updateOptionText(qIdx, oIdx, e.target.value)}
                        className="bg-transparent text-xs text-white outline-none w-full"
                        placeholder={`Option ${oIdx + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-[10px] font-bold uppercase text-gray-500 hover:text-white transition-all"
          >
            Annuler
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-[2] bg-[#cbff00] text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> {editingQuiz ? "Mettre à jour" : "Publier le Quiz"}</>}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}



// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
// import { X, Save, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
// import api from "../../api/axios";

// export default function CreateQuizModal({ isOpen, onClose, onSuccess, editingQuiz = null }) {
//   const [subjects, setSubjects] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Initialisation dynamique basée sur editingQuiz
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     subject_id: "",
//     questions: [{ text: "", options: Array(4).fill({ text: "", is_correct: false }).map((o, i) => i === 0 ? {...o, is_correct: true} : o) }]
//   });

//   useEffect(() => {
//     const initModal = async () => {
//       // 1. Charger les matières
//       try {
//         const res = await api.get("/quizzes/subjects");
//         setSubjects(res.data);
        
//         // 2. Si on modifie, on remplit avec les données du quiz
//         if (editingQuiz) {
//           setFormData({
//             title: editingQuiz.title,
//             description: editingQuiz.description || "",
//             subject_id: editingQuiz.subject_id,
//             questions: editingQuiz.questions // Ton backend doit renvoyer les questions imbriquées
//           });
//         } else if (res.data.length > 0) {
//           setFormData(prev => ({ ...prev, subject_id: res.data[0].id }));
//         }
//       } catch (err) { console.error(err); }
//     };
//     if (isOpen) initModal();
//   }, [isOpen, editingQuiz]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       if (editingQuiz) {
//         // ACTION : MISE À JOUR (PUT)
//         await api.put(`/quizzes/${editingQuiz.id}`, formData);
//       } else {
//         // ACTION : CRÉATION (POST)
//         await api.post("/quizzes/create", formData);
//       }
//       onSuccess();
//       onClose();
//     } catch (err) {
//       alert("Erreur: " + (err.response?.data?.detail || "Action impossible"));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Les fonctions updateQuestionText, updateOptionText, etc. restent identiques à la version précédente...
//   // (Incluses ici par souci de complétude)
//   const updateOptionText = (qIdx, oIdx, val) => {
//     const q = [...formData.questions];
//     q[qIdx].options[oIdx].text = val;
//     setFormData({ ...formData, questions: q });
//   };

//   if (!isOpen) return null;

//   return ReactDOM.createPortal(
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
//       <div className="fixed inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
//       <div className="relative w-full max-w-2xl bg-[#0d0d10] border border-white/10 rounded-[2rem] flex flex-col max-h-[90vh]">
//         <div className="p-6 border-b border-white/5 flex justify-between items-center">
//           <h2 className="text-white font-bold uppercase tracking-tight">
//             {editingQuiz ? "Modifier le Quiz" : "Nouveau Quiz"}
//           </h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
//           <input 
//             required 
//             value={formData.title} 
//             onChange={e => setFormData({...formData, title: e.target.value})}
//             placeholder="Titre du quiz"
//             className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#cbff00]/50"
//           />
          
//           <select 
//             value={formData.subject_id} 
//             onChange={e => setFormData({...formData, subject_id: e.target.value})}
//             className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none"
//           >
//             {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//           </select>

//           {/* Rendu des questions ici... */}
//         </form>

//         <div className="p-6 border-t border-white/5 bg-white/[0.01] flex gap-3">
//           <button type="button" onClick={onClose} className="flex-1 text-gray-500 font-bold uppercase text-[10px]">Annuler</button>
//           <button 
//             onClick={handleSubmit}
//             disabled={isSubmitting}
//             className="flex-[2] bg-[#cbff00] text-black py-4 rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2"
//           >
//             {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save size={18}/> {editingQuiz ? "Mettre à jour" : "Publier"}</>}
//           </button>
//         </div>
//       </div>
//     </div>,
//     document.body
//   );
// }