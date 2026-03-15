
from fastapi import APIRouter, Depends, HTTPException, status,BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserOut, UserLogin,PasswordChange
# Pour le hashage
from passlib.context import CryptContext
import os
import models
import schemas
from jose import jwt, JWTError
# Importez vos nouvelles fonctions
from auth import hash_password, verify_password, create_access_token, get_current_user,create_verification_token,create_reset_token
from mail import send_verification_email,send_reset_password_email
from fastapi.security import OAuth2PasswordRequestForm


from dotenv import load_dotenv

# Chargement des variables d'environnement depuis le fichier .env
load_dotenv()

# Chargement des variables d'environnement depuis le fichier .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: schemas.UserCreate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    # 1. Vérifier si l'utilisateur existe déjà
    user_exists = db.query(models.User).filter(
        (models.User.email == user_in.email) | (models.User.username == user_in.username)
    ).first()

    if user_exists:
        raise HTTPException(
            status_code=400, 
            detail="Un utilisateur avec cet email ou ce pseudo existe déjà."
        )
    
    # 2. Gestion et Sécurité du Rôle
    role_str = user_in.role.lower() if user_in.role else "student"

    if role_str == "admin":
        raise HTTPException(
            status_code=403, 
            detail="Création de compte administrateur interdite par cette voie."
        )

    # Conversion en objet Enum pour SQLAlchemy
    try:
        db_role = models.UserRole(role_str)
    except ValueError:
        db_role = models.UserRole.STUDENT

    # 3. Hachage du mot de passe
    hashed_pwd = hash_password(user_in.password)
    
    # 4. Création de l'utilisateur avec les champs Secrétariat
    new_user = models.User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=hashed_pwd, 
        role=db_role,
        # IMPORTANT : On met le statut en attente si c'est un étudiant
        enrollment_status=models.EnrollmentStatus.PENDING_PAYMENT if db_role == models.UserRole.STUDENT else None,
        # Liaison avec le niveau et la filière choisis dans Register.jsx
        level_id=user_in.level_id if role_str == "student" else None,
        filiere_id=user_in.filiere_id if role_str == "student" else None,
        is_active=False  # Désactivé par défaut jusqu'à validation/vérification
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        db.rollback()
        print(f"Erreur DB : {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'enregistrement en base de données.")

    # 5. Token et Email de vérification
    token = create_verification_token(new_user.email)
    background_tasks.add_task(send_verification_email, new_user.email, token)

    # Debug console
    print(f"--- NOUVEL ETUDIANT ---")
    print(f"Email: {new_user.email} | Statut: {new_user.enrollment_status}")
    print(f"Lien : http://localhost:8000/users/verify-email?token={token}")

    return new_user

@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        # Décodage du token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if email is None or token_type != "verification":
            raise HTTPException(status_code=400, detail="Token invalide")
            
    except JWTError:
        raise HTTPException(status_code=400, detail="Token expiré ou corrompu")

    # Activation de l'utilisateur
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    user.is_email_verified = True
    db.commit()
    
    return {"message": "Votre compte a été activé avec succès !"}



@router.post("/login")
def login(
    # user_data: OAuth2PasswordRequestForm = Depends(),
    user_data: schemas.UserLogin, # On attend maintenant du JSON (UserLogin)
    db: Session = Depends(get_db)
):

    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    # user = db.query(models.User).filter(models.User.email == form_data.username).first()

    # Utilisation de verify_password de auth.py
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=403, detail="Identifiants invalides") 
   
   # Utilisation de create_access_token de auth.py
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, 
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "role": user.role,  # Sera maintenant bien envoyé !
                "is_active": user.is_active
                }
        }

@router.post("/forgot-password")
async def forgot_password(
    data: schemas.EmailRequest, # On réutilise un schéma avec juste l'email
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
    ):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        # Pour des raisons de sécurité, on ne dit pas si l'email existe ou non
        return {"message": "Si cet email existe, un lien a été envoyé."}

    token = create_reset_token(user.email)
    background_tasks.add_task(send_reset_password_email, user.email, token)
      
    return {"message": "Lien de réinitialisation envoyé."}


@router.post("/reset-password")
def reset_password(data: schemas.PasswordResetConfirm, new_password: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")

        if email is None or token_type != "password_reset":
            raise HTTPException(status_code=400, detail="Token invalide")
    except JWTError:
        raise HTTPException(status_code=400, detail="Token expiré ou invalide")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    user.hashed_password = hash_password(new_password)
    db.commit()
    
    return {"message": "Mot de passe mis à jour avec succès."}


@router.post("/change-password")
def change_password(
    passwords: schemas.PasswordChange,
    current_user: User = Depends(get_current_user), # Route protégée
    db: Session = Depends(get_db)
):
    # 1. Vérifier l'ancien mot de passe
    if not verify_password(passwords.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")
    
    # 2. Mettre à jour
    current_user.hashed_password = hash_password(passwords.new_password)
    db.commit()

    return {"message": "Mot de passe modifié avec succes!"}



# NOUVELLE ROUTE : Voir son propre profil (Route protégée)
@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    Cette route utilise 'get_current_user'. 
    Si le token est invalide, FastAPI renverra automatiquement une erreur 401.
    """
    return current_user