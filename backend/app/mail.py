import os
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pathlib import Path

conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_PORT = int(os.getenv("MAIL_PORT")),
    MAIL_SERVER = os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True,
    TEMPLATE_FOLDER = Path(__file__).parent / 'templates',
)
async def send_verification_email(email_to: str, token: str):
    verify_url = f"http://localhost:8000/verify-email?token={token}"
    
    html = f"""
    <html>
        <body>
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour confirmer votre compte :</p>
            <a href="{verify_url}" style="padding: 10px; background-color: #4CAF50; color: white; text-decoration: none;">
                Confirmer mon compte
            </a>
            <p>Ce lien expirera dans 24 heures.</p>
        </body>
    </html>
    """

    message = MessageSchema(
        subject="Activation de votre compte",
        recipients=[email_to],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)

async def send_reset_password_email(email_to: str, token: str):
    reset_url = f"http://localhost:5173/reset-password?token={token}" # Lien vers le Front-end
    html = f"<p>Cliquez ici pour réinitialiser votre mot de passe : <a href='{reset_url}'>Reset Password</a></p>"
    
    message = MessageSchema(
        subject="Réinitialisation de mot de passe",
        recipients=[email_to],
        body=html,
        subtype=MessageType.html
    )
    fm = FastMail(conf)
    await fm.send_message(message)

