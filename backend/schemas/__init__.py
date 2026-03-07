# from .user import UserCreate, UserResponse, UserLogin
# from .quiz import QuizCreate, QuizResponse, SubjectResponse

from schemas.user import UserCreate, UserUpdateForm, UserLogin, UserOut,PasswordChange,EmailRequest,PasswordResetConfirm
from schemas.quiz import (
    QuizCreate, QuizResponse,ResultResponse,QuizBase,
    SubjectResponse, 
    QuestionCreate, OptionBase,QuizFullResponse,AnswerSubmission,QuizSubmission,SubjectOut
)

# Nous ajouterons les schémas de Quiz ici plus tard
__all__ = ["UserCreate", "UserUpdateForm", "UserLogin", "UserOut","PasswordChange", "QuestionCreate", "OptionBase","QuizFullResponse","AnswerSubmission","QuizSubmission","SubjectOut", "EmailRequest", "PasswordResetConfirm","QuizCreate", "QuizResponse", "SubjectResponse",""
    
             "QuestionCreate","OptionBase","QuizFullResponse","AnswerSubmission", "QuizSubmission","ResultResponse",""]
