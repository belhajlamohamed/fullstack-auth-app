from fastapi import FastAPI
from routers import user_router, quiz_router,student_router,teacher_router,secretaire_router,academic_router
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base

# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduQuiz API",
    description="API Fullstack pour la gestion de quiz scolaires",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"], # L'URL de ton projet React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# On inclut les routes du fichier auth.py
app.include_router(user_router)
app.include_router(quiz_router)
app.include_router(teacher_router)
app.include_router(student_router)
app.include_router(secretaire_router)
app.include_router(academic_router)

@app.get("/")
async def root():
    return {
        "message": "Bienvenue sur l'API EduQuiz",
        "docs": "/docs",
        "status": "online"
    }