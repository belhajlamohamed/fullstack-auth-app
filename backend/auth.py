from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import os
import models
# import schemas
from database import get_db
from dotenv import load_dotenv

# Chargement des variables d'environnement depuis le fichier .env
load_dotenv()



# Configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Chargement des variables d'environnement depuis le fichier .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# Note : On change tokenUrl pour correspondre au préfixe de ton nouveau router
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login") 

def hash_password(password: str):
    return pwd_context.hash(password) #

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password) #

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30) #
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) #

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) #
        email: str = payload.get("sub") #
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Recherche de l'utilisateur dans la table User
    user = db.query(models.User).filter(models.User.email == email).first() #
    if user is None:
        raise credentials_exception
    return user

# Utilitaires pour l'email (Gardés de ta version précédente)
VERIFICATION_TOKEN_EXPIRE_HOURS = 24

def create_verification_token(email: str):
    expire = datetime.utcnow() + timedelta(hours=VERIFICATION_TOKEN_EXPIRE_HOURS)
    to_encode = {"exp": expire, "sub": email, "type": "verification"}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) #

def create_reset_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=15)
    return jwt.encode({"exp": expire, "sub": email, "type": "password_reset"}, SECRET_KEY, algorithm=ALGORITHM)



def role_required(allowed_roles: list):
    def decorator(current_user: models.User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail="Vous n'avez pas les droits nécessaires pour effectuer cette action"
            )
        return current_user
    return decorator