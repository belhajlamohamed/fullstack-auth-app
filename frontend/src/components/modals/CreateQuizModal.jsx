import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2, HelpCircle, CheckCircle2 } from "lucide-react";
import api from "../../api/axios";

const CreateQuizModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // États du Quiz (selon ton modèle quiz.py)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState(1);
  const [difficulty, setDifficulty] = useState("beginner"); // beginner, intermediate, expert

  // État des Questions : 4 options par défaut
  const [questions, setQuestions] = useState([
    { 
      text: "", 
      options: [
        { text: "", is_correct: true }, // La première est correcte par défaut
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false }
      ] 
    }
  ]);

  if (!isOpen) return null;

  const addQuestion = () => {
    setQuestions([...questions, { 
      text: "", 
      options: Array(4).fill(null).map((_, i) => ({ text: "", is_correct: i === 0 })) 
    }]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestionText = (index, text) => {
    const newQs = [...questions];
    newQs[index].text = text;
    setQuestions(newQs);
  };

  const updateOption = (qIdx, oIdx, field, value) => {
    const newQs = [...questions];
    // Si on définit une option comme correcte, on passe les autres à false
    if (field === "is_correct" && value === true) {
      newQs[qIdx].options.forEach((opt, i) => opt.is_correct = i === oIdx);
    } else {
      newQs[qIdx].options[oIdx][field] = value;
    }
    setQuestions(newQs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Structure finale correspondant à tes modèles SQLAlchemy
      const payload = {
        title,
        description,
        subject_id: parseInt(subjectId),
        difficulty,
        questions: questions.map(q => ({
          text: q.text,
          options: q.options.map(o => ({
            text: o.text,
            is_correct: o.is_correct
          }))
        }))
      };

      await api.post("/quizzes/create", payload);
      onSuccess();
    } catch (err) {
      console.error("Erreur creation:", err);
      alert("Erreur lors de la création du quiz.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-[#111113] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
              Configuration du <span className="text-[#cbff00]">Quiz</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">Modèle Backend SQLAlchemy</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          {/* Section 1 : Infos Générales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Titre & Description</label>
              <input 
                required 
                placeholder="Titre du quiz"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#cbff00] transition-all"
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
              <textarea 
                placeholder="Description (optionnel)"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white h-24 outline-none focus:border-[#cbff00] transition-all resize-none"
                value={description} 
                onChange={e => setDescription(e.target.value)} 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Paramètres Modèle</label>
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 block mb-2 font-bold uppercase">Sujet (ID)</span>
                  <input 
                    type="number" 
                    className="w-full bg-black/40 border border-white/10 p-2 rounded-lg text-white"
                    value={subjectId} 
                    onChange={e => setSubjectId(e.target.value)}
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block mb-2 font-bold uppercase">Difficulté</span>
                  <select 
                    className="w-full bg-black/40 border border-white/10 p-2 rounded-lg text-white outline-none"
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 : Questions & Options */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <HelpCircle className="text-[#cbff00]" size={20} />
                Questions ({questions.length})
              </h3>
            </div>

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="group relative bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] space-y-6 hover:border-white/20 transition-all">
                <button 
                  type="button" 
                  onClick={() => removeQuestion(qIdx)}
                  className="absolute -top-3 -right-3 bg-red-500/20 text-red-500 p-2 rounded-full border border-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>

                <div className="space-y-2">
                  <span className="text-[10px] font-black text-[#cbff00] uppercase tracking-[0.2em]">Question {qIdx + 1}</span>
                  <input 
                    placeholder="Saisissez votre question..."
                    className="w-full bg-transparent border-b border-white/10 py-3 text-xl font-bold text-white outline-none focus:border-[#cbff00] transition-all"
                    value={q.text} 
                    onChange={e => updateQuestionText(qIdx, e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIdx) => (
                    <div 
                      key={oIdx} 
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        opt.is_correct 
                        ? 'bg-[#cbff00]/10 border-[#cbff00]/40' 
                        : 'bg-black/20 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => updateOption(qIdx, oIdx, "is_correct", true)}
                        className={`p-1.5 rounded-lg transition-colors ${opt.is_correct ? 'bg-[#cbff00] text-black' : 'bg-white/5 text-gray-600'}`}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <input 
                        placeholder={`Option ${oIdx + 1}`}
                        className="bg-transparent text-sm text-white outline-none flex-1 font-medium"
                        value={opt.text} 
                        onChange={e => updateOption(qIdx, oIdx, "text", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addQuestion}
              className="w-full border-2 border-dashed border-white/10 p-8 rounded-[2.5rem] text-gray-500 hover:text-[#cbff00] hover:border-[#cbff00]/40 transition-all font-bold flex flex-col items-center gap-2 group"
            >
              <Plus className="group-hover:scale-125 transition-transform" />
              Ajouter une question
            </button>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-8 border-t border-white/5 bg-white/5 flex gap-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 p-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/10 transition-colors"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] p-4 rounded-2xl bg-[#cbff00] text-black font-black uppercase tracking-tighter hover:shadow-[0_0_30px_rgba(203,255,0,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? "Synchronisation..." : "Créer le Quiz"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateQuizModal;