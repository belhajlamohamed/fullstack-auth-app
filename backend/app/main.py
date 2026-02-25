from fastapi import FastAPI, Depends, HTTPException
# from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, auth, database

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordRequestForm

from fastapi import Request

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Création des tables (en attendant Alembic)
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# IMPORTANT : CORS pour React
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .mail import send_verification_email,send_reset_password_email

@app.post("/register")
async def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # 1. Vérifier si l'utilisateur existe
    db_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username déjà utilisé")
    
    # 2. Créer l'utilisateur (inactif)
    new_user = models.User(
        email=user.email,
        hashed_password=auth.hash_password(user.password),
        username=user.username,
        is_active=False
    )    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 3. Générer le token de vérification
    token = auth.create_verification_token(new_user.email)
    verify_url = f"http://localhost:8000/verify-email?token={token}"

    # 4. Envoyer l'email réel via Gmail
    try:
        await send_verification_email(new_user.email, token)
    except Exception as e:
        print(f"Erreur d'envoi d'email: {e}")
        # Optionnel: supprimer l'utilisateur si l'email échoue
        raise HTTPException(status_code=500, detail="Erreur lors de l'envoi de l'email de confirmation")


    return {"message": "Inscription réussie. Un email de confirmation vous a été envoyé."}



@app.post("/login")
async def login(
    login_data: schemas.UserLogin, # Utilisation du schéma JSON
    db: Session = Depends(database.get_db)
):
    # On cherche l'utilisateur par l'email reçu dans le JSON
    user = db.query(models.User).filter(models.User.email == login_data.email).first()

    if not user or not auth.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Veuillez activer votre compte")
    
     # On génère le token    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

   

@app.get("/verify-email")
def verify_email(token: str, db: Session = Depends(database.get_db)):
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email = payload.get("sub")
        if payload.get("type") != "verification":
            raise HTTPException(status_code=400, detail="Token invalide")
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        user.is_active = True
        db.commit()
        return {"message": "Compte activé avec succès !"}
    except JWTError:
        raise HTTPException(status_code=400, detail="Lien expiré ou invalide")
     
@app.post("/change-password")
def change_password(
    passwords: schemas.PasswordChange, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user) # Route protégée
):
    if not auth.verify_password(passwords.old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")
    
    current_user.hashed_password = auth.hash_password(passwords.new_password)
    db.commit()
    return {"message": "Mot de passe mis à jour avec succès"}   

@app.post("/forgot-password")
async def forgot_password(email_data: schemas.EmailRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == email_data.email).first()
    if user:
        token = auth.create_reset_token(user.email)
        await send_reset_password_email(user.email, token)
    
    # On renvoie toujours le même message pour éviter l'énumération d'emails par des hackers
    return {"message": "Si cet email existe, un lien de réinitialisation a été envoyé."}

@app.post("/reset-password")
def reset_password(data: schemas.PasswordResetConfirm, db: Session = Depends(database.get_db)):
    try:
        payload = jwt.decode(data.token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        if payload.get("type") != "password_reset":
            raise HTTPException(status_code=400, detail="Token invalide")
        
        email = payload.get("sub")
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
            
        user.hashed_password = auth.hash_password(data.new_password)
        db.commit()
        return {"message": "Mot de passe réinitialisé avec succès"}
    except JWTError:
        raise HTTPException(status_code=400, detail="Lien expiré ou invalide")
    
@app.get("/me") # Change "/dashboard" en "/me"
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token invalide")
            
        # Optionnel mais mieux : va chercher l'utilisateur en base pour avoir son nom
        user = db.query(models.User).filter(models.User.email == email).first()
        
        return {
            "email": user.email,
            "username": user.username, # Pour que "Ravi de vous revoir" fonctionne
            "is_active": user.is_active
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Session expirée")



