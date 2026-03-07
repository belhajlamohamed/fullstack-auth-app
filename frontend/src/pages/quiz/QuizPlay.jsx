import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // { questionId: optionId }
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quizzes/${id}`);
        setQuiz(response.data);
      } catch (err) {
        console.error("Erreur chargement quiz", err);
        alert("Impossible de charger le quiz.");
      }
    };
    fetchQuiz();
  }, [id]);

  if (!quiz) return <div className="text-center mt-10">Chargement...</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (optionId) => {
    setSelectedOptions({ ...selectedOptions, [currentQuestion.id]: optionId });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = async () => {
    let tempScore = 0;
    quiz.questions.forEach((q) => {
      const selectedOptId = selectedOptions[q.id];
      const correctOpt = q.options.find(opt => opt.is_correct);
      if (selectedOptId === correctOpt?.id) {
        tempScore += 1;
      }
    });
    setScore(tempScore);
    setIsFinished(true);

    // Envoyer le résultat au backend (Modèle Result dans quiz.py)
    try {
      await api.post('/quizzes/results', {
        quiz_id: quiz.id,
        score: tempScore,
        total_questions: quiz.questions.length
      });
    } catch (err) {
      console.error("Erreur enregistrement score", err);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-green-100">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Quiz Terminé !</h2>
          <div className="text-6xl font-extrabold text-gray-800 mb-4">
            {score} <span className="text-2xl text-gray-400">/ {quiz.questions.length}</span>
          </div>
          <p className="text-gray-600 mb-8">Bravo ! Vos résultats ont été enregistrés.</p>
          <button 
            onClick={() => navigate('/quizzes')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Retour aux Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Barre de progression responsive */}
        <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
          <span>Question {currentQuestionIndex + 1} sur {quiz.questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">
            {currentQuestion.text}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  selectedOptions[currentQuestion.id] === option.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-100 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <span className="font-medium">{option.text}</span>
                {selectedOptions[currentQuestion.id] === option.id && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedOptions[currentQuestion.id]}
            className={`mt-10 w-full py-4 rounded-xl font-bold text-lg transition shadow-lg ${
              selectedOptions[currentQuestion.id]
                ? 'bg-gray-800 text-white hover:bg-black'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Terminer le Quiz' : 'Question suivante'}
          </button>
        </div>
      </div>
    </div>
  );
}