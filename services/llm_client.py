import google.generativeai as genai
import config
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure the Gemini API key
if config.GEMINI_API_KEY:
    genai.configure(api_key=config.GEMINI_API_KEY)
else:
    logger.warning("GEMINI_API_KEY is not configured. Gemini API calls will fail.")

def generate_completion(prompt: str, system_instruction: str = None, json_mode: bool = False) -> str:
    """
    Calls the Gemini API to generate content.
    
    Args:
        prompt: The main user prompt.
        system_instruction: Optional system instruction/prompt.
        json_mode: If True, forces the response to be in JSON format.
        
    Returns:
        The raw text response from the model.
    """
    try:
        model_name = config.GEMINI_MODEL
        
        generation_config = {}
        if json_mode:
            generation_config["response_mime_type"] = "application/json"
            
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=system_instruction,
            generation_config=generation_config
        )
        
        logger.info(f"Invoking Gemini model '{model_name}' (JSON mode: {json_mode})...")
        response = model.generate_content(prompt)
        
        if not response.text:
            raise ValueError("Received empty response from Gemini API.")
            
        return response.text
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        raise e
