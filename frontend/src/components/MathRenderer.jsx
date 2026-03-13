import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export const MathRenderer = ({ text }) => {
  if (!text) return null;

  // Cette regex découpe le texte en isolant les parties entre $...$
  // Elle capture aussi les symboles $ pour qu'on puisse les identifier
  const parts = text.split(/(\$.*?\$)/g);

  return (
    <span className="math-container">
      {parts.map((part, index) => {
        // Si la partie commence et finit par $, c'est du LaTeX
        if (part.startsWith('$') && part.endsWith('$')) {
          const mathContent = part.slice(1, -1);
          
          // Sécurité : si le contenu est vide entre les $, on ne rend rien
          if (!mathContent.trim()) return null;

          try {
            return (
              <InlineMath 
                key={index} 
                math={mathContent} 
              />
            );
          } catch (error) {
            console.error("Erreur de rendu KaTeX:", error);
            return <span key={index} className="text-red-500">{part}</span>;
          }
        }
        
        // Sinon, c'est du texte normal
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};