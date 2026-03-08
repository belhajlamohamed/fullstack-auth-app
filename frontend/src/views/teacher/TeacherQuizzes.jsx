import React, { useState, useEffect } from "react";
import { Plus, Eye, Edit3, Trash2, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import api from "../../api/axios"; 
import CreateQuizModal from "../../components/ui/CreateQuizModal";

export default function TeacherQuizzes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState(null); // État pour le quiz en cours de modif


  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/quizzes/my-quizzes");
      setQuizzes(response.data);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleEditClick = async (quizId) => {
  try {
    // On récupère les détails complets (avec questions/options) depuis le backend
    const response = await api.get(`/quizzes/${quizId}`);
    setEditingQuiz(response.data); // On stocke l'objet complet
    setIsModalOpen(true);          // On ouvre la modal
  } catch (err) {
    console.error("Erreur lors de la récupération du quiz", err);
  }
};

  // FONCTION : SUPPRIMER
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) {
      try {
        await api.delete(`/quizzes/${id}`);
        setQuizzes(quizzes.filter(q => q.id !== id));
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  // // FONCTION : OUVRIR EN MODE ÉDITION
  // const handleEdit = (quiz) => {
  //   setEditingQuiz(quiz);
  //   setIsModalOpen(true);
  // };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight text-white">
            Mes <span className="text-[#cbff00]">Questionnaires</span>
          </h1>
        </div>
        <button 
          onClick={() => { setEditingQuiz(null); setIsModalOpen(true); }}
          className="bg-[#cbff00] text-black px-6 py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2"
        >
          <Plus size={18} strokeWidth={3} /> Nouveau Quiz
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#cbff00]" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 overflow-hidden">
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0d0d10]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-4 text-[10px] font-bold uppercase text-gray-500">Quiz</th>
                  <th className="p-4 text-[10px] font-bold uppercase text-gray-500">Questions</th>
                  <th className="p-4 text-right text-[10px] font-bold uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg text-[#cbff00]"><BookOpen size={16} /></div>
                        <span className="text-sm font-bold text-white">{quiz.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-500 font-mono">
                      {quiz.questions?.length || 0} Qs
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEditClick(quiz.id)} className="p-2 hover:bg-[#cbff00]/10 text-gray-500 hover:text-[#cbff00] rounded-lg transition-all" title="Modifier">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(quiz.id)} className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-all" title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <CreateQuizModal 
          isOpen={isModalOpen} 
          onClose={() => { setIsModalOpen(false); setEditingQuiz(null); }} 
          onSuccess={fetchQuizzes}
          editingQuiz={editingQuiz} // On passe le quiz pour pré-remplir
        />
      )}
    </div>
  );
}