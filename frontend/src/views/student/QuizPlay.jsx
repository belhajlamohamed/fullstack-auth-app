import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronLeft, Loader2, Award, Home, Trophy, CheckCircle2 } from "lucide-react";
import api from "../../api/axios";
import { MathRenderer } from "../../components/MathRenderer"; // Import du moteur LaTeX

export default function QuizPlay({ quizId, onClose }) {
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${quizId}`);
        console.log(res.data);
        setQuiz(res.data);
      } catch (err) {
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };
    if (quizId) fetchQuiz();
  }, [quizId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([qId, oId]) => ({
          question_id: parseInt(qId),
          option_id: oId
        }))
      };
      // On envoie les réponses au backend
      const response = await api.post(`/quizzes/${quizId}/submit`, payload);
      // Le backend renvoie maintenant : { score, correct_answers, total_questions }
      setResult(response.data); 
    } catch (err) {
      console.error("Erreur soumission:", err);
      alert("Une erreur est survenue lors de l'envoi de vos réponses.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return createPortal(
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#cbff00]" size={40} />
    </div>,
    document.body
  );

  const currentQuestion = quiz?.questions[currentIndex];

  return createPortal(
    <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-2 md:p-4">
      {/* Container principal avec limitation de hauteur pour éviter le scroll excessif */}
      <div className="w-full max-w-3xl bg-[#0a0a0c] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl max-h-[95vh] animate-in zoom-in duration-300">
        
        {/* HEADER COMPACT */}
        <div className="px-6 py-4 border-b border-white/5 bg-[#111114] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">
              {result ? "Session Terminée" : `Question ${currentIndex + 1} / ${quiz?.questions?.length}`}
            </span>
            <span className="text-base font-black italic text-white truncate max-w-[200px] md:max-w-none">
              {result ? "Bilan de performance" : quiz?.title}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* CONTENU (Questions ou Résultats) */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {result ? (
            /* --- VUE RÉSULTATS DANS LE MODAL --- */
            <div className="flex flex-col items-center text-center space-y-8 animate-in slide-in-from-bottom-10 duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-[#cbff00]/10 blur-3xl rounded-full"></div>
                <Trophy size={64} className="text-[#cbff00] relative z-10" />
              </div>

              <div>
                <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">
                  {result.score >= 10 ? "Excellent Travail !" : "Bien essayé !"}
                </h2>
                <p className="text-gray-500 font-bold text-[9px] uppercase tracking-widest mt-2 px-4 py-1.5 bg-white/5 rounded-full inline-block">
                  Statistiques de réussite
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <span className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Note</span>
                  <p className="text-4xl font-black text-[#cbff00] italic">{result.score}<span className="text-xs text-gray-600 ml-1">/20</span></p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                  <span className="text-[8px] font-black text-gray-500 uppercase mb-1 block">Précision</span>
                  <p className="text-4xl font-black text-white italic">{result.correct_answers}<span className="text-xs text-gray-600 ml-1">/{result.total_questions}</span></p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl"
              >
                <Home size={16} /> Retour au tableau de bord
              </button>
            </div>
          ) : (
            /* --- VUE QUESTIONS --- */
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Question avec support LaTeX */}
              <h3 className="text-xl md:text-2xl font-black italic text-white leading-tight">
                <MathRenderer text={currentQuestion?.text} />
              </h3>

              {/* Options avec support LaTeX */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion?.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option.id })}
                    className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group
                      ${answers[currentQuestion.id] === option.id 
                        ? "bg-[#cbff00] border-[#cbff00] text-black shadow-[0_0_20px_rgba(203,255,0,0.15)]" 
                        : "bg-white/5 border-white/10 text-white hover:bg-white/[0.08]"}`}
                  >
                    <span className="font-bold text-sm">
                      <MathRenderer text={option.text} />
                    </span>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                      ${answers[currentQuestion.id] === option.id ? "border-black/20 bg-black/10 text-black" : "border-white/10 bg-white/5 text-transparent"}`}
                    >
                      <CheckCircle2 size={14} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER (Caché si résultats affichés) */}
        {!result && (
          <div className="px-6 py-5 border-t border-white/5 bg-[#111114] flex justify-between items-center">
            <button 
              onClick={() => setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="text-gray-500 font-black uppercase text-[9px] tracking-widest disabled:opacity-0 flex items-center gap-1 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} /> Précédent
            </button>

            {currentIndex === quiz?.questions?.length - 1 ? (
              <button 
                onClick={handleSubmit}
                disabled={!answers[currentQuestion?.id] || submitting}
                className="bg-[#cbff00] text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />}
                {submitting ? "Correction..." : "Terminer le test"}
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIndex(currentIndex + 1)}
                disabled={!answers[currentQuestion?.id]}
                className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                Suivant <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}


// import React, { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { X, ChevronRight, ChevronLeft, Loader2, Award, Home, Trophy, CheckCircle2 } from "lucide-react";
// import api from "../../api/axios";

// export default function QuizPlay({ quizId, onClose }) {
//   const [quiz, setQuiz] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [result, setResult] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const res = await api.get(`/quizzes/${quizId}`);
//         setQuiz(res.data);
//       } catch (err) {
//         console.error("Erreur API:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (quizId) fetchQuiz();
//   }, [quizId]);

//   const handleSubmit = async () => {
//     setSubmitting(true);
//     try {
//       const payload = {
//         answers: Object.entries(answers).map(([qId, oId]) => ({
//           question_id: parseInt(qId),
//           option_id: oId
//         }))
//       };
//       const response = await api.post(`/quizzes/${quizId}/submit`, payload);
//       setResult(response.data); // On bascule vers l'affichage du score
//     } catch (err) {
//       console.error("Erreur soumission:", err);
//       alert("Erreur lors de l'envoi des réponses.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return createPortal(
//     <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center">
//       <Loader2 className="animate-spin text-[#cbff00]" size={40} />
//     </div>,
//     document.body
//   );
  

//   const currentQuestion = quiz?.questions[currentIndex];

//   return createPortal(
//     <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-2 md:p-4">
//       <div className="w-full max-w-3xl bg-[#0a0a0c] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
        
//         {/* Header - Plus compact */}
//         <div className="px-6 py-4 border-b border-white/5 bg-[#111114] flex items-center justify-between">
//           <div className="flex flex-col">
//             <span className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">
//               {result ? "Bilan Final" : `Question ${currentIndex + 1} / ${quiz?.questions.length}`}
//             </span>
//             <span className="text-base font-black italic text-white truncate max-w-[200px]">
//               {result ? "Score de la session" : quiz?.title}
//             </span>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all text-gray-500 hover:text-white">
//             <X size={18} />
//           </button>
//         </div>

//         {/* Corps du Modal */}
//         <div className="flex-1 overflow-y-auto p-6 md:p-8">
//           {result ? (
//             /* =========================================
//                VUE RÉSULTATS (DANS LE MODAL)
//                ========================================= */
//             <div className="flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-300">
//               <div className="p-4 bg-[#cbff00]/10 rounded-full">
//                 <Trophy size={48} className="text-[#cbff00]" />
//               </div>
              
//               <div>
//                 <h2 className="text-2xl font-black italic text-white uppercase italic tracking-tighter">Félicitations !</h2>
//                 <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Quiz terminé avec succès</p>
//               </div>

//               <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
//                 <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
//                   <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Score</p>
//                   <p className="text-3xl font-black text-[#cbff00] italic">{result.score}/20</p>
//                 </div>
//                 <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
//                   <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Réponses</p>
//                   <p className="text-3xl font-black text-white italic">{result.correct_answers}/{result.total_questions}</p>
//                 </div>
//               </div>

//               <button 
//                 onClick={onClose}
//                 className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2"
//               >
//                 <Home size={14} /> Quitter
//               </button>
//             </div>
//           ) : (
//             /* =========================================
//                VUE QUESTION (PLUS COMPACTE)
//                ========================================= */
//             <div className="space-y-6 animate-in fade-in duration-300">
//               <h3 className="text-xl font-black italic text-white leading-tight">
//                 {currentQuestion?.text}
//               </h3>

//               <div className="grid grid-cols-1 gap-3">
//                 {currentQuestion?.options.map((option) => (
//                   <button
//                     key={option.id}
//                     onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option.id })}
//                     className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group
//                       ${answers[currentQuestion.id] === option.id 
//                         ? "bg-[#cbff00] border-[#cbff00] text-black" 
//                         : "bg-white/5 border-white/10 text-white hover:bg-white/[0.08]"}`}
//                   >
//                     <span className="font-bold text-sm">{option.text}</span>
//                     <div className={`w-5 h-5 rounded-full border flex items-center justify-center
//                       ${answers[currentQuestion.id] === option.id ? "border-black/20 bg-black/10" : "border-white/20 bg-white/5"}`}
//                     >
//                       {answers[currentQuestion.id] === option.id && <CheckCircle2 size={12} />}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer - Cache si les résultats sont affichés */}
//         {!result && (
//           <div className="px-6 py-4 border-t border-white/5 bg-[#111114] flex justify-between">
//             <button 
//               onClick={() => setCurrentIndex(currentIndex - 1)}
//               disabled={currentIndex === 0}
//               className="text-gray-500 font-black uppercase text-[9px] tracking-widest disabled:opacity-0 flex items-center gap-1 hover:text-white"
//             >
//               <ChevronLeft size={14} /> Retour
//             </button>

//             {currentIndex === quiz?.questions.length - 1 ? (
//               <button 
//                 onClick={handleSubmit}
//                 disabled={!answers[currentQuestion?.id] || submitting}
//                 className="bg-[#cbff00] text-black px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
//               >
//                 {submitting ? <Loader2 size={14} className="animate-spin" /> : <Award size={14} />}
//                 {submitting ? "Correction..." : "Terminer"}
//               </button>
//             ) : (
//               <button 
//                 onClick={() => setCurrentIndex(currentIndex + 1)}
//                 disabled={!answers[currentQuestion?.id]}
//                 className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
//               >
//                 Suivant <ChevronRight size={14} />
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>,
//     document.body
//   );
// }

// import React, { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { X, ChevronRight, ChevronLeft, Loader2, Award, Home, Trophy, CheckCircle2 } from "lucide-react";
// import api from "../../api/axios";

// export default function QuizPlay({ quizId, onClose }) {
//   const [quiz, setQuiz] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [result, setResult] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const res = await api.get(`/quizzes/${quizId}`);
//         setQuiz(res.data);
//       } catch (err) {
//         console.error("Erreur API:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (quizId) fetchQuiz();
//   }, [quizId]);

//   const handleSubmit = async () => {
//     setSubmitting(true);
//     try {
//       const payload = {
//         answers: Object.entries(answers).map(([qId, oId]) => ({
//           question_id: parseInt(qId),
//           option_id: oId
//         }))
//       };
//       const response = await api.post(`/quizzes/${quizId}/submit`, payload);
//       setResult(response.data);
//     } catch (err) {
//       console.error("Erreur soumission:", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return createPortal(
//     <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center">
//       <Loader2 className="animate-spin text-[#cbff00]" size={40} />
//     </div>,
//     document.body
//   );

//   const currentQuestion = quiz?.questions[currentIndex];

//   return createPortal(
//     <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-2 md:p-4">
//       {/* Réduction de la hauteur max du modal pour éviter le scroll infini */}
//       <div className="w-full max-w-4xl max-h-[95vh] bg-[#0a0a0c] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
        
//         {/* --- Header plus compact --- */}
//         <div className="px-6 py-4 border-b border-white/5 bg-[#111114] flex items-center justify-between">
//           <div className="flex flex-col">
//             <span className="text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">
//               {result ? "Bilan" : `Question ${currentIndex + 1}/${quiz?.questions?.length}`}
//             </span>
//             <span className="text-lg font-black italic text-white truncate max-w-[250px] md:max-w-none">
//               {result ? "Score Final" : quiz?.title}
//             </span>
//           </div>
//           <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all text-gray-500 hover:text-white">
//             <X size={18} />
//           </button>
//         </div>

//         {/* --- Corps avec espacements réduits --- */}
//         <div className="flex-1 overflow-y-auto p-6 md:p-10">
//           {result ? (
//             /* VUE RÉSULTATS COMPACTE */
//             <div className="flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-300">
//               <Trophy size={60} className="text-[#cbff00]" />
//               <div>
//                 <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Résultats</h2>
//                 <div className="mt-4 grid grid-cols-2 gap-4 w-full max-w-sm">
//                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
//                     <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Score</p>
//                     <p className="text-3xl font-black text-[#cbff00] italic">{result.score}/20</p>
//                   </div>
//                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
//                     <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Justes</p>
//                     <p className="text-3xl font-black text-white italic">{result.correct_answers}/{result.total_questions}</p>
//                   </div>
//                 </div>
//               </div>
//               <button onClick={onClose} className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
//                 Fermer
//               </button>
//             </div>
//           ) : (
//             /* VUE QUESTION COMPACTE */
//             <div className="space-y-6 animate-in fade-in duration-300">
//               {/* Titre de question réduit */}
//               <h3 className="text-xl md:text-2xl font-black italic text-white leading-snug">
//                 {currentQuestion?.text}
//               </h3>

//               {/* Grille d'options plus serrée */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 {currentQuestion?.options.map((option) => (
//                   <button
//                     key={option.id}
//                     onClick={() => setAnswers({ ...answers, [currentQuestion.id]: option.id })}
//                     className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between
//                       ${answers[currentQuestion.id] === option.id 
//                         ? "bg-[#cbff00] border-[#cbff00] text-black" 
//                         : "bg-white/5 border-white/10 text-white hover:bg-white/[0.08]"}`}
//                   >
//                     <span className="font-bold text-sm leading-tight pr-2">{option.text}</span>
//                     <div className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center
//                       ${answers[currentQuestion.id] === option.id ? "border-black/20 bg-black/10" : "border-white/20 bg-white/5"}`}
//                     >
//                       {answers[currentQuestion.id] === option.id && <CheckCircle2 size={12} />}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* --- Footer plus fin --- */}
//         {!result && (
//           <div className="px-6 py-4 border-t border-white/5 bg-[#111114] flex justify-between items-center">
//             <button 
//               onClick={() => setCurrentIndex(currentIndex - 1)}
//               disabled={currentIndex === 0}
//               className="text-gray-500 font-black uppercase text-[9px] tracking-widest disabled:opacity-0 flex items-center gap-1 hover:text-white"
//             >
//               <ChevronLeft size={14} /> Précédent
//             </button>

//             {currentIndex === quiz?.questions?.length - 1 ? (
//               <button 
//                 onClick={handleSubmit}
//                 disabled={!answers[currentQuestion?.id] || submitting}
//                 className="bg-[#cbff00] text-black px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:scale-105 disabled:opacity-50"
//               >
//                 {submitting ? "Correction..." : "Terminer"}
//               </button>
//             ) : (
//               <button 
//                 onClick={() => setCurrentIndex(currentIndex + 1)}
//                 disabled={!answers[currentQuestion?.id]}
//                 className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase text-[9px] tracking-widest hover:scale-105"
//               >
//                 Suivant <ChevronRight size={14} />
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>,
//     document.body
//   );
// }
// import React, { useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { X, ChevronRight, ChevronLeft, Loader2, Award, Home, Timer, CheckCircle2 } from "lucide-react";
// import api from "../../api/axios";

// export default function QuizPlay({ quizId, onClose }) {
//   const [quiz, setQuiz] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [result, setResult] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const res = await api.get(`/quizzes/${quizId}`);
//         setQuiz(res.data);
//       } catch (err) {
//         console.error("Erreur API:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (quizId) fetchQuiz();
//   }, [quizId]);

//   const handleSubmit = async () => {
//     setSubmitting(true);
//     try {
//       const payload = {
//         answers: Object.entries(answers).map(([qId, oId]) => ({
//           question_id: parseInt(qId),
//           option_id: oId
//         }))
//       };
//       const response = await api.post(`/quizzes/${quizId}/submit`, payload);
//       setResult(response.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // 1. SÉCURITÉ CHARGEMENT
//   if (loading) return (
//     <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[999999] flex items-center justify-center">
//       <Loader2 className="animate-spin text-[#cbff00]" size={40} />
//     </div>
//   );

//   // 2. SÉCURITÉ DONNÉES (Empêche l'erreur ReferenceError)
//   if (!quiz || !quiz.questions) return null;

//   const currentQuestion = quiz.questions[currentIndex];
//   const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

//   const modalContent = (
//     <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
//       <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={!result ? onClose : undefined}></div>

//       <div className="relative bg-[#0a0a0c] border border-white/10 w-full max-w-3xl max-h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        
//         {/* Header */}
//         <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#111114]">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-[#cbff00] rounded-xl text-black shadow-[0_0_15px_rgba(203,255,0,0.3)]">
//               <Timer size={18} />
//             </div>
//             <h2 className="text-white font-black uppercase italic text-xs">{quiz.title}</h2>
//           </div>
//           <button onClick={onClose} className="p-2 text-gray-500 hover:text-white"><X size={20} /></button>
//         </div>

//         {/* Contenu */}
//         <div className="flex-1 overflow-y-auto p-8 flex flex-col">
//           {result ? (
//             <div className="my-auto text-center space-y-6">
//               <div className="bg-[#cbff00] p-6 rounded-[2rem] inline-block"><Award size={40} className="text-black" /></div>
//               <h3 className="text-6xl font-black text-white italic">{result.score}%</h3>
//               <button onClick={onClose} className="bg-white/5 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px]">Dashboard</button>
//             </div>
//           ) : (
//             <div className="my-auto space-y-8">
//               <div className="flex items-center gap-4">
//                 <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
//                   <div className="h-full bg-[#cbff00] transition-all" style={{ width: `${progress}%` }} />
//                 </div>
//                 <span className="text-[9px] font-black text-gray-600 uppercase">{currentIndex + 1}/{quiz.questions.length}</span>
//               </div>

//               <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter text-center">
//                 {currentQuestion.text}
//               </h3>

//               <div className="grid gap-3">
//                 {currentQuestion.options.map((opt) => (
//                   <button
//                     key={opt.id}
//                     onClick={() => setAnswers({...answers, [currentQuestion.id]: opt.id})}
//                     className={`w-full p-5 rounded-2xl text-left font-bold uppercase italic text-xs transition-all border-2 flex justify-between items-center ${
//                       answers[currentQuestion.id] === opt.id 
//                       ? "bg-[#cbff00] border-[#cbff00] text-black shadow-lg" 
//                       : "bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/10"
//                     }`}
//                   >
//                     <span>{opt.text}</span>
//                     {answers[currentQuestion.id] === opt.id && <CheckCircle2 size={16} />}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         {!result && (
//           <div className="p-5 border-t border-white/5 bg-[#111114] flex justify-between">
//             <button 
//               onClick={() => setCurrentIndex(currentIndex - 1)}
//               disabled={currentIndex === 0}
//               className="text-gray-500 font-black uppercase text-[10px] disabled:opacity-0 flex items-center gap-1"
//             >
//               <ChevronLeft size={16} /> Retour
//             </button>
//             {currentIndex === quiz.questions.length - 1 ? (
//               <button 
//                 onClick={handleSubmit}
//                 disabled={!answers[currentQuestion.id] || submitting}
//                 className="bg-[#cbff00] text-black px-10 py-3.5 rounded-xl font-black uppercase text-[10px]"
//               >
//                 {submitting ? "..." : "Terminer"}
//               </button>
//             ) : (
//               <button 
//                 onClick={() => setCurrentIndex(currentIndex + 1)}
//                 disabled={!answers[currentQuestion.id]}
//                 className="bg-white text-black px-10 py-3.5 rounded-xl font-black uppercase text-[10px] flex items-center gap-1"
//               >
//                 Suivant <ChevronRight size={16} />
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return createPortal(modalContent, document.body);
// }