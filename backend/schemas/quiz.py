from pydantic import BaseModel, ConfigDict
from typing import List, Optional


# --- OPTIONS ---
class OptionBase(BaseModel):
    text: str
    is_correct: bool

class OptionResponse(OptionBase):
    id: int
    class Config:
        from_attributes = True

# --- QUESTIONS ---
class QuestionBase(BaseModel):
    text: str

class QuestionCreate(QuestionBase):
    options: List[OptionBase] # Pour créer, on envoie les options avec la question

class QuestionResponse(QuestionBase):
    id: int
    options: List[OptionResponse]
    class Config:
        from_attributes = True

# --- QUIZ ---
class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject_id: int

class QuizCreate(QuizBase):
    questions: List[QuestionCreate] # Structure imbriquée pour créer tout d'un coup



class QuizResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    subject_id: int
    creator_id: int # Vérifie si ce champ est bien présent dans ton modèle aussi

    class Config:
        from_attributes = True # <--- INDISPENSABLE pour SQLAlchemy

# --- SUBJECT (Matières) ---
class SubjectResponse(BaseModel):
    id: int
    name: str
    slug: str
    icon: str
    class Config:
        from_attributes = True




class SubjectOut(BaseModel):
    id: int
    name: str
    # Supprime 'slug' et 'icon' car ils n'existent pas dans ton modèle SQL
    
    model_config = ConfigDict(from_attributes=True)

# À ajouter dans schemas/quiz.py si tu veux le quiz COMPLET
class QuizFullResponse(QuizResponse):
    questions: List[QuestionResponse]
    class Config:
        from_attributes = True

class AnswerSubmission(BaseModel):
    question_id: int
    option_id: int # L'ID de la réponse choisie par l'élève

class QuizSubmission(BaseModel):
    answers: List[AnswerSubmission]

from datetime import datetime

# ... (tes autres schémas Option, Question, Quiz)

class ResultResponse(BaseModel):
    id: int
    quiz_id: int
    score: int
    total_questions: int
    created_at: datetime
    
    # Très important pour que Pydantic puisse lire les objets SQLAlchemy
    class Config:
        from_attributes = True



# --- SCHÉMAS POUR L'IA (TOOLS.PY) ---

class QuestionAISchema(BaseModel):
    question_text: str
    options: List[str]
    correct_answer_index: int

class QuizAISchema(BaseModel):
    title: str
    questions: List[QuestionAISchema]


# --- SCHÉMAS POUR L'API (ROUTES) ---

class OptionOut(BaseModel):
    id: int
    text: str
    is_correct: bool # Optionnel : tu peux le cacher aux étudiants
    model_config = ConfigDict(from_attributes=True)

class QuestionOut(BaseModel):
    id: int
    text: str
    options: List[OptionOut]
    model_config = ConfigDict(from_attributes=True)


from enum import Enum

class DifficultyLevel(str, Enum):
    beginner = "Débutant"
    intermediate = "Intermédiaire"
    expert = "Expert"

class QuizOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    creator_id: int
    questions: List[QuestionOut]
    difficulty: DifficultyLevel # Ajout au schéma de sortie
    
    # ... le reste
    model_config = {"from_attributes": True}





# ... tes autres schémas (QuizCreate, QuestionSchema, etc.)



class TeacherStats(BaseModel):
    total_quizzes: int
    total_students: int
    average_score: float
    active_now: int

    class Config:
        from_attributes = True

class StudentStats(BaseModel):
    completed: int
    avg_score: float
    points: int
    
    class Config:
        from_attributes = True