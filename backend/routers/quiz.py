from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func # Ajouté pour de futures stats si besoin
from typing import List
# Import de func pour compter les questions efficacement
from sqlalchemy import func


# On utilise nos imports absolus
import models
import schemas
import auth
import database
from tools import call_gemini_ai
# from schemas.quiz import QuizOut
router = APIRouter(
    prefix="/quizzes",
    tags=["Quizzes"]
)
# Fonction utilitaire pour vérifier si l'utilisateur est actif
def verify_active_user(current_user: models.User = Depends(auth.get_current_user)):
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Votre compte est inactif. Contactez l'administrateur."
        )
    return current_user
# --- SECTION 1 : MATIÈRES (SUBJECTS) ---

# CORRECTION : Une seule route 'get_subjects' suffit.
@router.get("/subjects", response_model=List[schemas.SubjectOut])
def get_subjects(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(verify_active_user)
    ):
    """Récupère la liste de toutes les matières disponibles."""
    return db.query(models.Subject).all()

# --- SECTION 2 : GÉNÉRATION ET CRÉATION ---

@router.post("/generate", response_model=schemas.QuizResponse)
def generate_quiz_ai(
    topic: str, 
    creator_id: int, 
    difficulty: str = "intermediate", 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(verify_active_user)
):
    """Génère un quiz automatiquement via l'IA Gemini."""
    try:
        ai_data = call_gemini_ai(topic, difficulty)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur IA : {str(e)}")

    new_quiz = models.Quiz(
        title=ai_data.title,
        description=f"Quiz {difficulty} généré sur le thème : {topic}",
        creator_id=current_user.id,
        subject_id=1 
    )
    db.add(new_quiz)
    
    try:
        db.flush() 
        for q_data in ai_data.questions:
            new_question = models.Question(
                text=q_data.question_text,
                quiz_id=new_quiz.id
            )
            db.add(new_question)
            db.flush() 

            for idx, opt_text in enumerate(q_data.options):
                is_correct = (idx == q_data.correct_answer_index)
                new_option = models.Option(
                    text=opt_text,
                    is_correct=is_correct,
                    question_id=new_question.id
                )
                db.add(new_option)

        db.commit()
        db.refresh(new_quiz)
        return new_quiz
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erreur d'enregistrement en base")

@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_quiz(
    quiz_data: schemas.QuizCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.role_required(["teacher", "admin"])) 
):
    """Permet à un enseignant de créer manuellement un quiz complet."""
    subject = db.query(models.Subject).filter(models.Subject.id == quiz_data.subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Sujet non trouvé")

    try:
        new_quiz = models.Quiz(
            title=quiz_data.title,
            description=quiz_data.description,
            subject_id=quiz_data.subject_id,
            creator_id=current_user.id
        )
        db.add(new_quiz)
        db.flush()

        for q_data in quiz_data.questions:
            new_question = models.Question(
                text=q_data.text,
                quiz_id=new_quiz.id
            )
            db.add(new_question)
            db.flush()

            for opt_data in q_data.options:
                new_option = models.Option(
                    text=opt_data.text,
                    is_correct=opt_data.is_correct,
                    question_id=new_question.id
                )
                db.add(new_option)

        db.commit()
        return {"message": "Quiz créé avec succès", "id": new_quiz.id}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/all", response_model=List[schemas.QuizResponse])
def get_all_quizzes(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(verify_active_user)
    ):
    # On fait exactement comme ta requête PSQL : 
    # SELECT quiz.*, COUNT(questions.id) FROM quizzes ...
    results = db.query(
        models.Quiz, 
        func.count(models.Question.id).label("total")
    ).outerjoin(models.Question, models.Quiz.id == models.Question.quiz_id).group_by(models.Quiz.id).all()

    quizzes = []
    for quiz, total in results:
        # On injecte manuellement le résultat du COUNT SQL dans l'objet
        quiz.question_count = total
        quizzes.append(quiz)
    
    return quizzes

@router.get("/my-quizzes", response_model=List[schemas.QuizResponse])
def get_my_quizzes(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    """Récupère uniquement les quiz créés par l'utilisateur connecté (Teacher)."""
    return db.query(models.Quiz).filter(models.Quiz.creator_id == current_user.id).all()

@router.get("/subject/{subject_id}", response_model=List[schemas.QuizResponse])
def get_quizzes_by_subject(
    subject_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(verify_active_user)
    ):
    """Filtre les quiz par catégorie/matière."""
    return db.query(models.Quiz).filter(models.Quiz.subject_id == subject_id).all()
    

@router.get("/{quiz_id}", response_model=schemas.QuizFullResponse)
def get_quiz_details(
    quiz_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(verify_active_user)
    ):
    """Récupère un quiz complet avec ses questions et options pour y jouer."""
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz non trouvé")
    
    quiz.question_count = len(quiz.questions)
    return quiz

# --- SECTION 4 : ACTIONS (MODIFICATION / SUPPRESSION / SOUMISSION) ---

@router.put("/{quiz_id}", response_model=schemas.QuizResponse)
def update_quiz(
    quiz_id: int, 
    quiz_update: schemas.QuizBase, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(verify_active_user)
):
    """Modifie les informations de base d'un quiz existant."""
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz non trouvé")
    if quiz.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Action non autorisée")

    quiz.title = quiz_update.title
    quiz.description = quiz_update.description
    quiz.subject_id = quiz_update.subject_id
    
    db.commit()
    db.refresh(quiz)
    return quiz

@router.delete("/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quiz(
    quiz_id: int, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(verify_active_user)
):
    """Supprime un quiz."""
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz non trouvé")
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
    current_user: models.User = Depends(verify_active_user)
):
    """Calcule le score et enregistre le résultat d'une tentative de quiz."""
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz non trouvé")
    
    correct_count = 0
    total = len(quiz.questions)

    for answer in submission.answers:
        db_option = db.query(models.Option).filter(
            models.Option.id == answer.option_id,
            models.Option.question_id == answer.question_id
        ).first()
      
        if db_option and db_option.is_correct:
            correct_count += 1

    score_sur_20 = round((correct_count / total) * 20, 2) if total > 0 else 0

    new_result = models.Result(
        user_id=current_user.id,
        quiz_id=quiz_id,
        score=score_sur_20,
        correct_answers=correct_count,
        total_questions=total
    )

    db.add(new_result)
    db.commit()
    db.refresh(new_result)

    return {
        "score": new_result.score,
        "correct_answers": new_result.correct_answers,
        "total_questions": new_result.total_questions,
        "message": "Quiz terminé !"
    }

# --- SECTION 5 : STATISTIQUES ET RÉSULTATS ---

@router.get("/me/results", response_model=List[schemas.ResultResponse])
def get_my_results(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(verify_active_user)
):
    """Récupère l'historique des scores de l'étudiant connecté."""
    return db.query(models.Result).filter(models.Result.user_id == current_user.id).all()
    

@router.get("/admin/all-results")
def get_global_stats(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.role_required(["admin"]))
):
    """Récupère tous les résultats de la plateforme (Admin uniquement)."""
    return db.query(models.Result).all()











# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from typing import List

# from sqlalchemy.ext.asyncio import AsyncSession


# # On utilise nos imports absolus comme convenu
# import models
# import schemas
# import auth
# import database
# from tools import call_gemini_ai           # Ta fonction IA
# from schemas.quiz import QuizOut

# router = APIRouter(
#     prefix="/quizzes",
#     tags=["Quizzes"]
# )


# @router.get("/subjects", response_model=list[schemas.SubjectOut])
# def get_subjects(db: Session = Depends(database.get_db)):
#     subjects = db.query(models.Subject).all()
#     return subjects

# @router.post("/generate", response_model=schemas.QuizOut)
# def generate_quiz_ai(
#     topic: str, 
#     creator_id: int, 
#     difficulty: str = "intermediate", 
#     db: Session = Depends(database.get_db)
# ):
#     try:
#         ai_data = call_gemini_ai(topic, difficulty)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Erreur IA : {str(e)}")

#     # Création du Quiz
#     new_quiz = models.Quiz(
#         title=ai_data.title,
#         description=f"Quiz {difficulty} généré sur le thème : {topic}",
#         creator_id=creator_id,
#         subject_id=1 # Assure-toi que cet ID existe ou demande-le en paramètre
#     )
#     db.add(new_quiz)
    
#     try:
#         db.flush() 
#         for q_data in ai_data.questions:
#             new_question = models.Question(
#                 text=q_data.question_text,
#                 quiz_id=new_quiz.id
#             )
#             db.add(new_question)
#             db.flush() 

#             for idx, opt_text in enumerate(q_data.options):
#                 is_correct = (idx == q_data.correct_answer_index)
#                 new_option = models.Option(
#                     text=opt_text,
#                     is_correct=is_correct,
#                     question_id=new_question.id
#                 )
#                 db.add(new_option)

#         db.commit()
#         db.refresh(new_quiz)
#         return new_quiz
#     except Exception as e:
#         db.rollback() # Annule tout si une erreur survient
#         raise HTTPException(status_code=500, detail="Erreur d'enregistrement en base")
# # --- Récupérer TOUS les quiz (pour la page d'accueil) ---
# @router.get("/all", response_model=List[schemas.QuizResponse])
# def get_all_quizzes(db: Session = Depends(database.get_db)):
#     return db.query(models.Quiz).all()




# # --- Récupérer uniquement MES quiz (Espace Créateur) ---
# @router.get("/my-quizzes", response_model=List[schemas.QuizResponse])
# def get_my_quizzes(
#     db: Session = Depends(database.get_db), 
#     current_user: models.User = Depends(auth.get_current_user)
# ):
#     return db.query(models.Quiz).filter(models.Quiz.creator_id == current_user.id).all()

# @router.get("/me/results", response_model=List[schemas.ResultResponse])
# def get_my_results(
#     db: Session = Depends(database.get_db),
#     current_user: models.User = Depends(auth.get_current_user)
# ):
#     return db.query(models.Result).filter(models.Result.user_id == current_user.id).all()

# @router.get("/admin/all-results")
# def get_global_stats(
#     db: Session = Depends(database.get_db),
#     current_user: models.User = Depends(auth.role_required(["admin"]))
# ):
#     return db.query(models.Result).all()


# # --- Récupérer les quiz par MATIÈRE (ex: tous les quiz de Maths) ---
# @router.get("/subject/{subject_id}", response_model=List[schemas.QuizResponse])
# def get_quizzes_by_subject(subject_id: int, db: Session = Depends(database.get_db)):
#     quizzes = db.query(models.Quiz).filter(models.Quiz.subject_id == subject_id).all()
#     return quizzes

# # --- ROUTE 4 : Récupérer un quiz spécifique avec tout son contenu ---
# @router.get("/{quiz_id}", response_model=schemas.QuizFullResponse) # On utilise le schéma détaillé
# def get_quiz_details(quiz_id: int, db: Session = Depends(database.get_db)):
#     # On cherche le quiz par son ID
#     quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    
#     if not quiz:
#         raise HTTPException(
#             status_code=404, 
#             detail="Quiz non trouvé"
#         )
    
#     return quiz


# # --- ROUTE 2 : Créer un Quiz complet (avec questions et options) ---
# @router.post("/create", status_code=status.HTTP_201_CREATED)
# def create_quiz(
#     quiz_data: schemas.QuizCreate, 
#     db: Session = Depends(database.get_db),
#     # current_user: models.User = Depends(auth.get_current_user)
#     # On force la vérification du rôle ici
#     current_user: models.User = Depends(auth.role_required(["teacher", "admin"])) 
# ):


#     # On vérifie si la matière existe
#     subject = db.query(models.Subject).filter(models.Subject.id == quiz_data.subject_id).first()
#     if not subject:
#         raise HTTPException(status_code=404, detail="Sujet non trouvé")

#     try:
#         # 1. Créer le Quiz
#         new_quiz = models.Quiz(
#             title=quiz_data.title,
#             description=quiz_data.description,
#             subject_id=quiz_data.subject_id,
#             creator_id=current_user.id
#         )
#         db.add(new_quiz)
#         db.flush() # Récupère l'ID du quiz sans valider la transaction

#         # 2. Créer les Questions
#         for q_data in quiz_data.questions:
#             new_question = models.Question(
#                 text=q_data.text,
#                 quiz_id=new_quiz.id
#             )
#             db.add(new_question)
#             db.flush() # Récupère l'ID de la question

#             # 3. Créer les Options
#             for opt_data in q_data.options:
#                 new_option = models.Option(
#                     text=opt_data.text,
#                     is_correct=opt_data.is_correct,
#                     question_id=new_question.id
#                 )
#                 db.add(new_option)

#         db.commit() # On valide tout d'un coup !
#         return {"message": "Quiz créé avec succès", "id": new_quiz.id}

#     except Exception as e:
#         db.rollback() # Annule tout en cas d'erreur (évite les données orphelines)
#         raise HTTPException(status_code=400, detail=str(e))

# # --- MODIFIER un quiz (Titre/Description) ---
# @router.put("/{quiz_id}", response_model=schemas.QuizResponse)
# def update_quiz(
#     quiz_id: int, 
#     quiz_update: schemas.QuizBase, # On réutilise QuizBase (title, description, subject_id)
#     db: Session = Depends(database.get_db),
#     current_user: models.User = Depends(auth.get_current_user)
# ):
#     quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    
#     if not quiz:
#         raise HTTPException(status_code=404, detail="Quiz non trouvé")
    
#     if quiz.creator_id != current_user.id:
#         raise HTTPException(status_code=403, detail="Action non autorisée")

#     # Mise à jour des champs
#     quiz.title = quiz_update.title
#     quiz.description = quiz_update.description
#     quiz.subject_id = quiz_update.subject_id
    
#     db.commit()
#     db.refresh(quiz)
#     return quiz
# # --- SUPPRIMER un quiz ---
# @router.delete("/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_quiz(
#     quiz_id: int, 
#     db: Session = Depends(database.get_db),
#     current_user: models.User = Depends(auth.get_current_user)
# ):
#     quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    
#     if not quiz:
#         raise HTTPException(status_code=404, detail="Quiz non trouvé")
    
#     # Vérification de sécurité
#     if quiz.creator_id != current_user.id:
#         raise HTTPException(status_code=403, detail="Ce n'est pas votre quiz !")
    
#     db.delete(quiz)
#     db.commit()
#     return None


# @router.post("/{quiz_id}/submit")
# def submit_quiz(
#     quiz_id: int, 
#     submission: schemas.QuizSubmission, 
#     db: Session = Depends(database.get_db),
#     current_user: models.User = Depends(auth.get_current_user)
# ):
#     quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
#     if not quiz:
#         raise HTTPException(status_code=404, detail="Quiz non trouvé")
    
#     correct_count = 0
#     total = len(quiz.questions)

#     for answer in submission.answers:
#         db_option = db.query(models.Option).filter(
#             models.Option.id == answer.option_id,
#             models.Option.question_id == answer.question_id
#         ).first()
      
#         if db_option and db_option.is_correct:
#             correct_count += 1

#     # Calcul du score sur 20 pour le frontend
#     score_sur_20 = round((correct_count / total) * 20, 2) if total > 0 else 0

#     # Création du résultat avec les nouveaux champs
#     new_result = models.Result(
#         user_id=current_user.id,
#         quiz_id=quiz_id,
#         score=score_sur_20,
#         correct_answers=correct_count, # Maintenant accepté
#         total_questions=total          # Maintenant accepté
#     )

#     db.add(new_result)
#     db.commit()
#     db.refresh(new_result)

#     # Retourner l'objet pour le frontend (QuizPlay.jsx)
#     return {
#         "score": new_result.score,
#         "correct_answers": new_result.correct_answers,
#         "total_questions": new_result.total_questions,
#         "message": "Quiz terminé !"
#     }