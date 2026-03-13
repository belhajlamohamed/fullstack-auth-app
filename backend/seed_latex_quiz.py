import os
from sqlalchemy.orm import Session
from database import SessionLocal
from models.quiz import Quiz, Question, Option, DifficultyEnum

def seed_all_math_quizzes():
    db: Session = SessionLocal()
    
    # --- CONFIGURATION AUTOMATIQUE DE L'ENUM ---
    # On récupère les valeurs réelles de ton Enum pour éviter l'erreur "InvalidTextRepresentation"
    levels = {e.name.lower(): e for e in DifficultyEnum}
    
    def get_difficulty(key):
        # Cherche une correspondance flexible (ex: 'advanced' ou 'difficile')
        for name, member in levels.items():
            if key in name or name in key:
                return member
        return list(DifficultyEnum)[0] # Par défaut le premier si rien n'est trouvé

    # Mappage des niveaux
    DIFF_INTER = get_difficulty('inter')
    DIFF_ADV = get_difficulty('adv') or get_difficulty('diff') or get_difficulty('expert')

    print(f"DEBUG: Niveaux détectés -> Intermédiaire: {DIFF_INTER}, Avancé: {DIFF_ADV}")

    # CONFIGURATION DES IDs
    CREATOR_ID = 1 
    SUBJECT_ID = 1

    quizzes_to_create = [
        {
            "title": "Suites Numériques",
            "topic": "Suites arithmétiques et géométriques",
            "difficulty": DIFF_INTER,
            "questions": [
                {"text": r"Formule du terme général d'une suite arithmétique :", "options": [{"text": r"$u_n = u_0 + nr$", "is_correct": True}, {"text": r"$u_n = u_0 \times r^n$", "is_correct": False}, {"text": r"$u_n = u_0 + (n-1)r$", "is_correct": False}, {"text": r"$u_n = u_r + n$", "is_correct": False}]},
                {"text": r"Somme des $n$ premiers entiers naturels :", "options": [{"text": r"$\frac{n(n+1)}{2}$", "is_correct": True}, {"text": r"$\frac{n(n-1)}{2}$", "is_correct": False}, {"text": r"$n^2$", "is_correct": False}, {"text": r"$\frac{n^2}{2}$", "is_correct": False}]},
                {"text": r"Limite de $q^n$ si $|q| < 1$ :", "options": [{"text": r"$0$", "is_correct": True}, {"text": r"$1$", "is_correct": False}, {"text": r"$+\infty$", "is_correct": False}, {"text": r"$-1$", "is_correct": False}]},
                {"text": r"Une suite est géométrique si $u_{n+1} = $", "options": [{"text": r"$q \times u_n$", "is_correct": True}, {"text": r"$q + u_n$", "is_correct": False}, {"text": r"$u_n^q$", "is_correct": False}, {"text": r"$\frac{u_n}{q}$", "is_correct": False}]},
                {"text": r"Si $u_n = 2^n$, la suite est :", "options": [{"text": r"Géométrique", "is_correct": True}, {"text": r"Arithmétique", "is_correct": False}, {"text": r"Convergente", "is_correct": False}, {"text": r"Constante", "is_correct": False}]},
                {"text": r"Limite de $\frac{n^2+1}{2n^2}$ :", "options": [{"text": r"$\frac{1}{2}$", "is_correct": True}, {"text": r"$1$", "is_correct": False}, {"text": r"$0$", "is_correct": False}, {"text": r"$\infty$", "is_correct": False}]},
                {"text": r"Une suite $(u_n)$ minorée et décroissante :", "options": [{"text": r"Converge", "is_correct": True}, {"text": r"Diverge vers $-\infty$", "is_correct": False}, {"text": r"Est constante", "is_correct": False}, {"text": r"Est arithmétique", "is_correct": False}]},
                {"text": r"La raison de $u_n = 5 - 2n$ est :", "options": [{"text": r"$-2$", "is_correct": True}, {"text": r"$5$", "is_correct": False}, {"text": r"$2$", "is_correct": False}, {"text": r"$-5$", "is_correct": False}]},
                {"text": r"Somme $1+q+q^2+...+q^n$ :", "options": [{"text": r"$\frac{1-q^{n+1}}{1-q}$", "is_correct": True}, {"text": r"$\frac{1-q^n}{1-q}$", "is_correct": False}, {"text": r"$\frac{q^n}{1-q}$", "is_correct": False}, {"text": r"$n \times q$", "is_correct": False}]},
                {"text": r"Si $u_{n+1}-u_n > 0$, la suite est :", "options": [{"text": r"Strictement croissante", "is_correct": True}, {"text": r"Décroissante", "is_correct": False}, {"text": r"Géométrique", "is_correct": False}, {"text": r"Négative", "is_correct": False}]},
            ]
        },
        {
            "title": "Nombres Complexes",
            "topic": "Forme algébrique et exponentielle",
            "difficulty": DIFF_ADV,
            "questions": [
                {"text": r"Valeur de $i^2$ :", "options": [{"text": r"$-1$", "is_correct": True}, {"text": r"$1$", "is_correct": False}, {"text": r"$i$", "is_correct": False}, {"text": r"$0$", "is_correct": False}]},
                {"text": r"Module de $z=3+4i$ :", "options": [{"text": r"$5$", "is_correct": True}, {"text": r"$25$", "is_correct": False}, {"text": r"$7$", "is_correct": False}, {"text": r"$\sqrt{7}$", "is_correct": False}]},
                {"text": r"Argument de $z=i$ :", "options": [{"text": r"$\frac{\pi}{2}$", "is_correct": True}, {"text": r"$0$", "is_correct": False}, {"text": r"$\pi$", "is_correct": False}, {"text": r"$-\frac{\pi}{2}$", "is_correct": False}]},
                {"text": r"Conjugué de $z=a+bi$ :", "options": [{"text": r"$a-bi$", "is_correct": True}, {"text": r"$-a+bi$", "is_correct": False}, {"text": r"$a+bi$", "is_correct": False}, {"text": r"$-a-bi$", "is_correct": False}]},
                {"text": r"Forme exponentielle de $1+i$ :", "options": [{"text": r"$\sqrt{2}e^{i\pi/4}$", "is_correct": True}, {"text": r"$2e^{i\pi/4}$", "is_correct": False}, {"text": r"$\sqrt{2}e^{i\pi/2}$", "is_correct": False}, {"text": r"$e^{i\pi/4}$", "is_correct": False}]},
                {"text": r"Valeur de $e^{i\pi}$ :", "options": [{"text": r"$-1$", "is_correct": True}, {"text": r"$1$", "is_correct": False}, {"text": r"$i$", "is_correct": False}, {"text": r"$0$", "is_correct": False}]},
                {"text": r"Partie réelle de $z=e^{i\theta}$ :", "options": [{"text": r"$\cos \theta$", "is_correct": True}, {"text": r"$\sin \theta$", "is_correct": False}, {"text": r"$1$", "is_correct": False}, {"text": r"$e$", "is_correct": False}]},
                {"text": r"$(\cos \theta + i\sin \theta)^n$ est égal à :", "options": [{"text": r"$\cos(n\theta) + i\sin(n\theta)$", "is_correct": True}, {"text": r"$\cos^n \theta + i\sin^n \theta$", "is_correct": False}, {"text": r"$n\cos \theta$", "is_correct": False}, {"text": r"$\cos(\theta^n)$", "is_correct": False}]},
                {"text": r"Si $|z|=1$, alors $z\bar{z} = $", "options": [{"text": r"$1$", "is_correct": True}, {"text": r"$0$", "is_correct": False}, {"text": r"$i$", "is_correct": False}, {"text": r"$-1$", "is_correct": False}]},
                {"text": r"L'équation $z^2 = -4$ a pour solutions :", "options": [{"text": r"$\{2i, -2i\}$", "is_correct": True}, {"text": r"$\{2, -2\}$", "is_correct": False}, {"text": r"$\{4i, -4i\}$", "is_correct": False}, {"text": r"$\emptyset$", "is_correct": False}]},
            ]
        },
        {
            "title": "Fonction Logarithme",
            "topic": "Propriétés du logarithme népérien",
            "difficulty": DIFF_INTER,
            "questions": [
                {"text": r"$\ln(e) = $", "options": [{"text": r"$1$", "is_correct": True}, {"text": r"$0$", "is_correct": False}, {"text": r"$e$", "is_correct": False}, {"text": r"$\infty$", "is_correct": False}]},
                {"text": r"$\ln(ab) = $", "options": [{"text": r"$\ln a + \ln b$", "is_correct": True}, {"text": r"$\ln a \times \ln b$", "is_correct": False}, {"text": r"$\ln(a+b)$", "is_correct": False}, {"text": r"$\ln a - \ln b$", "is_correct": False}]},
                {"text": r"Dérivée de $\ln(x)$ :", "options": [{"text": r"$\frac{1}{x}$", "is_correct": True}, {"text": r"$e^x$", "is_correct": False}, {"text": r"$\frac{1}{x^2}$", "is_correct": False}, {"text": r"$\ln'x$", "is_correct": False}]},
                {"text": r"$\ln(x)$ est définie sur :", "options": [{"text": r"$]0, +\infty[$", "is_correct": True}, {"text": r"$\mathbb{R}$", "is_correct": False}, {"text": r"$[0, +\infty[$", "is_correct": False}, {"text": r"$\mathbb{R}^*$", "is_correct": False}]},
                {"text": r"Limite de $\ln x$ en $0^+$ :", "options": [{"text": r"$-\infty$", "is_correct": True}, {"text": r"$0$", "is_correct": False}, {"text": r"$+\infty$", "is_correct": False}, {"text": r"$-1$", "is_correct": False}]},
                {"text": r"$\ln(\frac{1}{x}) = $", "options": [{"text": r"$-\ln x$", "is_correct": True}, {"text": r"$\frac{1}{\ln x}$", "is_correct": False}, {"text": r"$\ln x$", "is_correct": False}, {"text": r"$e^{-x}$", "is_correct": False}]},
                {"text": r"$\ln(x^n) = $", "options": [{"text": r"$n\ln x$", "is_correct": True}, {"text": r"$(\ln x)^n$", "is_correct": False}, {"text": r"$n + \ln x$", "is_correct": False}, {"text": r"$e^n$", "is_correct": False}]},
                {"text": r"$\ln(1) = $", "options": [{"text": r"$0$", "is_correct": True}, {"text": r"$1$", "is_correct": False}, {"text": r"$e$", "is_correct": False}, {"text": r"$-1$", "is_correct": False}]},
                {"text": r"Si $\ln x = 0$, alors $x = $", "options": [{"text": r"$1$", "is_correct": True}, {"text": r"$0$", "is_correct": False}, {"text": r"$e$", "is_correct": False}, {"text": r"$\emptyset$", "is_correct": False}]},
                {"text": r"Limite de $\frac{\ln x}{x}$ en $+\infty$ :", "options": [{"text": r"$0$", "is_correct": True}, {"text": r"$1$", "is_correct": False}, {"text": r"$+\infty$", "is_correct": False}, {"text": r"$e$", "is_correct": False}]},
            ]
        },
        {
            "title": "Fonction Exponentielle",
            "topic": "Propriétés de exp(x)",
            "difficulty": DIFF_INTER,
            "questions": [
                {"text": r"$e^0 = $", "options": [{"text": r"$1$", "is_correct": True}, {"text": r"$0$", "is_correct": False}, {"text": r"$e$", "is_correct": False}, {"text": r"$\infty$", "is_correct": False}]},
                {"text": r"Dérivée de $e^x$ :", "options": [{"text": r"$e^x$", "is_correct": True}, {"text": r"$xe^{x-1}$", "is_correct": False}, {"text": r"$\frac{1}{e^x}$", "is_correct": False}, {"text": r"$\ln x$", "is_correct": False}]},
                {"text": r"$e^{a+b} = $", "options": [{"text": r"$e^a \times e^b$", "is_correct": True}, {"text": r"$e^a + e^b$", "is_correct": False}, {"text": r"$e^{ab}$", "is_correct": False}, {"text": r"$\frac{e^a}{e^b}$", "is_correct": False}]},
                {"text": r"Limite de $e^x$ en $-\infty$ :", "options": [{"text": r"$0$", "is_correct": True}, {"text": r"$-\infty$", "is_correct": False}, {"text": r"$1$", "is_correct": False}, {"text": r"$\text{indéfinie}$", "is_correct": False}]},
                {"text": r"$\exp(\ln x) = $", "options": [{"text": r"$x$", "is_correct": True}, {"text": r"$e^x$", "is_correct": False}, {"text": r"$1$", "is_correct": False}, {"text": r"$\ln e$", "is_correct": False}]},
                {"text": r"La fonction $e^x$ est toujours :", "options": [{"text": r"Strictement positive", "is_correct": True}, {"text": r"Négative", "is_correct": False}, {"text": r"Nulle en 0", "is_correct": False}, {"text": r"Décroissante", "is_correct": False}]},
                {"text": r"$(e^a)^n = $", "options": [{"text": r"$e^{an}$", "is_correct": True}, {"text": r"$e^{a+n}$", "is_correct": False}, {"text": r"$e^{a^n}$", "is_correct": False}, {"text": r"$n e^a$", "is_correct": False}]},
                {"text": r"Dérivée de $e^{u(x)}$ :", "options": [{"text": r"$u'(x)e^{u(x)}$", "is_correct": True}, {"text": r"$e^{u(x)}$", "is_correct": False}, {"text": r"$u(x)e^u$", "is_correct": False}, {"text": r"$u' + e^u$", "is_correct": False}]},
                {"text": r"Limite de $e^x$ en $+\infty$ :", "options": [{"text": r"$+\infty$", "is_correct": True}, {"text": r"$0$", "is_correct": False}, {"text": r"$1$", "is_correct": False}, {"text": r"$e$", "is_correct": False}]},
                {"text": r"L'inverse de $e^x$ est :", "options": [{"text": r"$\ln x$", "is_correct": True}, {"text": r"$\frac{1}{e^x}$", "is_correct": False}, {"text": r"$e^{-x}$", "is_correct": False}, {"text": r"$\sqrt{x}$", "is_correct": False}]},
            ]
        },
        {
            "title": "Continuité",
            "topic": "Limites et TVI",
            "difficulty": DIFF_ADV,
            "questions": [
                {"text": r"$f$ continue en $a$ si $\lim_{x \to a} f(x) = $", "options": [{"text": r"$f(a)$", "is_correct": True}, {"text": r"$0$", "is_correct": False}, {"text": r"$1$", "is_correct": False}, {"text": r"$\infty$", "is_correct": False}]},
                {"text": r"Le TVI nécessite que $f$ soit :", "options": [{"text": r"Continue", "is_correct": True}, {"text": r"Dérivable", "is_correct": False}, {"text": r"Positive", "is_correct": False}, {"text": r"Constante", "is_correct": False}]},
                {"text": r"$\lim_{x \to 0} \frac{\sin x}{x} = $", "options": [{"text": r"$1$", "is_correct": True}, {"text": r"$0$", "is_correct": False}, {"text": r"$\infty$", "is_correct": False}, {"text": r"$-1$", "is_correct": False}]},
                {"text": r"Une fonction dérivable est :", "options": [{"text": r"Nécessairement continue", "is_correct": True}, {"text": r"Parfois continue", "is_correct": False}, {"text": r"Toujours positive", "is_correct": False}, {"text": r"Nécessairement croissante", "is_correct": False}]},
                {"text": r"La fonction $\frac{1}{x}$ est discontinue en :", "options": [{"text": r"$0$", "is_correct": True}, {"text": r"$1$", "is_correct": False}, {"text": r"$-1$", "is_correct": False}, {"text": r"$\pi$", "is_correct": False}]},
                {"text": r"Si $f(a)f(b) < 0$, alors $f(x)=0$ a :", "options": [{"text": r"Au moins une solution", "is_correct": True}, {"text": r"Aucune solution", "is_correct": False}, {"text": r"Une solution unique", "is_correct": False}, {"text": r"Deux solutions", "is_correct": False}]},
                {"text": r"Une fonction continue sur $[a,b]$ est :", "options": [{"text": r"Bornée", "is_correct": True}, {"text": r"Positive", "is_correct": False}, {"text": r"Nulle", "is_correct": False}, {"text": r"Périodique", "is_correct": False}]},
                {"text": r"Limite de $\sqrt{x}$ en $0^+$ :", "options": [{"text": r"$0$", "is_correct": True}, {"text": r"$1$", "is_correct": False}, {"text": r"$\infty$", "is_correct": False}, {"text": r"$\text{indéfinie}$", "is_correct": False}]},
                {"text": r"$\lim_{x \to +\infty} \frac{1}{x} = $", "options": [{"text": r"$0$", "is_correct": True}, {"text": r"$\infty$", "is_correct": False}, {"text": r"$1$", "is_correct": False}, {"text": r"$-1$", "is_correct": False}]},
                {"text": r"Une bijection continue est :", "options": [{"text": r"Strictement monotone", "is_correct": True}, {"text": r"Périodique", "is_correct": False}, {"text": r"Constante", "is_correct": False}, {"text": r"Linéaire", "is_correct": False}]},
            ]
        }
    ]

    try:
        for q_data in quizzes_to_create:
            new_quiz = Quiz(
                title=q_data["title"],
                topic=q_data["topic"],
                difficulty=q_data["difficulty"],
                creator_id=CREATOR_ID,
                subject_id=SUBJECT_ID,
                description=f"Quiz complet sur {q_data['title'].lower()}."
            )
            db.add(new_quiz)
            db.flush()

            for quest in q_data["questions"]:
                question = Question(text=quest["text"], quiz_id=new_quiz.id)
                db.add(question)
                db.flush()

                for opt in quest["options"]:
                    db.add(Option(text=opt["text"], is_correct=opt["is_correct"], question_id=question.id))
        
        db.commit()
        print(f"✅ Succès : 5 quiz mathématiques (50 questions) insérés !")
    except Exception as e:
        db.rollback()
        print(f"❌ Erreur lors de l'insertion : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_all_math_quizzes()