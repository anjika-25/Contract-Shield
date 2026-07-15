import os
import unittest
import sys

# Add parent dir to path so we can import services
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import services.database_service as db_service

class TestDatabaseService(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Override DB_PATH for tests so we don't overwrite production DB
        cls.test_db_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
            "test_legallens.db"
        )
        db_service.DB_PATH = cls.test_db_path
        
    def setUp(self):
        # Initialize test database tables before each test
        db_service.init_db()
        
    def tearDown(self):
        # Remove test database file if it exists
        if os.path.exists(self.test_db_path):
            try:
                os.remove(self.test_db_path)
            except OSError:
                pass
                
    def test_database_crud(self):
        # 1. Verify history is empty initially
        history = db_service.get_all_contracts()
        self.assertEqual(len(history), 0)
        
        # 2. Test Insert
        mock_contract = {
            "id": "h_test_123",
            "name": "Test_Agreement.pdf",
            "date": "Today, 12:00 PM",
            "type": "pdf",
            "riskScore": 45,
            "riskLevel": "Medium Risk",
            "summary": "This is a test summary for database verification.",
            "obligations": [
                {"name": "Complete the work on time", "status": "Active", "severity": "success"},
                {"name": "Do not share secrets", "status": "Active", "severity": "warning"}
            ],
            "clauses": [
                {
                    "id": "clause-new-0",
                    "title": "🔴 Uncapped Liability",
                    "severity": "high",
                    "text": "Liability is uncapped.",
                    "risk": "Huge risk",
                    "explanation": "Test explanation.",
                    "recommendation": "Negotiate a cap."
                }
            ]
        }
        
        db_service.insert_contract(mock_contract)
        
        # 3. Test Retrieve
        history = db_service.get_all_contracts()
        self.assertEqual(len(history), 1)
        
        retrieved = history[0]
        self.assertEqual(retrieved["id"], mock_contract["id"])
        self.assertEqual(retrieved["name"], mock_contract["name"])
        self.assertEqual(retrieved["date"], mock_contract["date"])
        self.assertEqual(retrieved["type"], mock_contract["type"])
        self.assertEqual(retrieved["riskScore"], mock_contract["riskScore"])
        self.assertEqual(retrieved["riskLevel"], mock_contract["riskLevel"])
        self.assertEqual(retrieved["summary"], mock_contract["summary"])
        
        # Verify serialized fields
        self.assertEqual(len(retrieved["obligations"]), 2)
        self.assertEqual(retrieved["obligations"][0]["name"], mock_contract["obligations"][0]["name"])
        self.assertEqual(len(retrieved["clauses"]), 1)
        self.assertEqual(retrieved["clauses"][0]["title"], mock_contract["clauses"][0]["title"])
        
        # 4. Test Delete
        deleted = db_service.delete_contract("h_test_123")
        self.assertTrue(deleted)
        
        history = db_service.get_all_contracts()
        self.assertEqual(len(history), 0)
        
        # Deleting a non-existent item should return False
        deleted_non_existent = db_service.delete_contract("h_test_123")
        self.assertFalse(deleted_non_existent)

if __name__ == "__main__":
    unittest.main()
