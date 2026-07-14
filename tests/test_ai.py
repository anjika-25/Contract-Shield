import os
import sys
import json

# Add the parent directory of tests/ to the path so we can import services/config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.ai_service import analyze_contract
from services.contract_type import classify_contract_type
from services.risk_taxonomy import RISK_CATEGORIES, RISK_LEVELS

def test_contract_analysis():
    print("==================================================")
    print("Testing LegalLens AI Contract Analysis Pipeline")
    print("==================================================")
    
    # 1. Path to sample contract
    sample_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "sample_contracts",
        "sample_nda.txt"
    )
    
    if not os.path.exists(sample_path):
        print(f"Error: Sample contract file not found at {sample_path}")
        return False
        
    # 2. Read the sample contract
    print(f"Reading sample contract from: {sample_path}")
    with open(sample_path, "r", encoding="utf-8") as f:
        clean_text = f.read()
        
    print(f"Loaded contract text ({len(clean_text)} characters).")
    
    # 3. Call classification
    print("Invoking classify_contract_type(clean_text)...")
    contract_type = classify_contract_type(clean_text)
    print(f"[RESULT] Contract Type Classified as: '{contract_type}'")
    
    # 4. Call analysis pipeline
    print("Invoking analyze_contract(clean_text)...")
    try:
        result = analyze_contract(clean_text)
        
        # 4. Perform validation checks
        print("\n--- Validation Checks ---")
        assert isinstance(result, dict), "Result must be a dictionary."
        print("[PASS] Result is a dictionary.")
        
        expected_keys = {"summary", "obligations", "risky_clauses", "questions"}
        for key in expected_keys:
            assert key in result, f"Result missing key: {key}"
        print("[PASS] All expected keys present.")
        
        assert isinstance(result["summary"], str) and len(result["summary"]) > 0, "'summary' must be a non-empty string."
        print("[PASS] 'summary' is a valid string.")
        
        assert isinstance(result["obligations"], list), "'obligations' must be a list."
        assert len(result["obligations"]) > 0, "'obligations' list cannot be empty."
        assert all(isinstance(o, str) for o in result["obligations"]), "All obligations must be strings."
        print(f"[PASS] 'obligations' is a list of {len(result['obligations'])} strings.")
        
        assert isinstance(result["questions"], list), "'questions' must be a list."
        assert all(isinstance(q, str) for q in result["questions"]), "All questions must be strings."
        print(f"[PASS] 'questions' is a list of {len(result['questions'])} strings.")
        
        assert isinstance(result["risky_clauses"], list), "'risky_clauses' must be a list."
        for idx, rc in enumerate(result["risky_clauses"]):
            assert isinstance(rc, dict), f"risky_clauses[{idx}] must be a dictionary."
            assert "category" in rc, f"risky_clauses[{idx}] missing 'category'."
            assert "risk" in rc, f"risky_clauses[{idx}] missing 'risk'."
            assert "reason" in rc, f"risky_clauses[{idx}] missing 'reason'."
            
            assert rc["category"] in RISK_CATEGORIES, f"risky_clauses[{idx}] has invalid category '{rc['category']}'."
            assert rc["risk"] in RISK_LEVELS, f"risky_clauses[{idx}] has invalid risk rating '{rc['risk']}'."
            assert isinstance(rc["reason"], str) and len(rc["reason"]) > 0, f"risky_clauses[{idx}] 'reason' must be a non-empty string."
            
        print(f"[PASS] 'risky_clauses' list is valid and complies with risk taxonomy (found {len(result['risky_clauses'])} clauses).")
        
        print("\n--- Output JSON Summary ---")
        print(json.dumps(result, indent=2))
        print("\n==================================================")
        print("Integration Test Successful!")
        print("==================================================")
        return True
        
    except AssertionError as ae:
        print(f"\n[FAIL] Validation Assertion Failed: {ae}")
        return False
    except Exception as e:
        print(f"\n[FAIL] Pipeline Execution Failed with exception: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_contract_analysis()
    sys.exit(0 if success else 1)
