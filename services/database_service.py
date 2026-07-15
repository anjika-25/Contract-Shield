import sqlite3
import os
import json
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "legallens.db")

def get_db_connection():
    """Establishes a connection to the SQLite database with row factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database and creates the contracts table if it doesn't exist."""
    logger.info(f"Initializing SQLite database at: {DB_PATH}")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contracts (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            type TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            summary TEXT NOT NULL,
            obligations TEXT NOT NULL,
            clauses TEXT NOT NULL,
            contract_type TEXT NOT NULL DEFAULT 'Unknown',
            clean_text TEXT NOT NULL DEFAULT ''
        )
    """)
    conn.commit()
    
    # Run migrations for existing databases
    try:
        cursor.execute("ALTER TABLE contracts ADD COLUMN contract_type TEXT NOT NULL DEFAULT 'Unknown'")
        conn.commit()
        logger.info("Migrated database: added contract_type column.")
    except sqlite3.OperationalError:
        pass # Column already exists
        
    try:
        cursor.execute("ALTER TABLE contracts ADD COLUMN clean_text TEXT NOT NULL DEFAULT ''")
        conn.commit()
        logger.info("Migrated database: added clean_text column.")
    except sqlite3.OperationalError:
        pass # Column already exists
        
    conn.close()

def insert_contract(contract_data: Dict[str, Any]) -> None:
    """Inserts a new contract analysis result into the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Serialize lists to JSON strings
    obligations_json = json.dumps(contract_data.get("obligations", []))
    clauses_json = json.dumps(contract_data.get("clauses", []))
    
    cursor.execute("""
        INSERT INTO contracts (id, name, date, type, risk_score, risk_level, summary, obligations, clauses, contract_type, clean_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        contract_data["id"],
        contract_data["name"],
        contract_data["date"],
        contract_data["type"],
        contract_data["riskScore"],
        contract_data["riskLevel"],
        contract_data["summary"],
        obligations_json,
        clauses_json,
        contract_data.get("contractType", "Unknown"),
        contract_data.get("cleanText", "")
    ))
    conn.commit()
    conn.close()
    logger.info(f"Contract {contract_data['id']} successfully inserted into database.")

def get_all_contracts() -> List[Dict[str, Any]]:
    """Retrieves all contract records from the database, ordered by date descending."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM contracts")
    rows = cursor.fetchall()
    conn.close()
    
    contracts = []
    for row in rows:
        # Support older schema gracefully if columns are missing
        c_type = row["contract_type"] if "contract_type" in row.keys() else "Unknown"
        c_text = row["clean_text"] if "clean_text" in row.keys() else ""
        
        contracts.append({
            "id": row["id"],
            "name": row["name"],
            "date": row["date"],
            "type": row["type"],
            "riskScore": row["risk_score"],
            "riskLevel": row["risk_level"],
            "summary": row["summary"],
            "obligations": json.loads(row["obligations"]),
            "clauses": json.loads(row["clauses"]),
            "contractType": c_type,
            "cleanText": c_text
        })
    # Sort order is reversed insertion order (newest first)
    return list(reversed(contracts))

def get_contract_by_id(contract_id: str) -> Dict[str, Any] or None:
    """Retrieves a single contract record by ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM contracts WHERE id = ?", (contract_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
        
    c_type = row["contract_type"] if "contract_type" in row.keys() else "Unknown"
    c_text = row["clean_text"] if "clean_text" in row.keys() else ""
    
    return {
        "id": row["id"],
        "name": row["name"],
        "date": row["date"],
        "type": row["type"],
        "riskScore": row["risk_score"],
        "riskLevel": row["risk_level"],
        "summary": row["summary"],
        "obligations": json.loads(row["obligations"]),
        "clauses": json.loads(row["clauses"]),
        "contractType": c_type,
        "cleanText": c_text
    }

def delete_contract(contract_id: str) -> bool:
    """Deletes a contract record by ID. Returns True if deleted, False otherwise."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM contracts WHERE id = ?", (contract_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    if deleted:
        logger.info(f"Contract {contract_id} successfully deleted from database.")
    else:
        logger.warning(f"Attempted to delete contract {contract_id} but it was not found.")
    return deleted
