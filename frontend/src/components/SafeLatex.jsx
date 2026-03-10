import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const SafeLatex = ({ content, isBlock = false }) => {
    if (!content) return null;
    // On vérifie si le contenu contient des symboles LaTeX ($...$)
  const hasLatex = content.includes('$');
  if (!hasLatex) return <span>{content}</span>;
  if (isBlock) {
    return <BlockMath math={content.replace(/\$/g, '')} />;
  }
  return <InlineMath math={content.replace(/\$/g, '')} />;

};

export default SafeLatex;
