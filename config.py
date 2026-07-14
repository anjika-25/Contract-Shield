import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "legallens_secret_key_123!")
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # Strict 10 MB limit
    ALLOWED_EXTENSIONS = {"pdf", "docx"}

# Ensure the upload directory exists dynamically
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)