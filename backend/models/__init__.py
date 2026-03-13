from models.user import User,UserRole
from models.quiz import Subject, Quiz, Question, Option,Result


from database import Base # Import de ta base commune
from models.user import User, UserRole, EnrollmentStatus
from models.cycle import Cycle
from models.level import Level
from models.filiere import Filiere
from models.quiz import Subject, Quiz, Question, Option, Result
from models.course import Course

# Ce dictionnaire __all__ définit ce qui est exporté 
# quand on fait "from models import *"
__all__ = [
    "Base",
    "User",
    "UserRole",
    "EnrollmentStatus",
    "Cycle",
    "Level",
    "Filiere",
    "Subject",
    "Quiz",
    "Question",
    "Option",
    "Result",
    "Course"
]