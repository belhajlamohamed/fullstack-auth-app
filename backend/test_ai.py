import google.generativeai as genai
from pydantic import BaseModel
from typing import List

# Votre configuration
genai.configure(api_key="AIzaSyCeqzZn7BeKiXR5XxuHW63h99N0jfQfczk")
model = genai.GenerativeModel('gemini-2.5-flash')

# Test de génération
prompt = "Génère une question de quiz sur la continuité d'une fonction avec du LaTeX entouré de $."
response = model.generate_content(
    prompt,
    generation_config={"response_mime_type": "application/json"}
)

print(response.text)