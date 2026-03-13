from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

# --- ENUMS ---
class DifficultyLevel(str, Enum):
    beginner = "Débutant"
    intermediate = "Intermédiaire"
    expert = "Expert"

# --- OPTIONS ---
class OptionBase(BaseModel):
    text: str
    is_correct: bool

class OptionResponse(OptionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- QUESTIONS ---
class QuestionBase(BaseModel):
    text: str

class QuestionCreate(QuestionBase):
    options: List[OptionBase]

class QuestionResponse(QuestionBase):
    id: int
    options: List[OptionResponse]
    model_config = ConfigDict(from_attributes=True)

# --- QUIZ ---
class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject_id: int

class QuizCreate(QuizBase):
    questions: List[QuestionCreate]

class QuizResponse(QuizBase):
    """Utilisé pour les listes (ex: /all)"""
    id: int
    creator_id: int
    question_count: int = 0
    model_config = ConfigDict(from_attributes=True)

class QuizFullResponse(QuizResponse):
    """Utilisé pour les détails (ex: /{id}) avec toutes les questions"""
    questions: List[QuestionResponse]
    model_config = ConfigDict(from_attributes=True)

# --- MATIÈRES (SUBJECTS) ---
class SubjectOut(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)

# --- RÉSULTATS ET SOUMISSIONS ---
class AnswerSubmission(BaseModel):
    question_id: int
    option_id: int

class QuizSubmission(BaseModel):
    answers: List[AnswerSubmission]

class ResultResponse(BaseModel):
    id: int
    quiz_id: int
    score: int
    total_questions: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- STATISTIQUES ---
class TeacherStats(BaseModel):
    total_quizzes: int
    total_students: int
    average_score: float
    active_now: int
    model_config = ConfigDict(from_attributes=True)

class StudentStats(BaseModel):
    completed: int
    avg_score: float
    points: int
    model_config = ConfigDict(from_attributes=True)

# ==========================================================
# --- SCHÉMAS POUR L'IA (Génération de Quiz) ---
# Ces schémas servent à structurer la réponse de l'IA (LLM)
# ==========================================================

class QuestionAISchema(BaseModel):
    """Structure d'une question générée par l'IA"""
    question_text: str
    options: List[str]  # Juste une liste de chaînes de caractères
    correct_answer_index: int  # L'index (0, 1, 2, 3) de la bonne réponse

class QuizAISchema(BaseModel):
    """Structure globale du quiz généré par l'IA"""
    title: str
    description: str
    questions: List[QuestionAISchema]

class QuizGenerateRequest(BaseModel):
    """Ce que le frontend envoie pour demander une génération"""
    prompt: str  # Le sujet (ex: "La révolution française")
    subject_id: int
    num_questions: int = Field(default=5, ge=1, le=20)
    difficulty: DifficultyLevel = DifficultyLevel.beginner