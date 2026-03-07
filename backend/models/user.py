from sqlalchemy import Column, Integer, String, Boolean,Enum
import enum
from database import Base


class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=False)
    # role = Column(String, default=UserRole.STUDENT) # <--- ICI
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)

    # On pourrait ajouter plus tard : 
    # bio = Column(String, nullable=True)

    