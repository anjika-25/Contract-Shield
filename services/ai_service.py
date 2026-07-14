import logging
from typing import Any, Dict
from services.prompts import SYSTEM_PROMPT, ANALYSIS_USER_PROMPT_TEMPLATE
from services.llm_client import generate_completion
from services.json_parser import parse_and_validate

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def analyze_contract(clean_text: str) -> Dict[str, Any]:
    """
    Analyzes the clean contract text using Gemini, parses and validates the JSON output.
    Implements a self-correction retry loop if the output is malformed or violates the risk taxonomy.
    
    Args:
        clean_text: The contract text to analyze.
        
    Returns:
        A dictionary matching the required JSON schema:
        {
            "summary": "...",
            "obligations": ["...", "..."],
            "risky_clauses": [{"category": "...", "risk": "...", "reason": "..."}],
            "questions": ["...", "..."]
        }
    """
    if not clean_text or not clean_text.strip():
        logger.warning("Empty contract text passed to analyze_contract.")
        return {
            "summary": "No contract text was provided for analysis.",
            "obligations": [],
            "risky_clauses": [],
            "questions": []
        }

    # Format the initial prompt with the contract text
    user_prompt = ANALYSIS_USER_PROMPT_TEMPLATE.format(clean_text=clean_text)
    
    max_attempts = 3
    current_attempt = 1
    
    active_prompt = user_prompt
    active_system_prompt = SYSTEM_PROMPT
    
    while current_attempt <= max_attempts:
        try:
            logger.info(f"Starting contract analysis attempt {current_attempt}/{max_attempts}...")
            
            # Call Gemini
            raw_response = generate_completion(
                prompt=active_prompt,
                system_instruction=active_system_prompt,
                json_mode=True
            )
            
            # Parse and validate the response
            data, error_msg = parse_and_validate(raw_response)
            
            if data is not None:
                logger.info("Contract analysis successfully completed and validated.")
                return data
                
            logger.warning(f"Attempt {current_attempt} returned invalid JSON or taxonomy violation: {error_msg}")
            
            # Self-correction prompt for next attempt
            active_prompt = (
                f"Your previous response was invalid and failed schema validation for the following reason:\n"
                f"ERROR: {error_msg}\n\n"
                f"Here is the malformed or invalid output you provided:\n"
                f"---MALFORMED OUTPUT---\n"
                f"{raw_response}\n"
                f"-----------------------\n\n"
                f"Please review the original contract text and output a fully valid, corrected JSON object.\n"
                f"Ensure all keys match the schema exactly and all categories map strictly to the taxonomy.\n\n"
                f"Original contract text:\n"
                f"---CONTRACT TEXT---\n"
                f"{clean_text}\n"
                f"-------------------\n"
            )
            
        except Exception as e:
            logger.error(f"Error during analysis attempt {current_attempt}: {e}")
            if current_attempt == max_attempts:
                # Raise error if this was the last attempt
                raise e
                
        current_attempt += 1
        
    # If all attempts exhausted
    raise ValueError("Failed to obtain a valid parsed and validated JSON response from the LLM after maximum attempts.")
