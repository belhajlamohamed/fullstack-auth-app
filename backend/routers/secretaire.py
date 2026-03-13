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

@router.get("/dashboard-stats", response_model=UserStats) # Ajoute le response_model
def get_secretaire_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_secretaire_role)
):
    """Récupère les chiffres clés pour les StatCards du Dashboard"""
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
    pending_validation = db.query(User).filter(
        User.enrollment_status == EnrollmentStatus.PENDING_PAYMENT
    ).count()
    active_students = db.query(User).filter(
        User.enrollment_status == EnrollmentStatus.ACTIVE
    ).count()

    return {
        "totalStudents": total_students,
        "pendingValidation": pending_validation,
        "activeStudents": active_students
    }

@router.get("/pending-users", response_model=List[UserPending])
def get_pending_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_secretaire_role)
):
    """Liste tous les étudiants qui attendent la validation de leur paiement"""
    pending_users = db.query(User).filter(
        User.enrollment_status == EnrollmentStatus.PENDING_PAYMENT
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
def validate_student_access(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(verify_secretaire_role)
):
    """Active le compte d'un étudiant après vérification du paiement"""
    student = db.query(User).filter(User.id == user_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant non trouvé")
    
    if student.role != UserRole.STUDENT:
        raise HTTPException(status_code=400, detail="Seuls les étudiants peuvent être validés")

    # Mise à jour du statut
    student.enrollment_status = EnrollmentStatus.ACTIVE
    student.is_active = True
    
    db.commit()
    return {"message": f"L'accès pour {student.username} a été activé avec succès"}