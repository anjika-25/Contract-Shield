import os
from flask import Blueprint, request, jsonify, render_template
from werkzeug.utils import secure_filename
from config import Config
from services.document_service import allowed_file, extract_contract
from services.ai_service import analyze_contract

bp = Blueprint('routes', __name__)

@bp.route('/')
def home():
    return render_template('index.html')

@bp.route('/upload', methods=['POST'])
def upload_file():
    # Check if file field is completely missing from request body
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
        
        # Check explicit post-upload blank file constraint
        if os.path.getsize(save_path) == 0:
            os.remove(save_path)
            return jsonify({"error": "Rejected empty file (0 bytes detected)."}), 400
            
        # Execute processing layer pipeline
        result = extract_contract(save_path, filename)
        
        # Execute AI analysis pipeline
        analysis_result = analyze_contract(result["clean_text"])
        result["analysis"] = analysis_result
        
        # Clean up temporary storage space tracking
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
