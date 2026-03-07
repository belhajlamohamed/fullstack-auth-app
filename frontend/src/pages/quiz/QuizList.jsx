import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get('/quizzes/'); // Correspond au préfixe de ton APIRouter
        setQuizzes(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des quiz", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) return <div className="text-center mt-10">Chargement des quiz...</div>;

  return (
    <div className="p-4 md:p-8"> {/* Padding réduit sur mobile */}
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Quiz Disponibles</h1>
    <Link 
      to="/quiz/create" 
      className="w-full sm:w-auto text-center bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
    >
      + Créer un Quiz
    </Link>
  </div>

      {/* La grille de quiz */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
    {quizzes.map((quiz) => (
      <div key={quiz.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 leading-tight">{quiz.title}</h2>
          <p className="text-gray-600 mt-2 text-sm line-clamp-3">{quiz.description}</p>
        </div>
        <Link 
          to={`/quiz/${quiz.id}`} 
          className="mt-4 text-blue-500 font-semibold hover:text-blue-700 text-sm inline-flex items-center"
        >
          Démarrer le quiz <span className="ml-1">→</span>
        </Link>
      </div>
    ))}
  </div>
</div>
  );
}