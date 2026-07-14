import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

# Gemini Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Default model: gemini-3.5-flash (since gemini-2.5-flash is deprecated/unavailable)
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "legallens_secret_key_123!")
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # Strict 10 MB limit
    ALLOWED_EXTENSIONS = {"pdf", "docx"}

# Ensure the upload directory exists dynamically
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
