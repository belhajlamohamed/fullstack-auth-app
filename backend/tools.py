import os
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential
from schemas.quiz import QuizAISchema
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY non trouvée. Vérifie ton fichier .env")

client = genai.Client(api_key=api_key)

@retry(
    stop=stop_after_attempt(3), 
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
def call_gemini_ai(topic: str, difficulty: str = "Intermédiaire"):
    # Correction du nom du modèle : 2.0-flash ou 1.5-flash
    model_id = "gemini-1.5-flash" 
    
    prompt = f"Génère un quiz de niveau {difficulty} sur le thème suivant : {topic}."

    try:
        response = client.models.generate_content(
            model=model_id,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=(
                    "Tu es un expert en pédagogie. Génère 10 questions précises. "
                    "Chaque question doit avoir exactement 4 options dont une seule est correcte. "
                    "Réponds strictement au format JSON."
                ),
                response_mime_type="application/json",
                response_schema=QuizAISchema,
            )
        )
        return response.parsed
    except Exception as e:
        print(f"Erreur Gemini : {e}")
        raise e