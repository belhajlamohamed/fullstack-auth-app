import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight, ChevronLeft, Loader2, Award, Home, Timer, CheckCircle2 } from "lucide-react";
import api from "../../api/axios";

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
      const response = await api.post(`/quizzes/${quizId}/submit`, payload);
      setResult(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 1. SÉCURITÉ CHARGEMENT
  if (loading) return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[999999] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#cbff00]" size={40} />
    </div>
  );

  // 2. SÉCURITÉ DONNÉES (Empêche l'erreur ReferenceError)
  if (!quiz || !quiz.questions) return null;

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  const modalContent = (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={!result ? onClose : undefined}></div>

      <div className="relative bg-[#0a0a0c] border border-white/10 w-full max-w-3xl max-h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#111114]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#cbff00] rounded-xl text-black shadow-[0_0_15px_rgba(203,255,0,0.3)]">
              <Timer size={18} />
            </div>
            <h2 className="text-white font-black uppercase italic text-xs">{quiz.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white"><X size={20} /></button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col">
          {result ? (
            <div className="my-auto text-center space-y-6">
              <div className="bg-[#cbff00] p-6 rounded-[2rem] inline-block"><Award size={40} className="text-black" /></div>
              <h3 className="text-6xl font-black text-white italic">{result.score}%</h3>
              <button onClick={onClose} className="bg-white/5 text-white px-8 py-4 rounded-xl font-black uppercase text-[10px]">Dashboard</button>
            </div>
          ) : (
            <div className="my-auto space-y-8">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#cbff00] transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[9px] font-black text-gray-600 uppercase">{currentIndex + 1}/{quiz.questions.length}</span>
              </div>

              <h3 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter text-center">
                {currentQuestion.text}
              </h3>

              <div className="grid gap-3">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers({...answers, [currentQuestion.id]: opt.id})}
                    className={`w-full p-5 rounded-2xl text-left font-bold uppercase italic text-xs transition-all border-2 flex justify-between items-center ${
                      answers[currentQuestion.id] === opt.id 
                      ? "bg-[#cbff00] border-[#cbff00] text-black shadow-lg" 
                      : "bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/10"
                    }`}
                  >
                    <span>{opt.text}</span>
                    {answers[currentQuestion.id] === opt.id && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div className="p-5 border-t border-white/5 bg-[#111114] flex justify-between">
            <button 
              onClick={() => setCurrentIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="text-gray-500 font-black uppercase text-[10px] disabled:opacity-0 flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Retour
            </button>
            {currentIndex === quiz.questions.length - 1 ? (
              <button 
                onClick={handleSubmit}
                disabled={!answers[currentQuestion.id] || submitting}
                className="bg-[#cbff00] text-black px-10 py-3.5 rounded-xl font-black uppercase text-[10px]"
              >
                {submitting ? "..." : "Terminer"}
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIndex(currentIndex + 1)}
                disabled={!answers[currentQuestion.id]}
                className="bg-white text-black px-10 py-3.5 rounded-xl font-black uppercase text-[10px] flex items-center gap-1"
              >
                Suivant <ChevronRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}