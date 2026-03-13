from sqlalchemy.orm import Session
from database import SessionLocal
from models import Cycle, Level, Filiere, Subject, User, UserRole, EnrollmentStatus
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed():
    db = SessionLocal()
    try:
        print("Nettoyage partiel et début du remplissage...")

        # 1. Cycle Lycée
        lycee = Cycle(name="Lycée")
        db.add(lycee)
        db.commit()
        db.refresh(lycee)

        # 2. Niveaux (Levels)
        tc = Level(name="Tronc Commun", cycle_id=lycee.id)
        bac1 = Level(name="1ère Bac", cycle_id=lycee.id)
        bac2 = Level(name="2ème Bac", cycle_id=lycee.id)
        db.add_all([tc, bac1, bac2])
        db.commit()
        db.refresh(tc); db.refresh(bac1); db.refresh(bac2)

        # 3. Filières (Filieres) - Basé sur tes captures d'écran
        filieres_data = [
            # Tronc Commun
            {"name": "Sciences", "level_id": tc.id},
            {"name": "Technologies", "level_id": tc.id},
            {"name": "Lettres et Sciences Humaines", "level_id": tc.id},
            # 1ère Bac
            {"name": "Sciences Mathématiques", "level_id": bac1.id},
            {"name": "Sciences Expérimentales", "level_id": bac1.id},
            {"name": "Sciences et Technologies Électriques", "level_id": bac1.id},
            {"name": "Sciences et Technologies Mécaniques", "level_id": bac1.id},
            {"name": "Sciences Économiques et Gestion", "level_id": bac1.id},
            # 2ème Bac
            {"name": "Sciences Mathématiques A", "level_id": bac2.id},
            {"name": "Sciences Mathématiques B", "level_id": bac2.id},
            {"name": "Sciences Physiques", "level_id": bac2.id},
            {"name": "Sciences de la Vie et de la Terre (SVT)", "level_id": bac2.id},
            {"name": "Sciences Agronomiques", "level_id": bac2.id},
        ]
        
        filieres_objs = []
        for f in filieres_data:
            obj = Filiere(name=f["name"], level_id=f["level_id"])
            db.add(obj)
            filieres_objs.append(obj)
        db.commit()

        # 4. Matières (Subjects) - Ajoutées à la filière "Sciences Physiques" de la 2ème Bac à titre d'exemple
        # Tu peux boucler pour les ajouter à toutes les filières si nécessaire
        filiere_pc = next(f for f in filieres_objs if f.name == "Sciences Physiques" and f.level_id == bac2.id)
        
        subjects_names = [
            "Mathématiques", "Mathématiques (BIOF)", 
            "Physique et Chimie", "Physique et Chimie (BIOF)", 
            "Sciences de la Vie et de la Terre (SVT)", "Sciences de la Vie et de la Terre (SVT BIOF)",
            "Arabe", "Français", "Anglais", "Philosophie"
        ]

        for s_name in subjects_names:
            db.add(Subject(name=s_name, filiere_id=filiere_pc.id))
        
        # 5. Utilisateur Admin/Secrétaire par défaut
        if not db.query(User).filter(User.email == "admin@ecole.com").first():
            admin = User(
                username="admin_principal",
                email="admin@ecole.com",
                hashed_password=pwd_context.hash("admin123"),
                role=UserRole.ADMIN,
                is_active=True,
                is_email_verified=True,
                enrollment_status=EnrollmentStatus.ACTIVE
            )
            db.add(admin)

        db.commit()
        print("Base de données synchronisée avec succès ! 🚀")

    except Exception as e:
        print(f"Erreur : {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()