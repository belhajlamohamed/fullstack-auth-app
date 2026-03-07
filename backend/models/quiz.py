from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base
import enum
import datetime



class DifficultyEnum(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    expert = "expert"

# 2. Modèle Subject (doit être défini avant Quiz pour les relations si nécessaire, 
# ou référencé par chaîne de caractères)
class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    # Relation : Un sujet peut avoir plusieurs quiz
    quizzes = relationship("Quiz", back_populates="subject")

# 3. Modèle Quiz
class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False, default=1)
    difficulty = Column(Enum(DifficultyEnum), nullable=False, default=DifficultyEnum.beginner)
    creator_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    subject = relationship("Subject", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    # Si tu as une relation inverse dans User.py, assure-toi qu'elle correspond à creator_id

# 4. Modèle Question
class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"))

    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("Option", back_populates="question", cascade="all, delete-orphan")

# 5. Modèle Option
class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    is_correct = Column(Boolean, default=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"))

    question = relationship("Question", back_populates="options")

# 6. Modèle Result
class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"))

    # Relations simples (pas de back_populates nécessaire ici sauf si tu veux 
    # voir les résultats depuis l'objet User)
    user = relationship("User")
    quiz = relationship("Quiz")