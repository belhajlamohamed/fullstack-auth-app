import os
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential
from schemas.quiz import QuizAISchema

# Initialisation du client avec la clé API du fichier .env
# Assure-toi d'avoir GEMINI_API_KEY=ton_code dans ton fichier .env
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

@retry(
    stop=stop_after_attempt(3), 
    wait=wait_exponential(multiplier=1, min=4, max=10)
)
def call_gemini_ai(topic: str, difficulty: str = "Intermédiaire"):
    """
    Appelle l'IA Gemini pour générer un quiz structuré selon le schéma Pydantic.
    """
    
    prompt = f"Génère un quiz de niveau {difficulty} sur le thème suivant : {topic}."

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", # Ou gemini-1.5-flash selon ton accès
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction="Tu es un expert en pédagogie. Génère 10 questions précises avec 4 options. Une seule option est correcte.",
                response_mime_type="application/json",
                response_schema=QuizAISchema,
            )
        )
        
        # .parsed renvoie directement un objet Python correspondant à QuizAISchema
        return response.parsed

    except Exception as e:
        print(f"Erreur lors de l'appel Gemini: {e}")
        raise e