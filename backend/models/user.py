
from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey # Ajoute ForeignKey
from sqlalchemy.orm import relationship
import enum
from database import Base


class EnrollmentStatus(str,enum.Enum):
    PENDING_PROFILE = "PENDING_PROFILE"   # Email vérifié, profil non rempli
    PENDING_PAYMENT = "PENDING_PAYMENT"   # Profil rempli, attente validation secrétaire
    ACTIVE = "ACTIVE"

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"
    SECRETAIRE = "secretaire"



# ... (garder EnrollmentStatus et UserRole tels quels)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    is_email_verified = Column(Boolean, default=False)
    enrollment_status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.PENDING_PROFILE, nullable=False)

    # --- AJOUTE CES LIGNES ---
    level_id = Column(Integer, ForeignKey("levels.id"), nullable=True)
    filiere_id = Column(Integer, ForeignKey("filieres.id"), nullable=True)

    # Relations optionnelles pour faciliter l'accès (ex: user.level.name)
    level = relationship("Level", back_populates="users")
    filiere = relationship("Filiere", back_populates="users")