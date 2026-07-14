import json
import re
import logging
from typing import Any, Dict, Optional, Tuple
from services.risk_taxonomy import RISK_CATEGORIES, RISK_LEVELS

logger = logging.getLogger(__name__)

def clean_json_string(raw_str: str) -> str:
    """
    Cleans common formatting issues from LLM JSON responses.
    This includes stripping markdown tags and cleaning trailing commas.
    """
    if not raw_str:
        return ""
        
    cleaned = raw_str.strip()
    
    # Remove markdown code block markers
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    
    cleaned = cleaned.strip()
    
    # Remove trailing commas before closing braces/brackets in JSON
    # e.g., {"key": "val",} -> {"key": "val"}
    cleaned = re.sub(r',\s*([\]}])', r'\1', cleaned)
    
    return cleaned

def auto_close_json(json_str: str) -> str:
    """
    Attempts to repair basic truncated JSON by closing open braces and brackets.
    """
    in_string = False
    escape = False
    stack = []
    
    for idx, char in enumerate(json_str):
        if escape:
            escape = False
            continue
        if char == '\\':
            escape = True
            continue
        if char == '"':
            in_string = not in_string
            continue
        if not in_string:
            if char in '{[':
                stack.append(char)
            elif char in ']}':
                if not stack:
                    break  # Unbalanced closing brackets, stop repair
                top = stack[-1]
                if (char == '}' and top == '{') or (char == ']' and top == '['):
                    stack.pop()
                else:
                    break  # Mismatched bracket type, stop repair
                    
    if in_string:
        json_str += '"'
        
    while stack:
        top = stack.pop()
        if top == '{':
            json_str += '}'
        elif top == '[':
            json_str += ']'
            
    return json_str

def validate_analysis_schema(data: Any) -> Tuple[bool, Optional[str]]:
    """
    Validates that the parsed data matches the expected schema and risk taxonomy.
    
    Returns:
        (is_valid, error_message)
    """
    if not isinstance(data, dict):
        return False, "Root structure is not a JSON object."
        
    required_keys = {"summary", "obligations", "risky_clauses", "questions"}
    missing_keys = required_keys - data.keys()
    if missing_keys:
        return False, f"Missing required keys: {', '.join(missing_keys)}"
        
    if not isinstance(data["summary"], str):
        return False, "'summary' must be a string."
        
    if not isinstance(data["obligations"], list) or not all(isinstance(x, str) for x in data["obligations"]):
        return False, "'obligations' must be a list of strings."
        
    if not isinstance(data["questions"], list) or not all(isinstance(x, str) for x in data["questions"]):
        return False, "'questions' must be a list of strings."
        
    if not isinstance(data["risky_clauses"], list):
        return False, "'risky_clauses' must be a list."
        
    for idx, clause in enumerate(data["risky_clauses"]):
        if not isinstance(clause, dict):
            return False, f"risky_clauses[{idx}] is not an object."
            
        clause_keys = {"category", "risk", "reason"}
        missing_clause_keys = clause_keys - clause.keys()
        if missing_clause_keys:
            return False, f"risky_clauses[{idx}] missing keys: {', '.join(missing_clause_keys)}"
            
        category = clause["category"]
        risk = clause["risk"]
        reason = clause["reason"]
        
        # Verify against exact risk taxonomy categories
        if category not in RISK_CATEGORIES:
            return False, f"risky_clauses[{idx}] has invalid category '{category}'. Must be one of: {', '.join(sorted(RISK_CATEGORIES))}"
            
        # Verify risk level
        if risk not in RISK_LEVELS:
            return False, f"risky_clauses[{idx}] has invalid risk level '{risk}'. Must be one of: {', '.join(sorted(RISK_LEVELS))}"
            
        if not isinstance(reason, str):
            return False, f"risky_clauses[{idx}] 'reason' must be a string."
            
    return True, None

def parse_and_validate(raw_text: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    Attempts to clean, parse, and validate JSON output.
    
    Returns:
        (parsed_dict, error_message)
    """
    cleaned = clean_json_string(raw_text)
    
    # Try direct parse
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.warning(f"Initial JSON decode failed, attempting auto-close repair. Error: {e}")
        try:
            repaired = auto_close_json(cleaned)
            data = json.loads(repaired)
        except Exception as e2:
            return None, f"Failed to parse JSON even after repair: {e2}"
            
    # Validate structure & taxonomy
    is_valid, err_msg = validate_analysis_schema(data)
    if not is_valid:
        return None, f"JSON validation failed: {err_msg}"
        
    return data, None
