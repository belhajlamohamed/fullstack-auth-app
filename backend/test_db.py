from database import SessionLocal
import models

db = SessionLocal()
# On regarde combien de questions il y a en tout
total_questions = db.query(models.Question).count()
# On regarde le premier quiz et ses questions
first_quiz = db.query(models.Quiz).first()

print(f"Total questions en base : {total_questions}")
if first_quiz:
    print(f"Quiz ID: {first_quiz.id} | Titre: {first_quiz.title}")
    # On cherche les questions qui ont cet ID de quiz
    q_for_this_quiz = db.query(models.Question).filter(models.Question.quiz_id == first_quiz.id).count()
    print(f"Questions trouvées pour ce quiz : {q_for_this_quiz}")