# Fullstack Auth App (FastAPI + React)

Système d'authentification complet avec JWT, validation Pydantic et protection de routes.

## Installation et Lancement

### 1. Backend (FastAPI)
```bash
cd backend
# Créer l'environnement virtuel (si pas déjà fait)
python -m venv venv
source venv/scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Lancer le serveur
uvicorn main:app --reload

cd frontend
npm install
npm run dev