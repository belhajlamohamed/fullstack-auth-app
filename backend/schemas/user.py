from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional

# Base commune pour éviter la répétition
class UserBase(BaseModel):
    email: EmailStr
    username: str

# 1. Schéma pour l'inscription
class UserCreate(UserBase):
   password: str
   role: Optional[str] = "student" # Par défaut, on est élève


# class UserCreate(UserBase):
#     password: str = Field(..., min_length=8, description="Le mot de passe doit faire au moins 8 caractères")

# 2. Schéma pour la connexion
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# 3. Schéma pour la mise à jour (PATCH)
class UserUpdateForm(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

# 4. Schéma de sortie (ce que l'API renvoie)
class UserOut(UserBase):
    id: int
    role: str # <--- INDISPENSABLE pour que le frontend le voie
    is_active: bool

#     # Indispensable pour transformer un modèle SQLAlchemy en schéma Pydantic
    model_config = ConfigDict(from_attributes=True)

class PasswordChange(BaseModel):
    old_password: str
    new_password: str

class EmailRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str