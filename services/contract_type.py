import logging
from services.llm_client import generate_completion

logger = logging.getLogger(__name__)

def classify_contract_type(clean_text: str) -> str:
    """
    Optionally classifies the contract type (e.g., 'Non-Disclosure Agreement', 
    'Employment Agreement', 'Service Agreement') based on its text content.
    
    Args:
        clean_text: The contract text.
        
    Returns:
        The classified contract type string.
    """
    if not clean_text or not clean_text.strip():
        return "Unknown"
        
    prompt = (
        "Analyze the following contract text and determine its contract type (e.g., 'Non-Disclosure Agreement', "
        "'Employment Agreement', 'Service Level Agreement', 'Lease Agreement', 'Partnership Agreement'). "
        "Return ONLY the classified contract type as a plain text string. Do not include any other words or punctuation.\n\n"
        f"Contract text:\n{clean_text[:4000]}"
    )
    
    try:
        response = generate_completion(
            prompt=prompt,
            system_instruction="You are a precise contract classification utility. Return only the classification category."
        )
        return response.strip()
    except Exception as e:
        logger.error(f"Error classifying contract type: {e}")
        return "Unknown"
