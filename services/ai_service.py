import logging
from typing import Any, Dict
from services.prompts import SYSTEM_PROMPT, ANALYSIS_USER_PROMPT_TEMPLATE, COMPARE_SYSTEM_PROMPT, COMPARE_USER_PROMPT_TEMPLATE
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

def chat_about_contract(clean_text: str, question: str, chat_history: list = None) -> str:
    """
    Queries Gemini with a custom user question grounded strictly in the contract text.
    
    Args:
        clean_text: The full text of the contract.
        question: The user's query.
        chat_history: List of dictionary messages representing past chat turns.
        
    Returns:
        The markdown response from the LLM.
    """
    if not clean_text or not clean_text.strip():
        return "Please upload a contract first before asking questions."
        
    if chat_history is None:
        chat_history = []
        
    history_context = ""
    for msg in chat_history:
        role = "User" if msg.get("sender") == "user" else "Assistant"
        history_context += f"{role}: {msg.get('text')}\n"

    system_instruction = (
        "You are an expert AI contract attorney and legal assistant. "
        "Your goal is to answer the user's questions about the provided contract text. "
        "Be clear, precise, and directly quote sections of the contract where relevant. "
        "Provide your answer in clean Markdown format. "
        "Do not make up facts or terms that are not in the contract. Keep answers concise."
    )
    
    prompt = (
        f"Here is the contract text:\n"
        f"--- CONTRACT START ---\n"
        f"{clean_text[:30000]}\n"  # Guard against token limits
        f"--- CONTRACT END ---\n\n"
        f"Here is the conversation history:\n"
        f"{history_context}\n"
        f"User Question: {question}\n\n"
        f"Please provide your answer based strictly on the contract text."
    )
    
    try:
        response = generate_completion(
            prompt=prompt,
            system_instruction=system_instruction,
            json_mode=False
        )
        return response.strip()
    except Exception as e:
        logger.error(f"Error in chat_about_contract: {e}")
        return f"Sorry, I encountered an error while analyzing your question: {str(e)}"

def generate_clause_redrafts(clause_text: str, risk_reason: str) -> dict:
    """
    Generates three alternative compliant drafts of a risky clause:
    1. Conservative: Heavily protective of our interest, limiting liability/scope.
    2. Neutral: A balanced compromise likely to be accepted during negotiation.
    3. Aggressive: Firm but standard stance that pushes boundaries in our favor.
    
    Args:
        clause_text: The original clause text.
        risk_reason: The risk reason or explanation.
        
    Returns:
        A dictionary containing the three alternative redrafts.
    """
    system_instruction = (
        "You are an expert contract negotiator and editor. Your goal is to draft three alternative variations of the provided clause "
        "to resolve the identified legal risks. Return ONLY a valid JSON object matching this schema: "
        "{\n"
        "  \"conservative\": \"Alternative clause text...\",\n"
        "  \"neutral\": \"Alternative clause text...\",\n"
        "  \"aggressive\": \"Alternative clause text...\"\n"
        "}"
    )
    
    prompt = (
        f"Original Clause Text:\n{clause_text}\n\n"
        f"Identified Risk Reason:\n{risk_reason}\n\n"
        f"Provide the three redrafts to address this risk. Ensure they are complete, legally valid, drop-in replacement clauses."
    )
    
    try:
        raw_response = generate_completion(
            prompt=prompt,
            system_instruction=system_instruction,
            json_mode=True
        )
        import json
        data = json.loads(raw_response.strip())
        return {
            "conservative": data.get("conservative", ""),
            "neutral": data.get("neutral", ""),
            "aggressive": data.get("aggressive", "")
        }
    except Exception as e:
        logger.error(f"Error in generate_clause_redrafts: {e}")
        # Return fallback items
        return {
            "conservative": f"Modified: {clause_text} (Consult counsel for conservative revision).",
            "neutral": f"Modified: {clause_text} (Consult counsel for neutral revision).",
            "aggressive": f"Modified: {clause_text} (Consult counsel for aggressive revision)."
        }

def compare_contracts(draft_text: str, template_text: str) -> dict:
    """
    Compares a draft contract against a standard company template/playbook using Gemini.
    Returns structured comparison results: summary, matches list, and deviations list.
    
    Args:
        draft_text: The full text of the draft contract.
        template_text: The full text of the template playbook.
        
    Returns:
        A dictionary containing the parsed comparison JSON object.
    """
    if not draft_text or not draft_text.strip():
        raise ValueError("Draft contract text is empty.")
    if not template_text or not template_text.strip():
        raise ValueError("Company template/playbook text is empty.")
        
    user_prompt = COMPARE_USER_PROMPT_TEMPLATE.format(draft_text=draft_text, template_text=template_text)
    
    try:
        logger.info("Starting AI contract comparison...")
        raw_response = generate_completion(
            prompt=user_prompt,
            system_instruction=COMPARE_SYSTEM_PROMPT,
            json_mode=True
        )
        import json
        data = json.loads(raw_response.strip())
        return data
    except Exception as e:
        logger.error(f"Error during contract comparison: {e}")
        raise e
