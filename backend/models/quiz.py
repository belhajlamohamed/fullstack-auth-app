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
 

# Dans ton fichier quiz.py existant, modifie la classe Subject :
class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) # Retirer unique=True si "Maths" existe dans plusieurs filières
    
    # Ajout du lien vers la Filière
    filiere_id = Column(Integer, ForeignKey("filieres.id", ondelete="CASCADE"))
    
    quizzes = relationship("Quiz", back_populates="subject")

# 3. Modèle Quiz
class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=True)  # <-- Ajout du champ topic
    description = Column(String, nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False, default=1)
    difficulty = Column(Enum(DifficultyEnum), nullable=False, default=DifficultyEnum.beginner)
    creator_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    subject = relationship("Subject", back_populates="quizzes")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    # Si tu as une relation inverse dans User.py, assure-toi qu'elle correspond à creator_id

    # @property
    # def question_count(self):
    #     print(f"le nombre de question pour les quiz{self.id} est {len(self.questions)}")
    #     return len(self.questions)

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



    
   
    
    
   

    # Relations simples (pas de back_populates nécessaire ici sauf si tu veux 
    # voir les résultats depuis l'objet User)
   

# Dans ton fichier de modèles (ex: models/quiz.py)

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float, nullable=False)  # Note sur 20 par exemple
    correct_answers = Column(Integer, nullable=False, default=0) # Ajouté
    total_questions = Column(Integer, nullable=False, default=0)  # Ajouté
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"))
    user = relationship("User")
    quiz = relationship("Quiz")

  