import os
import time
from datetime import datetime
from flask import Blueprint, request, jsonify, render_template
from werkzeug.utils import secure_filename
from config import Config
from services.document_service import allowed_file, extract_contract
from services.ai_service import analyze_contract, chat_about_contract, generate_clause_redrafts, compare_contracts
from services.database_service import insert_contract, get_all_contracts, delete_contract, get_contract_by_id
from services.contract_type import classify_contract_type

bp = Blueprint('routes', __name__)

def map_analysis_to_db_record(filename: str, analysis: dict, contract_type: str = "Unknown", clean_text: str = "") -> dict:
    """Maps raw LLM analysis output to the database record structure."""
    high_count = 0
    medium_count = 0
    low_count = 0
    
    clauses_mapped = []
    for idx, clause in enumerate(analysis.get("risky_clauses", [])):
        risk_lower = clause.get("risk", "low").lower()
        if risk_lower == "high":
            high_count += 1
        elif risk_lower == "medium":
            medium_count += 1
        else:
            low_count += 1
            
        emoji = "🔴" if risk_lower == "high" else "🟠" if risk_lower == "medium" else "🟢"
        category = clause.get("category", "General")
        reason = clause.get("reason", "")
        
        clauses_mapped.append({
            "id": f"clause-new-{idx}",
            "title": f"{emoji} {category}",
            "severity": risk_lower,
            "text": f"This agreement is subject to terms and covenants governing the {category} category.",
            "risk": reason,
            "explanation": f"A clause related to {category} was flagged with {clause.get('risk')} risk rating because: {reason}.",
            "recommendation": f"Check the exact terms of the {category} clause. Suggest negotiating or modifying it based on: {reason}."
        })
        
    if not clauses_mapped:
        clauses_mapped.append({
            "id": "clause-new-none",
            "title": "🟢 No Major Risks Detected",
            "severity": "low",
            "text": "This contract contains standard and compliant clauses with no high or medium risks found.",
            "risk": "No major risks identified by the AI Engine.",
            "explanation": "All extracted clauses align with standard commercial parameters.",
            "recommendation": "No immediate redrafting required."
        })
        low_count = 1
        
    score = min(100, (high_count * 30) + (medium_count * 15) + (low_count * 5))
    level = "High Risk" if score >= 70 else "Medium Risk" if score >= 30 else "Low Risk"
    
    obligations_mapped = []
    for ob in analysis.get("obligations", []):
        obligations_mapped.append({
            "name": ob,
            "status": "Active",
            "severity": "success"
        })
    if not obligations_mapped:
        obligations_mapped.append({
            "name": "No explicit obligations extracted.",
            "status": "Standard",
            "severity": "success"
        })
        
    ext = filename.split('.')[-1].lower() if '.' in filename else 'pdf'
    scan_time = datetime.now().strftime("%I:%M %p")
    date_str = f"Today, {scan_time}"
    
    return {
        "id": f"h_new_{int(time.time() * 1000)}",
        "name": filename,
        "date": date_str,
        "type": ext,
        "riskScore": score,
        "riskLevel": level,
        "summary": analysis.get("summary", ""),
        "obligations": obligations_mapped,
        "clauses": clauses_mapped,
        "contractType": contract_type,
        "cleanText": clean_text
    }

@bp.route('/')
def home():
    return render_template('index.html')

@bp.route('/history', methods=['GET'])
def get_history():
    """Retrieves all stored contract scan results from the database."""
    try:
        contracts = get_all_contracts()
        return jsonify(contracts), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve history: {str(e)}"}), 500

@bp.route('/delete/<contract_id>', methods=['DELETE'])
def delete_history_item(contract_id):
    """Deletes a contract scan result from the database."""
    try:
        deleted = delete_contract(contract_id)
        if deleted:
            return jsonify({"success": True}), 200
        else:
            return jsonify({"error": "Contract record not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to delete record: {str(e)}"}), 500

@bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part identified within request metadata."}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No file has been selected for processing."}), 400
        
    if not allowed_file(file.filename, Config.ALLOWED_EXTENSIONS):
        return jsonify({"error": "Unsupported file format. Please upload a valid .pdf or .docx file."}), 400
        
    try:
        filename = secure_filename(file.filename)
        save_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(save_path)
        
        if os.path.getsize(save_path) == 0:
            os.remove(save_path)
            return jsonify({"error": "Rejected empty file (0 bytes detected)."}), 400
            
        # Execute processing layer pipeline
        result = extract_contract(save_path, filename)
        
        # Execute AI analysis pipeline
        analysis_result = analyze_contract(result["clean_text"])
        
        # Classify contract type
        contract_type = classify_contract_type(result["clean_text"])
        
        # Map and save to database
        db_record = map_analysis_to_db_record(filename, analysis_result, contract_type, result["clean_text"])
        insert_contract(db_record)
        
        # Return the database record
        result["analysis"] = db_record
        
        if os.path.exists(save_path):
            os.remove(save_path)
            
        return jsonify(result), 200
        
    except ValueError as ve:
        if os.path.exists(save_path):
            os.remove(save_path)
        return jsonify({"error": str(ve)}), 422
        
    except Exception as e:
        if 'save_path' in locals() and os.path.exists(save_path):
            os.remove(save_path)
        return jsonify({"error": f"Internal system ingestion failure: {str(e)}"}), 500

@bp.route('/chat', methods=['POST'])
def chat():
    """Endpoint to handle interactive QA chat about the active contract."""
    data = request.json or {}
    contract_id = data.get("contract_id")
    question = data.get("question")
    chat_history = data.get("chat_history", [])
    
    if not question or not question.strip():
        return jsonify({"error": "No question was provided."}), 400
        
    try:
        if not contract_id:
            return jsonify({"error": "No active contract ID specified."}), 400
            
        contract = get_contract_by_id(contract_id)
        if not contract:
            return jsonify({"error": "Contract record not found. Please upload or select a contract."}), 404
            
        # Run Q&A
        answer = chat_about_contract(contract.get("cleanText", ""), question, chat_history)
        return jsonify({"answer": answer}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to generate answer: {str(e)}"}), 500

@bp.route('/redraft', methods=['POST'])
def redraft_clause():
    """Endpoint to generate 3 alternative drafts of a risky clause."""
    data = request.json or {}
    clause_text = data.get("clause_text")
    risk_reason = data.get("risk_reason")
    
    if not clause_text or not clause_text.strip():
        return jsonify({"error": "No clause text was provided."}), 400
        
    try:
        redrafts = generate_clause_redrafts(clause_text, risk_reason or "")
        return jsonify(redrafts), 200
    except Exception as e:
        return jsonify({"error": f"Failed to generate redrafts: {str(e)}"}), 500

@bp.route('/compare', methods=['POST'])
def compare_uploaded_contracts():
    """Endpoint to handle side-by-side comparison of draft and template files."""
    if 'draft' not in request.files or 'template' not in request.files:
        return jsonify({"error": "Both draft and template files must be uploaded."}), 400
        
    draft_file = request.files['draft']
    template_file = request.files['template']
    
    if draft_file.filename == '' or template_file.filename == '':
        return jsonify({"error": "Empty selection identified for one or both files."}), 400
        
    if not allowed_file(draft_file.filename, Config.ALLOWED_EXTENSIONS) or not allowed_file(template_file.filename, Config.ALLOWED_EXTENSIONS):
        return jsonify({"error": "Unsupported file format. Please upload PDF or DOCX documents."}), 400
        
    draft_path = None
    template_path = None
    try:
        draft_name = secure_filename(draft_file.filename)
        draft_path = os.path.join(Config.UPLOAD_FOLDER, f"draft_{draft_name}")
        draft_file.save(draft_path)
        
        template_name = secure_filename(template_file.filename)
        template_path = os.path.join(Config.UPLOAD_FOLDER, f"template_{template_name}")
        template_file.save(template_path)
        
        # Extract texts
        draft_res = extract_contract(draft_path, draft_name)
        template_res = extract_contract(template_path, template_name)
        
        # Run comparison
        comparison_result = compare_contracts(draft_res["clean_text"], template_res["clean_text"])
        
        # Clean up temporary files
        if os.path.exists(draft_path):
            os.remove(draft_path)
        if os.path.exists(template_path):
            os.remove(template_path)
            
        return jsonify(comparison_result), 200
        
    except Exception as e:
        if draft_path and os.path.exists(draft_path):
            os.remove(draft_path)
        if template_path and os.path.exists(template_path):
            os.remove(template_path)
        return jsonify({"error": f"Failed to complete document comparison: {str(e)}"}), 500
