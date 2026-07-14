import os
import sys

# Add the parent directory of tests/ to the path so we can import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import config
import google.generativeai as genai

genai.configure(api_key=config.GEMINI_API_KEY)

try:
    print("Listing available models:")
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            print(f" - {m.name}")
except Exception as e:
    print(f"Error: {e}")
