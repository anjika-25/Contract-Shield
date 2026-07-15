import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

# Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Default model: gemini-1.5-flash (which offers a much higher free quota of 1500 requests/day compared to 20/day on 3.5)
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "legallens_secret_key_123!")
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # Strict 10 MB limit
    ALLOWED_EXTENSIONS = {"pdf", "docx"}

# Ensure the upload directory exists dynamically
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
