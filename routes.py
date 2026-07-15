import os
import time
from datetime import datetime
from flask import Blueprint, request, jsonify, render_template
from werkzeug.utils import secure_filename
from config import Config
from services.document_service import allowed_file, extract_contract
from services.ai_service import analyze_contract
from services.contract_type import classify_contract_type
from services.database_service import insert_contract, get_all_contracts, delete_contract

bp = Blueprint('routes', __name__)

def map_analysis_to_db_record(filename: str, analysis: dict, contract_type: str) -> dict:
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
        location = clause.get("location", "Unknown")
        
        # Format title to include section location
        title_str = f"{emoji} {category} ({location})" if location != "Unknown" else f"{emoji} {category}"
        
        clauses_mapped.append({
            "id": f"clause-new-{idx}",
            "title": title_str,
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
    
    # Extract questions list directly
    questions_list = analysis.get("questions", [])
    
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
        "questions": questions_list
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
        db_record = map_analysis_to_db_record(filename, analysis_result, contract_type)
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
