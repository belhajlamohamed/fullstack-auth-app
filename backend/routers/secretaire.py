from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, UserRole, EnrollmentStatus, Level, Filiere
# from schemas.user import UserOut, UserStats  # Assure-toi d'avoir ces schemas
from schemas.user import UserStats, UserPending # <--- Utilise UserPending ici
from auth import get_current_user

router = APIRouter(
    prefix="/secretaire",
    tags=["Secrétariat"]
)

# Fonction de dépendance pour vérifier si l'utilisateur est secrétaire ou admin
def verify_secretaire_role(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.SECRETAIRE, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé au personnel administratif"
        )
    return current_user

@router.get("/secretaire-stats", response_model=UserStats)
def get_secretaire_stats(db: Session = Depends(get_db)):
    # On compte les étudiants
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
    
    # ON AJOUTE LE COMPTE DES ENSEIGNANTS ICI
    total_teachers = db.query(User).filter(User.role == UserRole.TEACHER).count()
    
    pending = db.query(User).filter(User.enrollment_status == EnrollmentStatus.PENDING_PAYMENT).count()
    active = db.query(User).filter(User.is_active == True, User.role == UserRole.STUDENT).count()

    return {
        "totalStudents": total_students,
        "totalTeachers": total_teachers,  # <--- Cette clé doit être envoyée
        "pendingValidation": pending,
        "activeStudents": active
    }


@router.get("/pending-requests", response_model=List[UserPending])
def get_pending_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_secretaire_role)
):
    """Liste tous les étudiants qui attendent la validation de leur paiement"""
    """
    Remplace 'pending-users'. 
    Récupère étudiants (en attente paiement) ET enseignants (inactifs).
    """
   
    pending_users = db.query(User).filter(
        (User.enrollment_status == EnrollmentStatus.PENDING_PAYMENT) | 
        ((User.role == UserRole.TEACHER) & (User.is_active == False))
    ).all()

    
    # On enrichit la réponse avec les noms du niveau et de la filière
    results = []
    for user in pending_users:
        results.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": user.id, # Ou une colonne date_joined si tu l'as
            "level_name": user.level.name if user.level else "N/A",
            "filiere_name": user.filiere.name if user.filiere else "N/A"
        })
    return results


@router.post("/validate-user/{user_id}")
def validate_user_access(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_secretaire_role)
):
   

    """Active le compte d'un utilisateur (Étudiant ou Enseignant)"""
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # --- LOGIQUE ÉTUDIANT ---
    if user.role == UserRole.STUDENT:
        # On valide son paiement et on l'active
        user.enrollment_status = EnrollmentStatus.ACTIVE
        user.is_active = True
    
    # --- LOGIQUE ENSEIGNANT ---
    elif user.role == UserRole.TEACHER:
        # Pas de flux de paiement, on active juste le compte
        user.is_active = True
    else:
        # Sécurité pour les autres rôles
        raise HTTPException(status_code=400, detail="Ce type d'utilisateur ne peut pas être validé ici")
    
    db.commit()
    return {"message": f"Accès validé avec succès pour {user.username}"}