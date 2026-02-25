# Base Python légère
FROM python:3.11-slim

# ⚡ Éviter les fichiers pyc et activer output immédiat
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Définir le répertoire de travail
WORKDIR /app

# Installer dépendances système nécessaires pour PostgreSQL et compilation
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copier uniquement requirements pour accélérer le build Docker
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application (le volume le remplacera en DEV)
COPY ./app ./app

# Exposer le port FastAPI
EXPOSE 8000

# Commande par défaut pour DEV avec reload
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]