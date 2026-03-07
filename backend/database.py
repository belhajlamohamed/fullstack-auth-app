import os
# from sqlalchemy import create_all
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Chargement des variables d'environnement depuis le fichier .env
load_dotenv()

# Par défaut, on utilise SQLite pour le développement local
# Dans ton .env, tu pourras mettre DATABASE_URL=postgresql://user:password@localhost/dbname
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

# Configuration de l'engine
# "check_same_thread": False est nécessaire uniquement pour SQLite
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Création de la session locale
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base de classe pour nos modèles SQLAlchemy
Base = declarative_base()

# Dépendance pour obtenir la session de base de données dans les routes FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()