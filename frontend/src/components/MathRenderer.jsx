import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

export const MathRenderer = ({ text }) => {
  if (!text) return null;

  // Sépare le texte normal des formules entourées de $
  const parts = text.split(/(\$.*?\$)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          // On retire les $ avant de donner la chaîne à KaTeX
          return <InlineMath key={index} math={part.slice(1, -1)} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
};