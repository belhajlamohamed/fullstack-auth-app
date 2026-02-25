from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt,JWTError

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from . import database, models, schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "TA_CLE_TRES_SECRETE" # À mettre en .env plus tard
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Pourrait pas valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


# Ajoute une durée de vie plus longue pour l'email
VERIFICATION_TOKEN_EXPIRE_HOURS = 24

def create_verification_token(email: str):
    expire = datetime.utcnow() + timedelta(hours=VERIFICATION_TOKEN_EXPIRE_HOURS)
    to_encode = {"exp": expire, "sub": email, "type": "verification"}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_reset_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=15)
    return jwt.encode({"exp": expire, "sub": email, "type": "password_reset"}, SECRET_KEY, algorithm=ALGORITHM)