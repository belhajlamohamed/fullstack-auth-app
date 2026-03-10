import React, { useState, useEffect } from "react";
import { X, Sparkles, Loader2, BrainCircuit, BarChart3 } from "lucide-react";
import api from "../../api/axios";

export default function QuizAIModal({ isOpen, onClose, onQuizGenerated }) {
  const [subjects, setSubjects] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    subject_id: "",
    difficulty: "beginner"
  });

  useEffect(() => {
    if (!isOpen) return;
    const fetchSubjects = async () => {
      try {
        const res = await api.get("/quizzes/subjects");
        setSubjects(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, subject_id: res.data[0].id }));
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des sujets", err);
      }
    };
    fetchSubjects();
  }, [isOpen]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      // Préparation en x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append("topic", formData.topic);
      params.append("subject_id", formData.subject_id);
      params.append("difficulty", formData.difficulty);

      const response = await api.post("/quizzes/generate", params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
      onQuizGenerated(response.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération. Vérifiez votre clé API Gemini.");
    } finally {
      setGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="bg-[#0f0f12] border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#cbff00]/10 rounded-lg text-[#cbff00]">
              <BrainCircuit size={20} />
            </div>
            <h2 className="text-white font-black uppercase italic text-sm tracking-tighter">AI Quiz Architect</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="p-8 space-y-6">
          {generating ? (
            <div className="py-12 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <Loader2 className="animate-spin text-[#cbff00] absolute inset-0 w-full h-full" size={80} strokeWidth={1} />
                <Sparkles className="text-white absolute inset-0 m-auto animate-pulse" size={30} />
              </div>
              <div className="space-y-2">
                <p className="text-white font-black uppercase italic text-lg tracking-tighter">Génération en cours...</p>
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em]">Gemini analyse le sujet et crée les questions</p>
              </div>
            </div>
          ) : (
            <>
              {/* Sujet */}
              <div className="space-y-3">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest ml-2">Matière</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-[#cbff00] transition-all"
                  value={formData.subject_id}
                  onChange={(e) => setFormData({...formData, subject_id: e.target.value})}
                >
                  {subjects.map(s => <option key={s.id} value={s.id} className="bg-[#0f0f12]">{s.name}</option>)}
                </select>
              </div>

              {/* Thème */}
              <div className="space-y-3">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest ml-2">Thème précis (Prompt)</label>
                <textarea 
                  placeholder="Ex: Les limites de fonctions complexes avec des exemples concrets..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-[#cbff00] min-h-[100px] transition-all"
                  value={formData.topic}
                  required
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                />
              </div>

              {/* Difficulté */}
              <div className="space-y-3">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest ml-2">Difficulté</label>
                <div className="grid grid-cols-3 gap-2">
                  {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({...formData, difficulty: lvl})}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${
                        formData.difficulty === lvl 
                          ? "bg-[#cbff00] text-black border-[#cbff00] shadow-[0_0_15px_rgba(203,255,0,0.2)]" 
                          : "bg-white/5 text-gray-500 border-white/5 hover:border-white/20"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-white text-black py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-[#cbff00] transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                <Sparkles size={18} /> Lancer la génération IA
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}