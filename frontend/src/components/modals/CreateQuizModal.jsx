import React from "react";
import ReactDOM from "react-dom";
import { X, Book, Clock, Target, Save, Plus } from "lucide-react";

export default function CreateQuizModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Le contenu de la modal
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
      {/* Overlay / Arrière-plan flouté */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Conteneur de la Modal */}
      <div className="relative w-full max-w-xl bg-[#0d0d10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 z-10 max-h-[90vh] flex flex-col">
        
        {/* Header de la Modal */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#cbff00]/10 text-[#cbff00] rounded-lg">
              <Plus size={20} />
            </div>
            <h2 className="text-lg font-bold uppercase tracking-tight text-white">Nouveau Quiz</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulaire (Scrollable si le contenu dépasse) */}
        <form className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Titre du Quiz */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
              Titre du questionnaire
            </label>
            <div className="relative group">
              <Book size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
              <input 
                type="text" 
                autoFocus
                placeholder="Ex: Algorithmique Avancée - TD 1"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-[#cbff00]/30 transition-all text-white placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Temps limite */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
                Temps (Minutes)
              </label>
              <div className="relative group">
                <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
                <input 
                  type="number" 
                  placeholder="30"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-[#cbff00]/30 transition-all text-white placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Score de passage */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
                Score de réussite (%)
              </label>
              <div className="relative group">
                <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#cbff00] transition-colors" />
                <input 
                  type="number" 
                  placeholder="50"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-[#cbff00]/30 transition-all text-white placeholder:text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
              Description (Optionnel)
            </label>
            <textarea 
              rows="3"
              placeholder="Quels sont les thèmes abordés dans ce quiz ?"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-[#cbff00]/30 transition-all text-white placeholder:text-gray-700 resize-none"
            />
          </div>
        </form>

        {/* Pied de la Modal (Boutons d'action) */}
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex flex-col sm:flex-row gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all"
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="flex-[2] bg-[#cbff00] text-black px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Créer le questionnaire
          </button>
        </div>
      </div>
    </div>
  );

  // Utilisation du Portal pour rendre la modal dans l'élément modal-root (en dehors de la hiérarchie du Dashboard)
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root") || document.body
  );
}