# routes/teacher.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import models
import schemas
import auth
import database

router = APIRouter(prefix="/teachers", tags=["Teacher Operations"])

@router.get("/stats/summary", response_model=schemas.quiz.TeacherStats) # Crée ce schéma dans schemas/quiz.py
async def get_teacher_stats(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role.lower() != "teacher":
        raise HTTPException(status_code=403, detail="Accès réservé aux enseignants")

   # Remplacer les lignes concernées par celles-ci :

    # Dans get_teacher_stats :
    total_quizzes = db.query(models.Quiz).filter(models.Quiz.creator_id == current_user.id).count()

    total_participations = db.query(models.Result).join(models.Quiz).filter(
        models.Quiz.creator_id == current_user.id
    ).count()

    avg_score = db.query(func.avg(models.Result.score)).join(models.Quiz).filter(
        models.Quiz.creator_id == current_user.id
    ).scalar() or 0.0

    # Dans get_my_quizzes :
    quizzes = db.query(models.Quiz).filter(models.Quiz.creator_id == current_user.id).all()

    return {
        "total_quizzes": total_quizzes,
        "total_students": total_participations,
        "average_score": round(float(avg_score), 1),
        "active_now": 0  # Tu pourras implémenter une logique de présence plus tard
    }

@router.get("/my-quizzes", response_model=List[schemas.quiz.QuizResponse])
async def get_my_quizzes(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role.lower() != "teacher":
        raise HTTPException(status_code=403, detail="Accès réservé aux enseignants")
        
    return db.query(models.Quiz).filter(models.Quiz.teacher_id == current_user.id).all()