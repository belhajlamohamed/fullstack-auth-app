import os
import aiosmtplib
import logging
from email.message import EmailMessage
from dotenv import load_dotenv

# Charger les variables du fichier .env
load_dotenv()

logger = logging.getLogger(__name__)

async def send_verification_email(email: str, token: str):
    # Récupération des variables d'environnement
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))

    # Vérification de sécurité
    if not smtp_user or not smtp_password:
        logger.error("❌ SMTP_USER ou SMTP_PASSWORD non configurés dans le fichier .env")
        return

    message = EmailMessage()
    message["From"] = smtp_user
    message["To"] = email
    message["Subject"] = "Vérification de votre compte"
    
    # Construction du lien
    link = f"http://localhost:8000/users/verify-email?token={token}"
    
    message.set_content(f"""
    Bonjour,

    Merci de vous être inscrit ! 
    Veuillez cliquer sur le lien ci-dessous pour activer votre compte :
    {link}

    Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.
    """)

    try:
        await aiosmtplib.send(
            message,
            hostname=smtp_host,
            port=smtp_port,
            start_tls=True,
            username=smtp_user,
            password=smtp_password,
            timeout=10
        )
        # On garde le log pour confirmer l'envoi dans le terminal
        print(f"✅ Email envoyé avec succès à {email}", flush=True)
        print(f"🔗 Lien généré pour utilisateur {email}(Backup console) : {link}", flush=True)
        
    except Exception as e:
        logger.error(f"❌ Erreur SMTP lors de l'envoi à {email}: {str(e)}")



async def send_reset_password_email(email: str, token: str):
    """
    Envoie un e-mail contenant un lien sécurisé pour réinitialiser le mot de passe.
    """
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    # On récupère l'URL du frontend pour que l'utilisateur soit redirigé vers une page React/Vue
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    if not smtp_user or not smtp_password:
        logger.error("❌ Configuration SMTP manquante dans le .env")
        return

    message = EmailMessage()
    message["From"] = smtp_user
    message["To"] = email
    message["Subject"] = "Réinitialisation de votre mot de passe"
    
    # Le lien pointe vers le frontend qui devra ensuite appeler ton API
    link = f"{frontend_url}/reset-password?token={token}"
    
    message.set_content(f"""
    Bonjour,

    Vous avez demandé la réinitialisation de votre mot de passe. 
    Veuillez cliquer sur le lien ci-dessous pour choisir un nouveau mot de passe :
    {link}

    Ce lien est valable pour une durée limitée.
    Si vous n'avez pas demandé ce changement, vous pouvez ignorer cet e-mail en toute sécurité.
    """)

    try:
        await aiosmtplib.send(
            message,
            hostname=smtp_host,
            port=smtp_port,
            start_tls=True,
            username=smtp_user,
            password=smtp_password,
            timeout=10
        )
        print(f"✅ Email de réinitialisation envoyé à {email}", flush=True)
        # Backup console en cas de problème de délivrabilité
        print(f"🔗 Lien Reset (Backup) : {link}", flush=True)
        
    except Exception as e:
        logger.error(f"❌ Erreur lors de l'envoi du reset à {email}: {str(e)}")