import os
import re
import pdfplumber
from docx import Document
from werkzeug.utils import secure_filename

def allowed_file(filename, allowed_extensions):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def clean_extracted_text(text):
    """Removes standard headers, footers, consecutive blank spaces, and lines."""
    if not text:
        return ""
    
    # Remove obvious running headers/footers like 'Page X', 'Page X of Y', or 'CONFIDENTIAL'
    text = re.sub(r'(?i)^\s*(page|pg\.?)\s*\d+.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'(?i)^\s*confidential\s*$', '', text, flags=re.MULTILINE)
    
    # Normalize structural spacing
    text = re.sub(r'[ \t]+', ' ', text)  # Collapse multiple spaces/tabs
    text = re.sub(r'\n\s*\n+', '\n\n', text)  # Keep exact uniform paragraph spacing
    
    return text.strip()

def chunk_text(text, target_words=2000):
    """Chunks text cleanly without splitting intermediate sentences or legal clauses."""
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = []
    current_word_count = 0
    
    for idx, paragraph in enumerate(paragraphs):
        paragraph_words = len(paragraph.split())
        if not paragraph.strip():
            continue
            
        # If adding this paragraph exceeds the soft target threshold, commit current chunk
        if current_word_count + paragraph_words > target_words and current_chunk:
            chunks.append({
                "chunk_id": len(chunks) + 1,
                "text": "\n\n".join(current_chunk)
            })
            current_chunk = []
            current_word_count = 0
            
        current_chunk.append(paragraph)
        current_word_count += paragraph_words
        
    if current_chunk:
        chunks.append({
            "chunk_id": len(chunks) + 1,
            "text": "\n\n".join(current_chunk)
        })
        
    return chunks

def extract_contract(file_path, filename):
    """
    Primary processing engine: Accepts file, reads content, applies 
    cleaning rules, chunks text, and outputs data model downstream.
    """
    ext = filename.rsplit('.', 1)[1].lower()
    raw_text = ""
    
    if ext == 'pdf':
        try:
            with pdfplumber.open(file_path) as pdf:
                if len(pdf.pages) == 0:
                    raise ValueError("The uploaded PDF contains 0 pages.")
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        raw_text += page_text + "\n"
        except Exception as e:
            raise ValueError(f"Corrupted or unreadable PDF document: {str(e)}")
            
    elif ext == 'docx':
        try:
            doc = Document(file_path)
            paragraphs = [p.text for p in doc.paragraphs if p.text]
            if not paragraphs:
                raise ValueError("The uploaded DOCX contains no extractable paragraphs.")
            raw_text = "\n\n".join(paragraphs)
        except Exception as e:
            raise ValueError(f"Corrupted or unreadable DOCX document: {str(e)}")

    clean_text = clean_extracted_text(raw_text)
    
    if not clean_text or len(clean_text.strip()) == 0:
        raise ValueError("Document contains no readable text layers.")
        
    chunks = chunk_text(clean_text)
    
    return {
        "filename": filename,
        "clean_text": clean_text,
        "chunks": chunks
    }