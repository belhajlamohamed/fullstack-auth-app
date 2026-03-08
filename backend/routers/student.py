# routes/student.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
# On utilise nos imports absolus comme convenu
import models
import schemas
import auth
import database

router = APIRouter(prefix="/students", tags=["Student Operations"])

@router.get("/stats/summary", response_model=schemas.quiz.StudentStats)
async def get_student_stats(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role.lower() != "student":
        raise HTTPException(status_code=403, detail="Accès réservé aux étudiants")

    # Nombre de quiz terminés par l'élève
    completed = db.query(models.Result).filter(models.Result.user_id == current_user.id).count()

    # Score moyen personnel
    avg_score = db.query(func.avg(models.Result.score)).filter(
        models.Result.user_id == current_user.id
    ).scalar() or 0.0

    # Points totaux (somme des scores par exemple)
    points = db.query(func.sum(models.Result.score)).filter(
        models.Result.user_id == current_user.id
    ).scalar() or 0

    return {
        "completed": completed,
        "avg_score": round(float(avg_score), 1),
        "points": int(points)
    }

@router.get("/my-results", response_model=List[schemas.quiz.ResultResponse])
async def get_my_results(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Result).filter(models.Result.user_id == current_user.id).all()