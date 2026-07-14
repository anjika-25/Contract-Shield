import os
import sys

# Add the parent directory of tests/ to the path so we can import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import config

def test_api_key():
    print("Testing Gemini API Key Loading...")
    
    # Check if API Key is loaded
    api_key = config.GEMINI_API_KEY
    if not api_key:
        print("Error: GEMINI_API_KEY is not set (None or empty).")
        return False
        
    if api_key == "your_gemini_api_key_here":
        print("Error: GEMINI_API_KEY is still set to the placeholder value.")
        return False
        
    # Mask key for printing
    masked_key = api_key[:4] + "*" * (len(api_key) - 8) + api_key[-4:] if len(api_key) > 8 else "****"
    print(f"Loaded API Key: {masked_key}")
    print(f"Configured Model: {config.GEMINI_MODEL}")
    
    try:
        import google.generativeai as genai
        # Configure model
        genai.configure(api_key=api_key)
        
        # Test generation
        print("Sending test request to Gemini API (gemini-2.5-flash)...")
        model = genai.GenerativeModel(config.GEMINI_MODEL)
        response = model.generate_content("Say 'Gemini Connection Successful!' in exactly one line.")
        
        print("\nResponse from Gemini API:")
        print(response.text.strip())
        print("\nAPI connection verified successfully!")
        return True
    except Exception as e:
        print(f"\nError occurred during API test: {str(e)}")
        return False

if __name__ == "__main__":
    test_api_key()
