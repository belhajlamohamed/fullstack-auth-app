from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession


# On utilise nos imports absolus comme convenu
import models
import schemas
import auth
import database
from tools import call_gemini_ai           # Ta fonction IA
from schemas.quiz import QuizOut

router = APIRouter(
    prefix="/quizzes",
    tags=["Quizzes"]
)

@router.get("/subjects", response_model=list[schemas.SubjectOut])
def get_subjects(db: Session = Depends(database.get_db)):
    subjects = db.query(models.Subject).all()
    return subjects


@router.post("/generate", response_model=QuizOut)
def generate_quiz_ai(
    topic: str, 
    creator_id: int, 
    difficulty: str = "Intermédiaire", 
    db: Session = Depends(database.get_db)
):
    """
    Endpoint qui appelle Gemini, structure les données et les enregistre en base.
    """
    # 1. Appel à l'IA dans tools.py
    try:
        ai_data = call_gemini_ai(topic, difficulty)
    except Exception as e:
        # Gestion des erreurs (ex: Rate Limit 429 de Gemini)
        raise HTTPException(status_code=429, detail="L'IA est saturée. Réessayez dans une minute.")
    # 2. Création de l'objet Quiz (Parent)
    new_quiz = models.Quiz(
        title=ai_data.title,
        description=f"Quiz {difficulty} généré sur le thème : {topic}",
        creator_id=creator_id
    )
    db.add(new_quiz)
    db.flush()  # Pour obtenir l'ID de new_quiz avant le commit final
    # 3. Itération sur les questions générées par l'IA
    for q_data in ai_data.questions:
        new_question = models.Question(
            text=q_data.question_text,
            quiz_id=new_quiz.id
        )
        db.add(new_question)
        db.flush() # Pour obtenir l'ID de la question pour les options

        # 4. Itération sur les options de chaque question
        for idx, opt_text in enumerate(q_data.options):
            is_correct = (idx == q_data.correct_answer_index)
            new_option = models.Option(
                text=opt_text,
                is_correct=is_correct,
                question_id=new_question.id
            )
            db.add(new_option)

    # 5. Commit final pour sauvegarder toute la structure
    db.commit()
    db.refresh(new_quiz)

    return new_quiz



# --- Récupérer TOUS les quiz (pour la page d'accueil) ---
@router.get("/all", response_model=List[schemas.QuizResponse])
def get_all_quizzes(db: Session = Depends(database.get_db)):
    return db.query(models.Quiz).all()


# --- ROUTE 1 : Récupérer toutes les matières ---
@router.get("/subjects", response_model=List[schemas.SubjectResponse])
def get_subjects(db: Session = Depends(database.get_db)):
    return db.query(models.Subject).all()

# --- Récupérer uniquement MES quiz (Espace Créateur) ---
@router.get("/my-quizzes", response_model=List[schemas.QuizResponse])
def get_my_quizzes(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Quiz).filter(models.Quiz.creator_id == current_user.id).all()

@router.get("/me/results", response_model=List[schemas.ResultResponse])
def get_my_results(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.Result).filter(models.Result.user_id == current_user.id).all()

@router.get("/admin/all-results")
def get_global_stats(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.role_required(["admin"]))
):
    return db.query(models.Result).all()


# --- Récupérer les quiz par MATIÈRE (ex: tous les quiz de Maths) ---
@router.get("/subject/{subject_id}", response_model=List[schemas.QuizResponse])
def get_quizzes_by_subject(subject_id: int, db: Session = Depends(database.get_db)):
    quizzes = db.query(models.Quiz).filter(models.Quiz.subject_id == subject_id).all()
    return quizzes

# --- ROUTE 4 : Récupérer un quiz spécifique avec tout son contenu ---
@router.get("/{quiz_id}", response_model=schemas.QuizFullResponse) # On utilise le schéma détaillé
def get_quiz_details(quiz_id: int, db: Session = Depends(database.get_db)):
    # On cherche le quiz par son ID
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    
    if not quiz:
        raise HTTPException(
            status_code=404, 
            detail="Quiz non trouvé"
        )
    
    return quiz


# --- ROUTE 2 : Créer un Quiz complet (avec questions et options) ---
@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz_data: schemas.QuizCreate, 
    db: Session = Depends(database.get_db),
    # current_user: models.User = Depends(auth.get_current_user)
    # On force la vérification du rôle ici
    current_user: models.User = Depends(auth.role_required(["teacher", "admin"])) 
):


    # On vérifie si la matière existe
    subject = db.query(models.Subject).filter(models.Subject.id == quiz_data.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Sujet non trouvé")

    try:
        # 1. Créer le Quiz
        new_quiz = models.Quiz(
            title=quiz_data.title,
            description=quiz_data.description,
            subject_id=quiz_data.subject_id,
            creator_id=current_user.id
        )
        db.add(new_quiz)
        db.flush() # Récupère l'ID du quiz sans valider la transaction

        # 2. Créer les Questions
        for q_data in quiz_data.questions:
            new_question = models.Question(
                text=q_data.text,
                quiz_id=new_quiz.id
            )
            db.add(new_question)
            db.flush() # Récupère l'ID de la question

            # 3. Créer les Options
            for opt_data in q_data.options:
                new_option = models.Option(
                    text=opt_data.text,
                    is_correct=opt_data.is_correct,
                    question_id=new_question.id
                )
                db.add(new_option)

        db.commit() # On valide tout d'un coup !
        return {"message": "Quiz créé avec succès", "id": new_quiz.id}

    except Exception as e:
        db.rollback() # Annule tout en cas d'erreur (évite les données orphelines)
        raise HTTPException(status_code=400, detail=str(e))

# --- MODIFIER un quiz (Titre/Description) ---
@router.put("/{quiz_id}", response_model=schemas.QuizResponse)
def update_quiz(
    quiz_id: int, 
    quiz_update: schemas.QuizBase, # On réutilise QuizBase (title, description, subject_id)
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz non trouvé")
    
    if quiz.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Action non autorisée")

    # Mise à jour des champs
    quiz.title = quiz_update.title
    quiz.description = quiz_update.description
    quiz.subject_id = quiz_update.subject_id
    
    db.commit()
    db.refresh(quiz)
    return quiz
# --- SUPPRIMER un quiz ---
@router.delete("/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz(
    quiz_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz non trouvé")
    
    # Vérification de sécurité
    if quiz.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Ce n'est pas votre quiz !")
    
    db.delete(quiz)
    db.commit()
    return None


@router.post("/{quiz_id}/submit")
def submit_quiz(
    quiz_id: int, 
    submission: schemas.QuizSubmission, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user) # Ajout de l'user
):

    # 1. Vérifier si le quiz existe
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz non trouvé")
    
    correct_answers = 0
    # 2. Comparer chaque réponse envoyée avec la base de données
    for answer in submission.answers:
        # Trouver l'option choisie en base
        db_option = db.query(models.Option).filter(
            models.Option.id == answer.option_id,
            models.Option.question_id == answer.question_id
        ).first()
      
        is_right = True
        if db_option and db_option.is_correct:
            correct_answers += 1

        new_result = models.Result(
            user_id=current_user.id,
            quiz_id=quiz_id,
            score=correct_answers,
            total_questions=len(quiz.questions)
        )

        db.add(new_result)
        db.commit()
        db.refresh(new_result)

        return {
            "score": correct_answers,
            "total": len(quiz.questions),
            "result_id": new_result.id,
            "date": new_result.created_at
         }

