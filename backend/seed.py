import database
import models

def seed_subjects():
    # 1. On ouvre une session manuelle
    db = database.SessionLocal()
    
    # 2. Liste des matières à ajouter
    subjects_data = [
        {"name": "Mathématiques", "slug": "maths", "icon": "Calculator"},
        {"name": "Français", "slug": "francais", "icon": "Book"},
        {"name": "Histoire-Géo", "slug": "histoire-geo", "icon": "Globe"},
        {"name": "Sciences (SVT)", "slug": "svt", "icon": "Beaker"},
        {"name": "Anglais", "slug": "anglais", "icon": "Languages"}
    ]

    print("Remplissage des matières...")

    for item in subjects_data:
        # Vérifier si la matière existe déjà pour éviter les doublons
        exists = db.query(models.Subject).filter(models.Subject.slug == item["slug"]).first()
        if not exists:
            new_subject = models.Subject(
                name=item["name"],
                slug=item["slug"],
                icon=item["icon"]
            )
            db.add(new_subject)
    
    db.commit()
    db.close()
    print("Matières insérées avec succès !")

if __name__ == "__main__":
    seed_subjects()