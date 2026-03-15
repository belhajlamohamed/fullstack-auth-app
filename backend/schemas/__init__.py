# --- FICHIER : backend/schemas/__init__.py ---
from schemas.user import (
    UserCreate, UserUpdateForm, UserLogin, UserOut, 
    PasswordChange, EmailRequest, PasswordResetConfirm
)
from schemas.quiz import (
    QuizCreate, QuizResponse, QuizFullResponse, 
    ResultResponse, QuizBase, QuestionCreate, 
    OptionBase, AnswerSubmission, QuizSubmission, SubjectOut
)
from schemas.academic import (
    CycleOut,LevelOut,FiliereOut
)

# On expose tout pour simplifier les imports dans les routers
__all__ = [
    "UserCreate", "UserUpdateForm", "UserLogin", "UserOut", "PasswordChange",
    "EmailRequest", "PasswordResetConfirm", "QuizCreate", "QuizResponse", 
    "QuizFullResponse", "ResultResponse", "QuizBase", "QuestionCreate", 
    "OptionBase", "AnswerSubmission", "QuizSubmission", "SubjectOut",
    "FiliereOut", "LevelOut", "CycleOut"
]

